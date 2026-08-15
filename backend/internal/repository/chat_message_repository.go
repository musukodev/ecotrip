package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type ChatMessageRepository interface {
	Create(msg *model.ChatMessage) error
	FindByTrip(tripID uint64) ([]model.ChatMessage, error)
}

type chatMessageRepository struct{}

func NewChatMessageRepository() ChatMessageRepository {
	return &chatMessageRepository{}
}

func (r *chatMessageRepository) Create(msg *model.ChatMessage) error {
	return config.DB.Create(msg).Error
}

// FindByTrip — F-011: riwayat chat per trip, urut dari lama ke baru
func (r *chatMessageRepository) FindByTrip(tripID uint64) ([]model.ChatMessage, error) {
	var msgs []model.ChatMessage
	if err := config.DB.
		Where("trip_id = ?", tripID).
		Order("created_at asc").
		Find(&msgs).Error; err != nil {
		return nil, err
	}
	return msgs, nil
}
