package service

import (
	"fmt"
	"time"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/lib/pq"
)

type TripService interface {
	GetTrips(userID uint64) ([]model.Trip, error)
	GetTrip(id, userID uint64) (*model.Trip, error)
	GetTripFull(id, userID uint64) (*model.Trip, []model.ItineraryDay, error)
	CreateDraft(userID uint64, title, originCountry, originPort string, durationDays, pax int, budget float64, interests []string, accommodationPref, notes string, startDate, endDate *time.Time) (*model.Trip, error)
	UpdateStatus(id, userID uint64, newStatus string) (*model.Trip, error)
	DeleteTrip(id, userID uint64) error
}

type tripService struct {
	tripRepo repository.TripRepository
	dayRepo  repository.ItineraryDayRepository
}

func NewTripService(tripRepo repository.TripRepository, dayRepo repository.ItineraryDayRepository) TripService {
	return &tripService{
		tripRepo: tripRepo,
		dayRepo:  dayRepo,
	}
}

func (s *tripService) GetTrips(userID uint64) ([]model.Trip, error) {
	return s.tripRepo.FindAll(userID)
}

func (s *tripService) GetTrip(id, userID uint64) (*model.Trip, error) {
	return s.tripRepo.FindByID(id, userID)
}

func (s *tripService) GetTripFull(id, userID uint64) (*model.Trip, []model.ItineraryDay, error) {
	trip, err := s.tripRepo.FindByID(id, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("trip tidak ditemukan")
	}
	days, err := s.dayRepo.FindByTrip(id)
	if err != nil {
		return nil, nil, err
	}
	return trip, days, nil
}

func (s *tripService) CreateDraft(
	userID uint64,
	title, originCountry, originPort string,
	durationDays, pax int,
	budget float64,
	interests []string,
	accommodationPref, notes string,
	startDate, endDate *time.Time,
) (*model.Trip, error) {
	hasActive, activeTrip, _ := s.tripRepo.HasActiveTrip(userID)
	if hasActive {
		return nil, fmt.Errorf("kamu masih memiliki trip aktif '%s' (ID: %d). Selesaikan atau batalkan/arsipkan trip tersebut terlebih dahulu sebelum membuat itinerary baru", activeTrip.Title, activeTrip.ID)
	}

	if accommodationPref == "" {
		accommodationPref = "hotel"
	}

	trip := &model.Trip{
		UserID:                  userID,
		Title:                   title,
		Destination:             "Batam",
		OriginCountry:           originCountry,
		OriginPort:              originPort,
		DurationDays:            durationDays,
		Pax:                     pax,
		Budget:                  budget,
		Interests:               pq.StringArray(interests),
		AccommodationPreference: accommodationPref,
		Notes:                   notes,
		StartDate:               startDate,
		EndDate:                 endDate,
		Status:                  "draft",
	}
	if err := s.tripRepo.Create(trip); err != nil {
		return nil, err
	}
	return trip, nil
}

var validTripStatuses = map[string]bool{
	"active":    true,
	"completed": true,
	"archived":  true,
	"cancelled": true,
}

func (s *tripService) UpdateStatus(id, userID uint64, newStatus string) (*model.Trip, error) {
	if !validTripStatuses[newStatus] {
		return nil, fmt.Errorf("status tidak valid: %s (pilihan: active, completed, archived, cancelled)", newStatus)
	}

	trip, err := s.tripRepo.FindByID(id, userID)
	if err != nil {
		return nil, fmt.Errorf("trip tidak ditemukan")
	}

	if err := s.tripRepo.UpdateFields(id, map[string]interface{}{"status": newStatus}); err != nil {
		return nil, fmt.Errorf("gagal mengupdate status trip: %w", err)
	}

	trip.Status = newStatus
	return trip, nil
}

func (s *tripService) DeleteTrip(id, userID uint64) error {
	return s.tripRepo.Delete(id, userID)
}
