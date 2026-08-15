package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type AccommodationRepository interface {
	FindAll() ([]model.Accommodation, error)
	FindByID(id uint64) (*model.Accommodation, error)
	FindByCategory(category string) ([]model.Accommodation, error)
	FindByCreator(creatorID uint64) ([]model.Accommodation, error)
	UpdateEcoScore(id uint64, ecoScore float64) error
	Create(acc *model.Accommodation) error
	Update(acc *model.Accommodation) error
	Delete(id uint64) error
}

type accommodationRepository struct{}

func NewAccommodationRepository() AccommodationRepository {
	return &accommodationRepository{}
}

func (r *accommodationRepository) FindAll() ([]model.Accommodation, error) {
	var accs []model.Accommodation
	err := config.DB.Where("deleted_at IS NULL").Order("eco_score desc, name asc").Find(&accs).Error
	return accs, err
}

func (r *accommodationRepository) FindByID(id uint64) (*model.Accommodation, error) {
	var acc model.Accommodation
	err := config.DB.Preload("Ratings.User").Where("id = ? AND deleted_at IS NULL", id).First(&acc).Error
	if err != nil {
		return nil, err
	}
	return &acc, nil
}

func (r *accommodationRepository) FindByCategory(category string) ([]model.Accommodation, error) {
	var accs []model.Accommodation
	err := config.DB.Where("category = ? AND deleted_at IS NULL", category).Order("eco_score desc, name asc").Find(&accs).Error
	return accs, err
}

func (r *accommodationRepository) FindByCreator(creatorID uint64) ([]model.Accommodation, error) {
	var accs []model.Accommodation
	err := config.DB.Where("created_by = ? AND deleted_at IS NULL", creatorID).Order("created_at desc").Find(&accs).Error
	return accs, err
}

func (r *accommodationRepository) UpdateEcoScore(id uint64, ecoScore float64) error {
	return config.DB.Model(&model.Accommodation{}).Where("id = ?", id).Update("eco_score", ecoScore).Error
}

func (r *accommodationRepository) Create(acc *model.Accommodation) error {
	return config.DB.Create(acc).Error
}

func (r *accommodationRepository) Update(acc *model.Accommodation) error {
	return config.DB.Save(acc).Error
}

func (r *accommodationRepository) Delete(id uint64) error {
	return config.DB.Where("id = ?", id).Delete(&model.Accommodation{}).Error
}
