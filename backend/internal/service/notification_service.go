package service

import (
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type NotificationService interface {
	GetForUser(userID uint64, limit, offset int) ([]model.Notification, error)
	CountUnread(userID uint64) (int64, error)
	MarkRead(id, userID uint64) error
	MarkAllRead(userID uint64) error
	// Helper untuk dipakai service lain
	Create(userID uint64, notifType, title, message string, refType *string, refID *uint64) error
}

type notificationService struct {
	notifRepo repository.NotificationRepository
}

func NewNotificationService(notifRepo repository.NotificationRepository) NotificationService {
	return &notificationService{notifRepo: notifRepo}
}

func (s *notificationService) GetForUser(userID uint64, limit, offset int) ([]model.Notification, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	return s.notifRepo.FindByUser(userID, limit, offset)
}

func (s *notificationService) CountUnread(userID uint64) (int64, error) {
	return s.notifRepo.CountUnread(userID)
}

func (s *notificationService) MarkRead(id, userID uint64) error {
	return s.notifRepo.MarkRead(id, userID)
}

func (s *notificationService) MarkAllRead(userID uint64) error {
	return s.notifRepo.MarkAllRead(userID)
}

func (s *notificationService) Create(userID uint64, notifType, title, message string, refType *string, refID *uint64) error {
	return s.notifRepo.Create(&model.Notification{
		UserID:  userID,
		Type:    notifType,
		Title:   title,
		Message: message,
		RefType: refType,
		RefID:   refID,
	})
}
