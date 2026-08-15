package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type TripRepository interface {
	Create(trip *model.Trip) error
	FindAll(userID uint64) ([]model.Trip, error)
	FindByID(id, userID uint64) (*model.Trip, error)
	FindByIDNoAuth(id uint64) (*model.Trip, error)
	Delete(id, userID uint64) error
	UpdateCarbonAfterOffset(tripID uint64, newCarbonKg float64) error
	UpdateFields(tripID uint64, fields map[string]interface{}) error
	HasActiveTrip(userID uint64) (bool, *model.Trip, error)
}

type tripRepository struct{}

func NewTripRepository() TripRepository {
	return &tripRepository{}
}

func (r *tripRepository) Create(trip *model.Trip) error {
	return config.DB.Create(trip).Error
}

func (r *tripRepository) FindAll(userID uint64) ([]model.Trip, error) {
	var trips []model.Trip
	if err := config.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&trips).Error; err != nil {
		return nil, err
	}
	return trips, nil
}

func (r *tripRepository) FindByID(id, userID uint64) (*model.Trip, error) {
	var trip model.Trip
	if err := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&trip).Error; err != nil {
		return nil, err
	}
	return &trip, nil
}

func (r *tripRepository) Delete(id, userID uint64) error {
	return config.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&model.Trip{}).Error
}

func (r *tripRepository) UpdateCarbonAfterOffset(tripID uint64, newCarbonKg float64) error {
	if newCarbonKg < 0 {
		newCarbonKg = 0
	}
	return config.DB.Model(&model.Trip{}).
		Where("id = ?", tripID).
		Update("total_carbon_kg", newCarbonKg).Error
}

func (r *tripRepository) FindByIDNoAuth(id uint64) (*model.Trip, error) {
	var trip model.Trip
	if err := config.DB.Where("id = ? AND deleted_at IS NULL", id).First(&trip).Error; err != nil {
		return nil, err
	}
	return &trip, nil
}

func (r *tripRepository) UpdateFields(tripID uint64, fields map[string]interface{}) error {
	return config.DB.Model(&model.Trip{}).Where("id = ?", tripID).Updates(fields).Error
}

func (r *tripRepository) HasActiveTrip(userID uint64) (bool, *model.Trip, error) {
	var trip model.Trip
	err := config.DB.
		Where("user_id = ? AND status IN ('active', 'draft') AND deleted_at IS NULL", userID).
		Order("created_at desc").
		First(&trip).Error
	if err != nil {
		return false, nil, nil
	}
	return true, &trip, nil
}
