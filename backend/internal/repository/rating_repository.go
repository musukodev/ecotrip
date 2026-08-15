package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type RatingRepository interface {
	Create(rating *model.Rating) error
	FindByTarget(targetType string, targetID uint64) ([]model.Rating, error)
	GetAverageScore(targetType string, targetID uint64) (float64, int, error)
	HasRated(userID uint64, targetType string, targetID uint64, tripID *uint64) bool
}

type ratingRepository struct{}

func NewRatingRepository() RatingRepository {
	return &ratingRepository{}
}

func (r *ratingRepository) Create(rating *model.Rating) error {
	return config.DB.Create(rating).Error
}

func (r *ratingRepository) FindByTarget(targetType string, targetID uint64) ([]model.Rating, error) {
	var ratings []model.Rating
	q := config.DB.Preload("User").Order("created_at desc")
	if targetType == "destination" {
		q = q.Where("destination_id = ?", targetID)
	} else {
		q = q.Where("accommodation_id = ?", targetID)
	}
	err := q.Find(&ratings).Error
	return ratings, err
}

func (r *ratingRepository) GetAverageScore(targetType string, targetID uint64) (float64, int, error) {
	type result struct {
		AvgScore float64
		Count    int
	}
	var res result
	q := config.DB.Model(&model.Rating{})
	if targetType == "destination" {
		q = q.Where("destination_id = ?", targetID)
	} else {
		q = q.Where("accommodation_id = ?", targetID)
	}
	err := q.Select("COALESCE(AVG(calculated_score), 0) as avg_score, COUNT(*) as count").Scan(&res).Error
	return res.AvgScore, res.Count, err
}

func (r *ratingRepository) HasRated(userID uint64, targetType string, targetID uint64, tripID *uint64) bool {
	var count int64
	q := config.DB.Model(&model.Rating{}).Where("user_id = ? AND target_type = ?", userID, targetType)
	if targetType == "destination" {
		q = q.Where("destination_id = ?", targetID)
	} else {
		q = q.Where("accommodation_id = ?", targetID)
	}
	if tripID != nil {
		q = q.Where("trip_id = ?", *tripID)
	}
	q.Count(&count)
	return count > 0
}
