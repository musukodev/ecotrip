package service

import (
	"errors"
	"fmt"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type SuperadminStats struct {
	TotalPendingBusinessUsers int64 `json:"total_pending_business_users"`
	TotalApprovedBusiness     int64 `json:"total_approved_business"`
	TotalDestinations         int64 `json:"total_destinations"`
	TotalAccommodations       int64 `json:"total_accommodations"`
}

type SuperadminService interface {
	GetPendingBusinessUsers() ([]model.User, error)
	ApproveBusinessUser(userID uint64) error
	RejectBusinessUser(userID uint64) error
	GetAllDestinations() ([]model.Destination, error)
	GetAllAccommodations() ([]model.Accommodation, error)
	GetStats() (*SuperadminStats, error)
}

type superadminService struct {
	userRepo repository.UserRepository
	destRepo repository.DestinationRepository
	accRepo  repository.AccommodationRepository
}

func NewSuperadminService(
	userRepo repository.UserRepository,
	destRepo repository.DestinationRepository,
	accRepo repository.AccommodationRepository,
) SuperadminService {
	return &superadminService{
		userRepo: userRepo,
		destRepo: destRepo,
		accRepo:  accRepo,
	}
}

func (s *superadminService) GetPendingBusinessUsers() ([]model.User, error) {
	return s.userRepo.FindPendingBusinessUsers()
}

func (s *superadminService) ApproveBusinessUser(userID uint64) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return errors.New("pengguna tidak ditemukan")
	}
	if user.Role != "business_destination" && user.Role != "business_accommodation" {
		return errors.New("hanya akun admin pelaku usaha yang memerlukan persetujuan")
	}
	return s.userRepo.UpdateApprovalStatus(userID, "approved")
}

func (s *superadminService) RejectBusinessUser(userID uint64) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return errors.New("pengguna tidak ditemukan")
	}
	if user.Role != "business_destination" && user.Role != "business_accommodation" {
		return errors.New("hanya akun admin pelaku usaha yang memerlukan persetujuan")
	}
	return s.userRepo.UpdateApprovalStatus(userID, "rejected")
}

func (s *superadminService) GetAllDestinations() ([]model.Destination, error) {
	return s.destRepo.FindAll()
}

func (s *superadminService) GetAllAccommodations() ([]model.Accommodation, error) {
	return s.accRepo.FindAll()
}

func (s *superadminService) GetStats() (*SuperadminStats, error) {
	pendingCount, approvedBizCount, err := s.userRepo.CountBusinessStats()
	if err != nil {
		return nil, fmt.Errorf("gagal menghitung stats user: %w", err)
	}

	dests, err := s.destRepo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("gagal menghitung stats destinasi: %w", err)
	}

	accs, err := s.accRepo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("gagal menghitung stats akomodasi: %w", err)
	}

	return &SuperadminStats{
		TotalPendingBusinessUsers: pendingCount,
		TotalApprovedBusiness:     approvedBizCount,
		TotalDestinations:         int64(len(dests)),
		TotalAccommodations:       int64(len(accs)),
	}, nil
}
