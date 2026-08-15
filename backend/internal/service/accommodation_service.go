package service

import (
	"fmt"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type AccommodationService interface {
	GetAll() ([]model.Accommodation, error)
	GetByCategory(category string) ([]model.Accommodation, error)
	GetByID(id uint64, userID uint64) (*AccommodationDetailResponse, error)
	GetByCreator(creatorID uint64) ([]model.Accommodation, error)
	ToggleFavorite(userID, accommodationID uint64) (bool, error)
	GetFavorites(userID uint64) ([]model.UserFavorite, error)
	Create(acc *model.Accommodation) error
	Update(acc *model.Accommodation) error
	Delete(id, creatorID uint64) error
}

type AccommodationDetailResponse struct {
	model.Accommodation
	IsFavorite bool `json:"is_favorite"`
}

type accommodationService struct {
	accRepo  repository.AccommodationRepository
	favRepo  repository.UserFavoriteRepository
}

func NewAccommodationService(accRepo repository.AccommodationRepository, favRepo repository.UserFavoriteRepository) AccommodationService {
	return &accommodationService{accRepo: accRepo, favRepo: favRepo}
}

func (s *accommodationService) GetAll() ([]model.Accommodation, error) {
	return s.accRepo.FindAll()
}

func (s *accommodationService) GetByCategory(category string) ([]model.Accommodation, error) {
	if category == "" {
		return s.accRepo.FindAll()
	}
	return s.accRepo.FindByCategory(category)
}

func (s *accommodationService) GetByID(id uint64, userID uint64) (*AccommodationDetailResponse, error) {
	acc, err := s.accRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	isFav := false
	if userID > 0 {
		isFav = s.favRepo.IsFavorite(userID, id)
	}

	return &AccommodationDetailResponse{
		Accommodation: *acc,
		IsFavorite:    isFav,
	}, nil
}

func (s *accommodationService) GetByCreator(creatorID uint64) ([]model.Accommodation, error) {
	return s.accRepo.FindByCreator(creatorID)
}

func (s *accommodationService) ToggleFavorite(userID, accommodationID uint64) (bool, error) {
	if s.favRepo.IsFavorite(userID, accommodationID) {
		err := s.favRepo.Remove(userID, accommodationID)
		return false, err
	}
	fav := &model.UserFavorite{
		UserID:          userID,
		AccommodationID: accommodationID,
	}
	err := s.favRepo.Add(fav)
	return true, err
}

func (s *accommodationService) GetFavorites(userID uint64) ([]model.UserFavorite, error) {
	return s.favRepo.FindByUser(userID)
}

func (s *accommodationService) Create(acc *model.Accommodation) error {
	if acc.CreatedBy != nil {
		existing, err := s.accRepo.FindByCreator(*acc.CreatedBy)
		if err == nil && len(existing) > 0 {
			return fmt.Errorf("akun Anda sudah mendaftarkan 1 penginapan ('%s'). Anda hanya dapat mengelola atau mengedit penginapan tersebut", existing[0].Name)
		}
	}

	if acc.EcoScore <= 0 {
		acc.EcoScore = 88.0
	}
	return s.accRepo.Create(acc)
}

func (s *accommodationService) Update(acc *model.Accommodation) error {
	return s.accRepo.Update(acc)
}

func (s *accommodationService) Delete(id, creatorID uint64) error {
	acc, err := s.accRepo.FindByID(id)
	if err != nil {
		return err
	}
	if acc.CreatedBy != nil && *acc.CreatedBy != creatorID {
		return fmt.Errorf("anda tidak berhak menghapus akomodasi ini")
	}
	return s.accRepo.Delete(id)
}
