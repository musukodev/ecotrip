package service

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/lib/pq"
	"gorm.io/datatypes"
)

// VersionService — F-015: riwayat versi itinerary + rollback
type VersionService interface {
	GetVersions(tripID, userID uint64) ([]model.TripVersion, error)
	Rollback(tripID, userID uint64, versionNumber int) error
}

type versionService struct {
	versionRepo repository.TripVersionRepository
	tripRepo    repository.TripRepository
	dayRepo     repository.ItineraryDayRepository
	actRepo     repository.ItineraryActivityRepository
}

func NewVersionService(
	versionRepo repository.TripVersionRepository,
	tripRepo repository.TripRepository,
	dayRepo repository.ItineraryDayRepository,
	actRepo repository.ItineraryActivityRepository,
) VersionService {
	return &versionService{
		versionRepo: versionRepo,
		tripRepo:    tripRepo,
		dayRepo:     dayRepo,
		actRepo:     actRepo,
	}
}

func (s *versionService) GetVersions(tripID, userID uint64) ([]model.TripVersion, error) {
	if _, err := s.tripRepo.FindByID(tripID, userID); err != nil {
		return nil, errors.New("trip tidak ditemukan")
	}
	return s.versionRepo.FindByTrip(tripID)
}

// Rollback — F-015: kembalikan itinerary ke versi tertentu
func (s *versionService) Rollback(tripID, userID uint64, versionNumber int) error {
	if _, err := s.tripRepo.FindByID(tripID, userID); err != nil {
		return errors.New("trip tidak ditemukan")
	}

	// Ambil snapshot versi yang dituju
	targetVersion, err := s.versionRepo.FindByVersion(tripID, versionNumber)
	if err != nil {
		return fmt.Errorf("versi %d tidak ditemukan", versionNumber)
	}

	// Parse snapshot JSON
	var snapDays []snapshotDay
	if err := json.Unmarshal([]byte(targetVersion.SnapshotJSON), &snapDays); err != nil {
		return fmt.Errorf("gagal membaca snapshot versi %d", versionNumber)
	}

	// Hapus itinerary saat ini
	if err := s.actRepo.DeleteByTrip(tripID); err != nil {
		return err
	}
	if err := s.dayRepo.DeleteByTrip(tripID); err != nil {
		return err
	}

	// Restore dari snapshot
	for _, sd := range snapDays {
		day := model.ItineraryDay{
			TripID:    tripID,
			DayNumber: sd.DayNumber,
			Label:     sd.Label,
		}
		if err := s.dayRepo.BulkCreate([]model.ItineraryDay{day}); err != nil {
			return err
		}

		// Ambil ID day baru
		days, _ := s.dayRepo.FindByTrip(tripID)
		var savedDay *model.ItineraryDay
		for i := range days {
			if days[i].DayNumber == sd.DayNumber {
				savedDay = &days[i]
				break
			}
		}
		if savedDay == nil {
			continue
		}

		activities := make([]model.ItineraryActivity, 0, len(sd.Activities))
		for i, sa := range sd.Activities {
			activities = append(activities, model.ItineraryActivity{
				DayID:           savedDay.ID,
				SortOrder:       i,
				StartTime:       sa.StartTime,
				Title:           sa.Title,
				Description:     sa.Description,
				Category:        sa.Category,
				Tags:            pq.StringArray(sa.Tags),
				DistanceKm:      sa.DistanceKm,
				DurationMinutes: sa.DurationMinutes,
				EstimatedCost:   sa.EstimatedCost,
				CarbonKg:        sa.CarbonKg,
				IsValidated:     true,
			})
		}
		if err := s.actRepo.BulkCreate(activities); err != nil {
			return err
		}
	}

	// Buat entri versi baru (rollback tercatat sebagai versi baru)
	latestVersion, _ := s.versionRepo.LatestVersion(tripID)
	newVersion := latestVersion + 1
	snapBytes, _ := json.Marshal(snapDays)

	_ = s.versionRepo.Create(&model.TripVersion{
		TripID:        tripID,
		VersionNumber: newVersion,
		ChangeSummary: fmt.Sprintf("Dikembalikan ke v%d", versionNumber),
		SnapshotJSON:  datatypes.JSON(snapBytes),
		CreatedBy:     "user",
	})

	// Update current_version
	_ = s.tripRepo.UpdateFields(tripID, map[string]interface{}{
		"current_version": newVersion,
	})

	return nil
}

// snapshotDay / snapshotActivity — struct untuk parse snapshot JSON
type snapshotDay struct {
	DayNumber  int                `json:"day_number"`
	Label      string             `json:"label"`
	Activities []snapshotActivity `json:"activities"`
}

type snapshotActivity struct {
	StartTime       string   `json:"start_time"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	Category        string   `json:"category"`
	Tags            []string `json:"tags"`
	DistanceKm      float64  `json:"distance_km"`
	DurationMinutes int      `json:"duration_minutes"`
	EstimatedCost   float64  `json:"estimated_cost"`
	CarbonKg        float64  `json:"carbon_kg"`
}
