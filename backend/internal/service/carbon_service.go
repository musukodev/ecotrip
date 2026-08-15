package service

import (
	"errors"

	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type CarbonService interface {
	// F-018, F-019: laporan carbon footprint (kapal/feri, akomodasi, aktivitas)
	GetCarbonReport(tripID, userID uint64) (*CarbonReport, error)
	// F-021: hitung sustainability score
	GetSustainabilityScore(tripID, userID uint64) (int, error)
	// Recalculate dan simpan ke trips table
	RecalculateAndSave(tripID uint64) error
}

type CarbonReport struct {
	TripID              uint64  `json:"trip_id"`
	TotalCarbonKg       float64 `json:"total_carbon_kg"`
	FerryPct            float64 `json:"ferry_pct"`
	AccommodationPct    float64 `json:"accommodation_pct"`
	ActivityPct         float64 `json:"activity_pct"`
	FerryKg             float64 `json:"ferry_kg"`
	AccommodationKg     float64 `json:"accommodation_kg"`
	ActivityKg          float64 `json:"activity_kg"`
	SustainabilityScore int     `json:"sustainability_score"`
}

type carbonService struct {
	tripRepo repository.TripRepository
}

func NewCarbonService(tripRepo repository.TripRepository) CarbonService {
	return &carbonService{tripRepo: tripRepo}
}

func (s *carbonService) GetCarbonReport(tripID, userID uint64) (*CarbonReport, error) {
	trip, err := s.tripRepo.FindByID(tripID, userID)
	if err != nil {
		return nil, errors.New("trip tidak ditemukan")
	}

	total := trip.TotalCarbonKg
	ferryKg := total * trip.CarbonFerryPct / 100
	accomKg := total * trip.CarbonAccomPct / 100
	activityKg := total * trip.CarbonActivityPct / 100

	return &CarbonReport{
		TripID:              tripID,
		TotalCarbonKg:       total,
		FerryPct:            trip.CarbonFerryPct,
		AccommodationPct:    trip.CarbonAccomPct,
		ActivityPct:         trip.CarbonActivityPct,
		FerryKg:             ferryKg,
		AccommodationKg:     accomKg,
		ActivityKg:          activityKg,
		SustainabilityScore: trip.SustainabilityScore,
	}, nil
}

func (s *carbonService) GetSustainabilityScore(tripID, userID uint64) (int, error) {
	trip, err := s.tripRepo.FindByID(tripID, userID)
	if err != nil {
		return 0, errors.New("trip tidak ditemukan")
	}
	return trip.SustainabilityScore, nil
}

func (s *carbonService) RecalculateAndSave(tripID uint64) error {
	type activityRow struct {
		Category string
		CarbonKg float64
	}

	var rows []activityRow
	err := config.DB.
		Table("itinerary_activities ia").
		Select("ia.category, ia.carbon_kg").
		Joins("JOIN itinerary_days id ON id.id = ia.day_id").
		Where("id.trip_id = ? AND ia.deleted_at IS NULL AND id.deleted_at IS NULL", tripID).
		Scan(&rows).Error
	if err != nil {
		return err
	}

	var totalKg, ferryKg, accomKg, activityKg float64
	for _, row := range rows {
		totalKg += row.CarbonKg
		switch row.Category {
		case "ferry", "transportasi":
			ferryKg += row.CarbonKg
		case "akomodasi":
			accomKg += row.CarbonKg
		default:
			activityKg += row.CarbonKg
		}
	}

	var ferryPct, accomPct, activityPct float64
	if totalKg > 0 {
		ferryPct = roundPct(ferryKg / totalKg * 100)
		accomPct = roundPct(accomKg / totalKg * 100)
		activityPct = 100 - ferryPct - accomPct
	}

	return config.DB.Model(&model.Trip{}).Where("id = ?", tripID).Updates(map[string]interface{}{
		"total_carbon_kg":   totalKg,
		"carbon_ferry_pct":  ferryPct,
		"carbon_accom_pct":  accomPct,
		"carbon_activity_pct": activityPct,
	}).Error
}

func roundPct(v float64) float64 {
	return float64(int(v*100)) / 100
}
