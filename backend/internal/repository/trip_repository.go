package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type TripRepository interface {
	Create(trip *model.Trip) error
	FindAll(userID uint) ([]model.Trip, error)
	FindByID(id, userID uint) (*model.Trip, error)
	Delete(id, userID uint) error
}

type tripRepository struct{}

func NewTripRepository() TripRepository {
	return &tripRepository{}
}

func (r *tripRepository) Create(trip *model.Trip) error {
	return config.DB.Create(trip).Error
}

func (r *tripRepository) FindAll(userID uint) ([]model.Trip, error) {
	var trips []model.Trip
	if err := config.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&trips).Error; err != nil {
		return nil, err
	}
	return trips, nil
}

func (r *tripRepository) FindByID(id, userID uint) (*model.Trip, error) {
	var trip model.Trip
	if err := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&trip).Error; err != nil {
		return nil, err
	}
	return &trip, nil
}

func (r *tripRepository) Delete(id, userID uint) error {
	return config.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&model.Trip{}).Error
}
