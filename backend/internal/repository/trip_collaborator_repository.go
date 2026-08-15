package repository

import (
	"errors"

	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
	"gorm.io/gorm"
)

type TripCollaboratorRepository interface {
	Create(collab *model.TripCollaborator) error
	FindByTrip(tripID uint64) ([]model.TripCollaborator, error)
	FindByUserAndTrip(userID, tripID uint64) (*model.TripCollaborator, error)
	Delete(userID, tripID uint64) error
	IsCollaborator(userID, tripID uint64) bool
}

type tripCollaboratorRepository struct{}

func NewTripCollaboratorRepository() TripCollaboratorRepository {
	return &tripCollaboratorRepository{}
}

func (r *tripCollaboratorRepository) Create(collab *model.TripCollaborator) error {
	return config.DB.Create(collab).Error
}

// FindByTrip — F-037: daftar kolaborator sebuah trip
func (r *tripCollaboratorRepository) FindByTrip(tripID uint64) ([]model.TripCollaborator, error) {
	var collabs []model.TripCollaborator
	if err := config.DB.
		Preload("User").
		Where("trip_id = ?", tripID).
		Order("invited_at asc").
		Find(&collabs).Error; err != nil {
		return nil, err
	}
	return collabs, nil
}

func (r *tripCollaboratorRepository) FindByUserAndTrip(userID, tripID uint64) (*model.TripCollaborator, error) {
	var collab model.TripCollaborator
	if err := config.DB.
		Where("user_id = ? AND trip_id = ?", userID, tripID).
		First(&collab).Error; err != nil {
		return nil, err
	}
	return &collab, nil
}

// Delete — F-037: hapus kolaborator dari trip
func (r *tripCollaboratorRepository) Delete(userID, tripID uint64) error {
	return config.DB.
		Where("user_id = ? AND trip_id = ?", userID, tripID).
		Delete(&model.TripCollaborator{}).Error
}

// IsCollaborator — cek apakah user adalah kolaborator trip (dipakai middleware)
func (r *tripCollaboratorRepository) IsCollaborator(userID, tripID uint64) bool {
	var count int64
	config.DB.Model(&model.TripCollaborator{}).
		Where("user_id = ? AND trip_id = ?", userID, tripID).
		Count(&count)
	return count > 0
}

// IsTripOwnerOrCollaborator — helper: cek apakah user bisa akses trip
func IsTripOwnerOrCollaborator(userID, tripID uint64) (bool, error) {
	// cek owner
	var trip model.Trip
	err := config.DB.Where("id = ? AND user_id = ? AND deleted_at IS NULL", tripID, userID).First(&trip).Error
	if err == nil {
		return true, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return false, err
	}

	// cek kolaborator
	var count int64
	config.DB.Model(&model.TripCollaborator{}).
		Where("user_id = ? AND trip_id = ?", userID, tripID).
		Count(&count)
	return count > 0, nil
}
