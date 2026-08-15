package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type TripVersionRepository interface {
	Create(v *model.TripVersion) error
	FindByTrip(tripID uint64) ([]model.TripVersion, error)
	FindByVersion(tripID uint64, versionNumber int) (*model.TripVersion, error)
	LatestVersion(tripID uint64) (int, error)
}

type tripVersionRepository struct{}

func NewTripVersionRepository() TripVersionRepository {
	return &tripVersionRepository{}
}

func (r *tripVersionRepository) Create(v *model.TripVersion) error {
	return config.DB.Create(v).Error
}

// FindByTrip — F-015: list riwayat versi sebuah trip (urut terbaru dulu)
func (r *tripVersionRepository) FindByTrip(tripID uint64) ([]model.TripVersion, error) {
	var versions []model.TripVersion
	if err := config.DB.
		Where("trip_id = ?", tripID).
		Order("version_number desc").
		Find(&versions).Error; err != nil {
		return nil, err
	}
	return versions, nil
}

// FindByVersion — ambil satu versi spesifik untuk rollback
func (r *tripVersionRepository) FindByVersion(tripID uint64, versionNumber int) (*model.TripVersion, error) {
	var v model.TripVersion
	if err := config.DB.
		Where("trip_id = ? AND version_number = ?", tripID, versionNumber).
		First(&v).Error; err != nil {
		return nil, err
	}
	return &v, nil
}

// LatestVersion — nomor versi terakhir untuk sebuah trip
func (r *tripVersionRepository) LatestVersion(tripID uint64) (int, error) {
	var v model.TripVersion
	if err := config.DB.
		Where("trip_id = ?", tripID).
		Order("version_number desc").
		First(&v).Error; err != nil {
		return 0, err
	}
	return v.VersionNumber, nil
}
