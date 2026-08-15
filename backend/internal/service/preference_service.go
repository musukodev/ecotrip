package service

import (
	"errors"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/lib/pq"
)

type PreferenceService interface {
	Get(userID uint64) (*model.UserPreference, error)
	Update(userID uint64, language string, interests []string) (*model.UserPreference, error)
}

type preferenceService struct {
	prefRepo repository.UserPreferenceRepository
}

func NewPreferenceService(prefRepo repository.UserPreferenceRepository) PreferenceService {
	return &preferenceService{prefRepo: prefRepo}
}

var validLanguages = map[string]bool{"id": true, "en": true, "zh": true}

var validInterests = map[string]bool{
	"nature":      true,
	"culture":     true,
	"culinary":    true,
	"shopping":    true,
	"adventure":   true,
	"relaxation":  true,
}

func (s *preferenceService) Get(userID uint64) (*model.UserPreference, error) {
	pref, err := s.prefRepo.FindByUserID(userID)
	if err != nil {
		return &model.UserPreference{
			UserID:    userID,
			Language:  "id",
			Interests: pq.StringArray{"nature", "culinary"},
		}, nil
	}
	return pref, nil
}

func (s *preferenceService) Update(userID uint64, language string, interests []string) (*model.UserPreference, error) {
	if !validLanguages[language] {
		return nil, errors.New("bahasa tidak valid, pilih: id, en, zh")
	}

	for _, interest := range interests {
		if !validInterests[interest] {
			return nil, errors.New("minat tidak valid: " + interest)
		}
	}

	pref := &model.UserPreference{
		UserID:    userID,
		Language:  language,
		Interests: pq.StringArray(interests),
	}
	if err := s.prefRepo.Upsert(pref); err != nil {
		return nil, err
	}
	return pref, nil
}
