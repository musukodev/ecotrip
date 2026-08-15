package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type UserFavoriteRepository interface {
	Add(fav *model.UserFavorite) error
	Remove(userID, accommodationID uint64) error
	FindByUser(userID uint64) ([]model.UserFavorite, error)
	IsFavorite(userID, accommodationID uint64) bool
}

type userFavoriteRepository struct{}

func NewUserFavoriteRepository() UserFavoriteRepository {
	return &userFavoriteRepository{}
}

func (r *userFavoriteRepository) Add(fav *model.UserFavorite) error {
	return config.DB.Create(fav).Error
}

func (r *userFavoriteRepository) Remove(userID, accommodationID uint64) error {
	return config.DB.Where("user_id = ? AND accommodation_id = ?", userID, accommodationID).Delete(&model.UserFavorite{}).Error
}

func (r *userFavoriteRepository) FindByUser(userID uint64) ([]model.UserFavorite, error) {
	var favs []model.UserFavorite
	err := config.DB.Preload("Accommodation").Where("user_id = ?", userID).Order("created_at desc").Find(&favs).Error
	return favs, err
}

func (r *userFavoriteRepository) IsFavorite(userID, accommodationID uint64) bool {
	var count int64
	config.DB.Model(&model.UserFavorite{}).Where("user_id = ? AND accommodation_id = ?", userID, accommodationID).Count(&count)
	return count > 0
}
