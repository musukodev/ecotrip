package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/ecotrip/backend/internal/ai"
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/lib/pq"
	"gorm.io/datatypes"
)

// ChatService — F-011 s/d F-016: proses pesan chat, revisi itinerary real-time, rollback
type ChatService interface {
	// F-011–F-016: kirim pesan, proses dengan AI, kembalikan balasan
	SendMessage(ctx context.Context, tripID, userID uint64, message string) (*ChatResponse, error)
	// F-011: riwayat chat
	GetHistory(tripID, userID uint64) ([]model.ChatMessage, error)
}

// ChatResponse — response dari endpoint chat
type ChatResponse struct {
	UserMessage  model.ChatMessage   `json:"user_message"`
	AIMessage    model.ChatMessage   `json:"ai_message"`
	IsRevision   bool                `json:"is_revision"`
	ChangeSummary string             `json:"change_summary,omitempty"`
	NewVersion   int                 `json:"new_version,omitempty"`
	UpdatedDays  []model.ItineraryDay `json:"updated_days,omitempty"`
}

type chatService struct {
	aiClient    ai.AIClient
	chatRepo    repository.ChatMessageRepository
	tripRepo    repository.TripRepository
	dayRepo     repository.ItineraryDayRepository
	actRepo     repository.ItineraryActivityRepository
	versionRepo repository.TripVersionRepository
	notifRepo   repository.NotificationRepository
}

func NewChatService(
	aiClient ai.AIClient,
	chatRepo repository.ChatMessageRepository,
	tripRepo repository.TripRepository,
	dayRepo repository.ItineraryDayRepository,
	actRepo repository.ItineraryActivityRepository,
	versionRepo repository.TripVersionRepository,
	notifRepo repository.NotificationRepository,
) ChatService {
	return &chatService{
		aiClient:    aiClient,
		chatRepo:    chatRepo,
		tripRepo:    tripRepo,
		dayRepo:     dayRepo,
		actRepo:     actRepo,
		versionRepo: versionRepo,
		notifRepo:   notifRepo,
	}
}

func (s *chatService) GetHistory(tripID, userID uint64) ([]model.ChatMessage, error) {
	// validasi akses
	if _, err := s.tripRepo.FindByID(tripID, userID); err != nil {
		return nil, fmt.Errorf("trip tidak ditemukan")
	}
	return s.chatRepo.FindByTrip(tripID)
}

func (s *chatService) SendMessage(ctx context.Context, tripID, userID uint64, message string) (*ChatResponse, error) {
	// validasi akses
	trip, err := s.tripRepo.FindByID(tripID, userID)
	if err != nil {
		return nil, fmt.Errorf("trip tidak ditemukan")
	}

	// Simpan pesan user (F-011)
	userMsg := &model.ChatMessage{
		TripID:  tripID,
		Sender:  "user",
		Message: message,
	}
	if err := s.chatRepo.Create(userMsg); err != nil {
		return nil, err
	}

	// Ambil itinerary saat ini sebagai konteks untuk AI
	days, _ := s.dayRepo.FindByTrip(tripID)
	currentItineraryJSON, _ := json.Marshal(days)
	tripContext := fmt.Sprintf("Trip: %s | Destinasi: %s | %d hari | %d orang | Budget: Rp %.0f",
		trip.Title, trip.Destination, trip.DurationDays, trip.Pax, trip.Budget)

	// F-012, F-013, F-014, F-016: kirim ke AI
	result, err := s.aiClient.ChatRevise(ctx, message, string(currentItineraryJSON), tripContext)
	if err != nil {
		// Jika AI gagal, kembalikan error yang user-friendly
		aiMsg := &model.ChatMessage{
			TripID:  tripID,
			Sender:  "ai",
			Message: "Maaf, AI sedang tidak tersedia. Silakan coba lagi.",
		}
		_ = s.chatRepo.Create(aiMsg)
		return &ChatResponse{
			UserMessage: *userMsg,
			AIMessage:   *aiMsg,
		}, nil
	}

	resp := &ChatResponse{
		UserMessage:   *userMsg,
		IsRevision:    result.IsRevision,
		ChangeSummary: result.ChangeSummary,
	}

	if result.IsRevision && len(result.UpdatedDays) > 0 {
		// F-014: update itinerary real-time
		updatedDays, newVersion, err := s.applyRevision(trip, result)
		if err != nil {
			// Revisi gagal — balas dengan pesan error tapi tetap simpan chat
			result.AIResponse = "Maaf, gagal menerapkan perubahan: " + err.Error()
			result.IsRevision = false
		} else {
			resp.UpdatedDays = updatedDays
			resp.NewVersion = newVersion

			// Pesan system konfirmasi update (F-015)
			systemMsg := &model.ChatMessage{
				TripID:          tripID,
				Sender:          "system",
				Message:         fmt.Sprintf("Itinerary diperbarui ✓ · v%d tersimpan", newVersion),
				ResultedVersion: &newVersion,
			}
			_ = s.chatRepo.Create(systemMsg)

			// Notifikasi ke kolaborator trip (F-037)
			refType := "trip"
			refID := tripID
			_ = s.notifRepo.Create(&model.Notification{
				UserID:  userID,
				Type:    "itinerary_updated",
				Title:   "Itinerary Diperbarui",
				Message: result.ChangeSummary,
				RefType: &refType,
				RefID:   &refID,
			})
		}
	}

	// Simpan balasan AI
	aiMsg := &model.ChatMessage{
		TripID:  tripID,
		Sender:  "ai",
		Message: result.AIResponse,
	}
	if result.IsRevision && resp.NewVersion > 0 {
		aiMsg.ResultedVersion = &resp.NewVersion
	}
	if err := s.chatRepo.Create(aiMsg); err != nil {
		return nil, err
	}
	resp.AIMessage = *aiMsg

	return resp, nil
}

