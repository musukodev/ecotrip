package service

import (
	"fmt"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type FerryService interface {
	GetRoutes(originCountry, originPort string) ([]model.FerryRoute, error)
	GetRouteByID(id uint64) (*model.FerryRoute, error)
	GetByCreator(creatorID uint64) ([]model.FerryRoute, error)
	GetEstimatedCost(originCountry, originPort string, pax int) (float64, error)
	Create(route *model.FerryRoute) error
	Update(route *model.FerryRoute) error
	Delete(id uint64) error
}

type ferryService struct {
	ferryRepo repository.FerryRouteRepository
}

func NewFerryService(ferryRepo repository.FerryRouteRepository) FerryService {
	return &ferryService{ferryRepo: ferryRepo}
}

func (s *ferryService) GetRoutes(originCountry, originPort string) ([]model.FerryRoute, error) {
	return s.ferryRepo.FindByOrigin(originCountry, originPort)
}

func (s *ferryService) GetRouteByID(id uint64) (*model.FerryRoute, error) {
	return s.ferryRepo.FindByID(id)
}

func (s *ferryService) GetByCreator(creatorID uint64) ([]model.FerryRoute, error) {
	return s.ferryRepo.FindByCreator(creatorID)
}

func (s *ferryService) GetEstimatedCost(originCountry, originPort string, pax int) (float64, error) {
	routes, err := s.ferryRepo.FindByOrigin(originCountry, originPort)
	if err != nil || len(routes) == 0 {
		if originCountry == "singapore" {
			return float64(pax) * 850000.0, nil
		}
		return float64(pax) * 650000.0, nil
	}
	return routes[0].PriceRoundTrip * float64(pax), nil
}

func (s *ferryService) Create(route *model.FerryRoute) error {
	return s.ferryRepo.Create(route)
}

func (s *ferryService) Update(route *model.FerryRoute) error {
	return s.ferryRepo.Update(route)
}

func (s *ferryService) Delete(id uint64) error {
	return s.ferryRepo.Delete(id)
}

var _ = fmt.Sprintf
