package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type CarbonOffsetRepository interface {
	Create(offset *model.CarbonOffset) error
	FindByUser(userID uint64) ([]model.CarbonOffset, error)
	FindByTrip(tripID uint64) ([]model.CarbonOffset, error)
}

type carbonOffsetRepository struct{}

func NewCarbonOffsetRepository() CarbonOffsetRepository {
	return &carbonOffsetRepository{}
}

func (r *carbonOffsetRepository) Create(offset *model.CarbonOffset) error {
	return config.DB.Create(offset).Error
}

func (r *carbonOffsetRepository) FindByUser(userID uint64) ([]model.CarbonOffset, error) {
	var offsets []model.CarbonOffset
	if err := config.DB.
		Preload("Trip").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&offsets).Error; err != nil {
		return nil, err
	}
	return offsets, nil
}

func (r *carbonOffsetRepository) FindByTrip(tripID uint64) ([]model.CarbonOffset, error) {
	var offsets []model.CarbonOffset
	if err := config.DB.
		Where("trip_id = ?", tripID).
		Order("created_at desc").
		Find(&offsets).Error; err != nil {
		return nil, err
	}
	return offsets, nil
}
