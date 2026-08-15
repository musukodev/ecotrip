package service

import (
	"errors"
	"fmt"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

// RatingService — MF-007: Rating dan Eco Score otomatis
type RatingService interface {
	SubmitRating(userID uint64, targetType string, targetID uint64, tripID *uint64, cleanliness, envCondition, envCare int, comment string) (*model.Rating, error)
	GetRatings(targetType string, targetID uint64) ([]model.Rating, float64, int, error)
}

type ratingService struct {
	ratingRepo repository.RatingRepository
	destRepo   repository.DestinationRepository
	accRepo    repository.AccommodationRepository
}

func NewRatingService(
	ratingRepo repository.RatingRepository,
	destRepo repository.DestinationRepository,
	accRepo repository.AccommodationRepository,
) RatingService {
	return &ratingService{
		ratingRepo: ratingRepo,
		destRepo:   destRepo,
		accRepo:    accRepo,
	}
}

// SubmitRating — F-026 & F-027:
// Form 3 aspek skala 1-5 (dikonversi ke 20-100).
// Rumus bobot: Kebersihan 35%, Kondisi Lingkungan 40%, Kepedulian Lingkungan 25%.
func (s *ratingService) SubmitRating(
	userID uint64,
	targetType string,
	targetID uint64,
	tripID *uint64,
	cleanliness, envCondition, envCare int,
	comment string,
) (*model.Rating, error) {
	if targetType != "destination" && targetType != "accommodation" {
		return nil, errors.New("target_type harus 'destination' atau 'accommodation'")
	}

	if cleanliness < 1 || cleanliness > 5 ||
		envCondition < 1 || envCondition > 5 ||
		envCare < 1 || envCare > 5 {
		return nil, errors.New("nilai rating tiap aspek harus antara 1 sampai 5")
	}

	// Cek apakah target valid
	var destID, accID *uint64
	if targetType == "destination" {
		if _, err := s.destRepo.FindByID(targetID); err != nil {
			return nil, errors.New("destinasi tidak ditemukan")
		}
		destID = &targetID
	} else {
		if _, err := s.accRepo.FindByID(targetID); err != nil {
			return nil, errors.New("akomodasi tidak ditemukan")
		}
		accID = &targetID
	}

	// Konversi skala 1-5 ke nilai 20-100:
	// 1 -> 20, 2 -> 40, 3 -> 60, 4 -> 80, 5 -> 100
	cScore := float64(cleanliness) * 20.0
	ecScore := float64(envCondition) * 20.0
	careScore := float64(envCare) * 20.0

	// F-027: Bobot 35% Kebersihan + 40% Kondisi Lingkungan + 25% Kepedulian Lingkungan
	calculatedScore := (cScore * 0.35) + (ecScore * 0.40) + (careScore * 0.25)

	rating := &model.Rating{
		UserID:                 userID,
		TargetType:             targetType,
		DestinationID:          destID,
		AccommodationID:        accID,
		TripID:                 tripID,
		Cleanliness:            cleanliness,
		EnvironmentalCondition: envCondition,
		EnvironmentalCare:      envCare,
		CalculatedScore:        calculatedScore,
		ReviewComment:          comment,
	}

	if err := s.ratingRepo.Create(rating); err != nil {
		return nil, fmt.Errorf("gagal menyimpan rating: %w", err)
	}

	// Recalculate dan update Eco Score agregat pada tabel target
	avgScore, _, err := s.ratingRepo.GetAverageScore(targetType, targetID)
	if err == nil {
		if targetType == "destination" {
			_ = s.destRepo.UpdateEcoScore(targetID, avgScore)
		} else {
			_ = s.accRepo.UpdateEcoScore(targetID, avgScore)
		}
	}

	return rating, nil
}

func (s *ratingService) GetRatings(targetType string, targetID uint64) ([]model.Rating, float64, int, error) {
	ratings, err := s.ratingRepo.FindByTarget(targetType, targetID)
	if err != nil {
		return nil, 0, 0, err
	}
	avgScore, count, _ := s.ratingRepo.GetAverageScore(targetType, targetID)
	return ratings, avgScore, count, nil
}
