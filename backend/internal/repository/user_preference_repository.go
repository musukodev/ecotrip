package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
	"github.com/lib/pq"
)

type UserPreferenceRepository interface {
	FindByUserID(userID uint64) (*model.UserPreference, error)
	Upsert(pref *model.UserPreference) error
}

type userPreferenceRepository struct{}

func NewUserPreferenceRepository() UserPreferenceRepository {
	return &userPreferenceRepository{}
}

func (r *userPreferenceRepository) FindByUserID(userID uint64) (*model.UserPreference, error) {
	var pref model.UserPreference
	if err := config.DB.Where("user_id = ?", userID).First(&pref).Error; err != nil {
		return nil, err
	}
	return &pref, nil
}

// Upsert — buat baru jika belum ada, update jika sudah ada (F-006)
func (r *userPreferenceRepository) Upsert(pref *model.UserPreference) error {
	var existing model.UserPreference
	err := config.DB.Where("user_id = ?", pref.UserID).First(&existing).Error
	if err != nil {
		// belum ada — buat baru
		return config.DB.Create(pref).Error
	}
	// sudah ada — update
	return config.DB.Model(&existing).Updates(map[string]interface{}{
		"language":  pref.Language,
		"interests": pq.StringArray(pref.Interests),
	}).Error
}