// applyRevision — F-014: terapkan perubahan dari AI ke DB, buat versi baru (F-015)
func (s *chatService) applyRevision(trip *model.Trip, result *ai.ChatRevisionResult) ([]model.ItineraryDay, int, error) {
	// Ambil hari yang akan diupdate
	existingDays, err := s.dayRepo.FindByTrip(trip.ID)
	if err != nil {
		return nil, 0, err
	}

	// Buat map day_number → existing day ID
	dayMap := make(map[int]uint64)
	for _, d := range existingDays {
		dayMap[d.DayNumber] = d.ID
	}

	var updatedModelDays []model.ItineraryDay

	for _, updDay := range result.UpdatedDays {
		dayID, exists := dayMap[updDay.DayNumber]
		if !exists {
			continue
		}

		// Hapus aktivitas hari ini, ganti dengan yang baru
		if err := s.actRepo.DeleteByDay(dayID); err != nil {
			return nil, 0, err
		}

		// Buat aktivitas baru
		activities := make([]model.ItineraryActivity, 0, len(updDay.Activities))
		for i, genAct := range updDay.Activities {
			act := model.ItineraryActivity{
				DayID:           dayID,
				SortOrder:       i,
				StartTime:       genAct.StartTime,
				Title:           genAct.Title,
				Description:     genAct.Description,
				Category:        genAct.Category,
				Tags:            pq.StringArray(genAct.Tags),
				DistanceKm:      genAct.DistanceKm,
				DurationMinutes: genAct.DurationMinutes,
				EstimatedCost:   genAct.EstimatedCost,
				CarbonKg:        genAct.CarbonKg,
				IsValidated:     true,
			}
			activities = append(activities, act)
		}
		if err := s.actRepo.BulkCreate(activities); err != nil {
			return nil, 0, err
		}

		// Ambil hari yang sudah diupdate
		updatedDay, _ := s.dayRepo.FindByID(dayID)
		if updatedDay != nil {
			updatedModelDays = append(updatedModelDays, *updatedDay)
		}
	}

	// Ambil snapshot seluruh itinerary untuk versi baru (F-015)
	allDays, _ := s.dayRepo.FindByTrip(trip.ID)
	snapshotBytes, _ := json.Marshal(allDays)

	// Nomor versi baru
	latestVersion, _ := s.versionRepo.LatestVersion(trip.ID)
	newVersion := latestVersion + 1

	// Simpan versi baru
	if err := s.versionRepo.Create(&model.TripVersion{
		TripID:        trip.ID,
		VersionNumber: newVersion,
		ChangeSummary: result.ChangeSummary,
		SnapshotJSON:  datatypes.JSON(snapshotBytes),
		CreatedBy:     "ai",
	}); err != nil {
		return nil, 0, err
	}

	// Update current_version di trips
	_ = s.tripRepo.UpdateFields(trip.ID, map[string]interface{}{
		"current_version": newVersion,
	})

	return updatedModelDays, newVersion, nil
}

var _ = time.Now // suppress unused import
