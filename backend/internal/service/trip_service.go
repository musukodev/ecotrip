package service

import (
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type TripService interface {
	GetTrips(userID uint) ([]model.Trip, error)
	GetTrip(id, userID uint) (*model.Trip, error)
	CreateTrip(userID uint, title, description, destination, startDate, endDate string) (*model.Trip, error)
	DeleteTrip(id, userID uint) error
}

type tripService struct {
	tripRepo repository.TripRepository
}

func NewTripService(tripRepo repository.TripRepository) TripService {
	return &tripService{tripRepo: tripRepo}
}

func (s *tripService) GetTrips(userID uint) ([]model.Trip, error) {
	return s.tripRepo.FindAll(userID)
}

func (s *tripService) GetTrip(id, userID uint) (*model.Trip, error) {
	return s.tripRepo.FindByID(id, userID)
}

func (s *tripService) CreateTrip(userID uint, title, description, destination, startDate, endDate string) (*model.Trip, error) {
	trip := &model.Trip{
		UserID:      userID,
		Title:       title,
		Description: description,
		Destination: destination,
		StartDate:   startDate,
		EndDate:     endDate,
	}
	if err := s.tripRepo.Create(trip); err != nil {
		return nil, err
	}
	return trip, nil
}

func (s *tripService) DeleteTrip(id, userID uint) error {
	return s.tripRepo.Delete(id, userID)
}
