package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type ItineraryActivityRepository interface {
	BulkCreate(activities []model.ItineraryActivity) error
	FindByDay(dayID uint64) ([]model.ItineraryActivity, error)
	Update(activity *model.ItineraryActivity) error
	DeleteByDay(dayID uint64) error
	DeleteByTrip(tripID uint64) error
}

type itineraryActivityRepository struct{}

func NewItineraryActivityRepository() ItineraryActivityRepository {
	return &itineraryActivityRepository{}
}

func (r *itineraryActivityRepository) BulkCreate(activities []model.ItineraryActivity) error {
	if len(activities) == 0 {
		return nil
	}
	return config.DB.Create(&activities).Error
}

func (r *itineraryActivityRepository) FindByDay(dayID uint64) ([]model.ItineraryActivity, error) {
	var acts []model.ItineraryActivity
	if err := config.DB.
		Preload("EcoPlace").
		Where("day_id = ? AND deleted_at IS NULL", dayID).
		Order("sort_order asc").
		Find(&acts).Error; err != nil {
		return nil, err
	}
	return acts, nil
}

func (r *itineraryActivityRepository) Update(activity *model.ItineraryActivity) error {
	return config.DB.Save(activity).Error
}

// DeleteByDay — soft-delete semua aktivitas dalam satu hari
func (r *itineraryActivityRepository) DeleteByDay(dayID uint64) error {
	return config.DB.Where("day_id = ?", dayID).Delete(&model.ItineraryActivity{}).Error
}

// DeleteByTrip — soft-delete semua aktivitas dalam sebuah trip
// Dipakai saat regenerate atau rollback penuh
func (r *itineraryActivityRepository) DeleteByTrip(tripID uint64) error {
	return config.DB.
		Where("day_id IN (SELECT id FROM itinerary_days WHERE trip_id = ?)", tripID).
		Delete(&model.ItineraryActivity{}).Error
}
