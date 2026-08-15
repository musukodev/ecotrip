package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type DestinationRepository interface {
	FindAll() ([]model.Destination, error)
	FindByID(id uint64) (*model.Destination, error)
	FindByCategory(category string) ([]model.Destination, error)
	FindByCreator(creatorID uint64) ([]model.Destination, error)
	UpdateEcoScore(id uint64, ecoScore float64) error
	Create(dest *model.Destination) error
	Update(dest *model.Destination) error
	Delete(id uint64) error
}

type destinationRepository struct{}

func NewDestinationRepository() DestinationRepository {
	return &destinationRepository{}
}

func (r *destinationRepository) FindAll() ([]model.Destination, error) {
	var dests []model.Destination
	err := config.DB.Where("deleted_at IS NULL").Order("eco_score desc, name asc").Find(&dests).Error
	return dests, err
}

func (r *destinationRepository) FindByID(id uint64) (*model.Destination, error) {
	var dest model.Destination
	err := config.DB.Preload("Ratings.User").Where("id = ? AND deleted_at IS NULL", id).First(&dest).Error
	if err != nil {
		return nil, err
	}
	return &dest, nil
}

func (r *destinationRepository) FindByCategory(category string) ([]model.Destination, error) {
	var dests []model.Destination
	err := config.DB.Where("category = ? AND deleted_at IS NULL", category).Order("eco_score desc, name asc").Find(&dests).Error
	return dests, err
}

func (r *destinationRepository) FindByCreator(creatorID uint64) ([]model.Destination, error) {
	var dests []model.Destination
	err := config.DB.Where("created_by = ? AND deleted_at IS NULL", creatorID).Order("created_at desc").Find(&dests).Error
	return dests, err
}

func (r *destinationRepository) UpdateEcoScore(id uint64, ecoScore float64) error {
	return config.DB.Model(&model.Destination{}).Where("id = ?", id).Update("eco_score", ecoScore).Error
}

func (r *destinationRepository) Create(dest *model.Destination) error {
	return config.DB.Create(dest).Error
}

func (r *destinationRepository) Update(dest *model.Destination) error {
	return config.DB.Save(dest).Error
}

func (r *destinationRepository) Delete(id uint64) error {
	return config.DB.Where("id = ?", id).Delete(&model.Destination{}).Error
}
