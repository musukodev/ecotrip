package service

import (
	"fmt"
	"net/url"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type DestinationService interface {
	GetAll() ([]model.Destination, error)
	GetByCategory(category string) ([]model.Destination, error)
	GetByID(id uint64) (*DestinationDetailResponse, error)
	GetByCreator(creatorID uint64) ([]model.Destination, error)
	Create(dest *model.Destination) error
	Update(dest *model.Destination) error
	Delete(id, creatorID uint64) error
}

type DestinationDetailResponse struct {
	model.Destination
	DirectionsURL string `json:"directions_url"`
	ShareURL      string `json:"share_url"`
}

type destinationService struct {
	destRepo repository.DestinationRepository
}

func NewDestinationService(destRepo repository.DestinationRepository) DestinationService {
	return &destinationService{destRepo: destRepo}
}

func (s *destinationService) GetAll() ([]model.Destination, error) {
	return s.destRepo.FindAll()
}

func (s *destinationService) GetByCategory(category string) ([]model.Destination, error) {
	if category == "" {
		return s.destRepo.FindAll()
	}
	return s.destRepo.FindByCategory(category)
}

func (s *destinationService) GetByID(id uint64) (*DestinationDetailResponse, error) {
	dest, err := s.destRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	directionsURL := ""
	if dest.Latitude != nil && dest.Longitude != nil {
		directionsURL = fmt.Sprintf("https://www.google.com/maps/dir/?api=1&destination=%f,%f", *dest.Latitude, *dest.Longitude)
	}
	shareURL := fmt.Sprintf("https://ecotour.ai/destinations/%d?name=%s", dest.ID, url.QueryEscape(dest.Name))

	return &DestinationDetailResponse{
		Destination:   *dest,
		DirectionsURL: directionsURL,
		ShareURL:      shareURL,
	}, nil
}

func (s *destinationService) GetByCreator(creatorID uint64) ([]model.Destination, error) {
	return s.destRepo.FindByCreator(creatorID)
}

func (s *destinationService) Create(dest *model.Destination) error {
	if dest.CreatedBy != nil {
		existing, err := s.destRepo.FindByCreator(*dest.CreatedBy)
		if err == nil && len(existing) > 0 {
			return fmt.Errorf("akun Anda sudah mendaftarkan 1 tempat ('%s'). Anda hanya dapat mengelola atau mengedit tempat tersebut", existing[0].Name)
		}
	}

	if dest.EcoScore <= 0 {
		dest.EcoScore = 85.0 // Default baseline eco score
	}
	return s.destRepo.Create(dest)
}

func (s *destinationService) Update(dest *model.Destination) error {
	return s.destRepo.Update(dest)
}

func (s *destinationService) Delete(id, creatorID uint64) error {
	dest, err := s.destRepo.FindByID(id)
	if err != nil {
		return err
	}
	if dest.CreatedBy != nil && *dest.CreatedBy != creatorID {
		return fmt.Errorf("anda tidak berhak menghapus tempat ini")
	}
	return s.destRepo.Delete(id)
}
