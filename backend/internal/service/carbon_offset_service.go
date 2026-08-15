package service

import (
	"errors"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type CarbonOffsetService interface {
	// F-019: turis donasi carbon offset
	Donate(userID, tripID uint64, amountIDR float64) (*model.CarbonOffset, error)
	// Riwayat donasi user
	GetMyOffsets(userID uint64) ([]model.CarbonOffset, error)
	// Donasi per trip
	GetTripOffsets(tripID, userID uint64) ([]model.CarbonOffset, error)
}

// Konstanta program offset sesuai prototype
const (
	defaultProgram = "Penanaman Mangrove Lokal"
	// Rp per kg CO2 — estimasi harga carbon credit lokal
	idrPerKgCO2 = 15000.0
)

// Pilihan nominal donasi sesuai prototype: Rp 25.000 / 50.000 / 100.000
var validAmounts = map[float64]bool{
	25000:  true,
	50000:  true,
	100000: true,
}

type carbonOffsetService struct {
	offsetRepo repository.CarbonOffsetRepository
	tripRepo   repository.TripRepository
}

func NewCarbonOffsetService(
	offsetRepo repository.CarbonOffsetRepository,
	tripRepo repository.TripRepository,
) CarbonOffsetService {
	return &carbonOffsetService{
		offsetRepo: offsetRepo,
		tripRepo:   tripRepo,
	}
}

func (s *carbonOffsetService) Donate(userID, tripID uint64, amountIDR float64) (*model.CarbonOffset, error) {
	// validasi nominal donasi
	if !validAmounts[amountIDR] {
		return nil, errors.New("nominal donasi harus Rp 25.000, Rp 50.000, atau Rp 100.000")
	}

	// validasi trip milik user
	trip, err := s.tripRepo.FindByID(tripID, userID)
	if err != nil {
		return nil, errors.New("trip tidak ditemukan")
	}

	// hitung carbon yang ditebus dari nominal donasi
	carbonKg := amountIDR / idrPerKgCO2
	if carbonKg <= 0 {
		carbonKg = 0.1 // minimum
	}

	offset := &model.CarbonOffset{
		UserID:      userID,
		TripID:      tripID,
		AmountIDR:   amountIDR,
		CarbonKg:    carbonKg,
		ProgramName: defaultProgram,
		Status:      "completed",
	}

	if err := s.offsetRepo.Create(offset); err != nil {
		return nil, err
	}

	// update total_carbon_kg di trip (dikurangi yang sudah di-offset)
	_ = s.tripRepo.UpdateCarbonAfterOffset(tripID, trip.TotalCarbonKg-carbonKg)

	return offset, nil
}

func (s *carbonOffsetService) GetMyOffsets(userID uint64) ([]model.CarbonOffset, error) {
	return s.offsetRepo.FindByUser(userID)
}

func (s *carbonOffsetService) GetTripOffsets(tripID, userID uint64) ([]model.CarbonOffset, error) {
	// validasi akses
	if _, err := s.tripRepo.FindByID(tripID, userID); err != nil {
		return nil, errors.New("trip tidak ditemukan")
	}
	return s.offsetRepo.FindByTrip(tripID)
}
