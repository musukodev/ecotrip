package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type FerryRouteRepository interface {
	FindAll() ([]model.FerryRoute, error)
	FindByOrigin(country, port string) ([]model.FerryRoute, error)
	FindByID(id uint64) (*model.FerryRoute, error)
	FindByCreator(creatorID uint64) ([]model.FerryRoute, error)
	Create(route *model.FerryRoute) error
	Update(route *model.FerryRoute) error
	Delete(id uint64) error
}

type ferryRouteRepository struct{}

func NewFerryRouteRepository() FerryRouteRepository {
	return &ferryRouteRepository{}
}

func (r *ferryRouteRepository) FindAll() ([]model.FerryRoute, error) {
	var routes []model.FerryRoute
	err := config.DB.Order("origin_country asc, origin_port asc").Find(&routes).Error
	return routes, err
}

func (r *ferryRouteRepository) FindByOrigin(country, port string) ([]model.FerryRoute, error) {
	var routes []model.FerryRoute
	q := config.DB
	if country != "" {
		q = q.Where("origin_country = ?", country)
	}
	if port != "" {
		q = q.Where("origin_port = ?", port)
	}
	err := q.Order("price_round_trip asc").Find(&routes).Error
	return routes, err
}

func (r *ferryRouteRepository) FindByID(id uint64) (*model.FerryRoute, error) {
	var route model.FerryRoute
	err := config.DB.Where("id = ?", id).First(&route).Error
	if err != nil {
		return nil, err
	}
	return &route, nil
}

func (r *ferryRouteRepository) FindByCreator(creatorID uint64) ([]model.FerryRoute, error) {
	var routes []model.FerryRoute
	err := config.DB.Where("created_by = ?", creatorID).Order("created_at desc").Find(&routes).Error
	return routes, err
}

func (r *ferryRouteRepository) Create(route *model.FerryRoute) error {
	return config.DB.Create(route).Error
}

func (r *ferryRouteRepository) Update(route *model.FerryRoute) error {
	return config.DB.Save(route).Error
}

func (r *ferryRouteRepository) Delete(id uint64) error {
	return config.DB.Where("id = ?", id).Delete(&model.FerryRoute{}).Error
}
