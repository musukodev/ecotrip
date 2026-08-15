package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
	"gorm.io/gorm"
)

type ItineraryDayRepository interface {
	BulkCreate(days []model.ItineraryDay) error
	FindByTrip(tripID uint64) ([]model.ItineraryDay, error)
	FindByID(id uint64) (*model.ItineraryDay, error)
	UpdateWeather(id uint64, summary string, tempC float64, icon string) error
	UpdateCrowdDensity(id uint64, density string) error
	DeleteByTrip(tripID uint64) error
}

type itineraryDayRepository struct{}

func NewItineraryDayRepository() ItineraryDayRepository {
	return &itineraryDayRepository{}
}

func (r *itineraryDayRepository) BulkCreate(days []model.ItineraryDay) error {
	return config.DB.Create(&days).Error
}

// FindByTrip — preload aktivitas per hari, urut by day_number
func (r *itineraryDayRepository) FindByTrip(tripID uint64) ([]model.ItineraryDay, error) {
	var days []model.ItineraryDay
	if err := config.DB.
		Preload("Activities", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL").Order("sort_order asc")
		}).
		Preload("Activities.Destination").
		Preload("Activities.Accommodation").
		Where("trip_id = ? AND deleted_at IS NULL", tripID).
		Order("day_number asc").
		Find(&days).Error; err != nil {
		return nil, err
	}
	return days, nil
}

func (r *itineraryDayRepository) FindByID(id uint64) (*model.ItineraryDay, error) {
	var day model.ItineraryDay
	if err := config.DB.
		Preload("Activities", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL").Order("sort_order asc")
		}).
		Where("id = ? AND deleted_at IS NULL", id).
		First(&day).Error; err != nil {
		return nil, err
	}
	return &day, nil
}

func (r *itineraryDayRepository) UpdateWeather(id uint64, summary string, tempC float64, icon string) error {
	return config.DB.Model(&model.ItineraryDay{}).Where("id = ?", id).Updates(map[string]interface{}{
		"weather_summary": summary,
		"weather_temp_c":  tempC,
		"weather_icon":    icon,
	}).Error
}

func (r *itineraryDayRepository) UpdateCrowdDensity(id uint64, density string) error {
	return config.DB.Model(&model.ItineraryDay{}).Where("id = ?", id).
		Update("crowd_density", density).Error
}

// DeleteByTrip — soft-delete semua hari trip (dipakai saat rollback/regenerate)
func (r *itineraryDayRepository) DeleteByTrip(tripID uint64) error {
	return config.DB.Where("trip_id = ?", tripID).Delete(&model.ItineraryDay{}).Error
}
