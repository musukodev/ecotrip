package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type NotificationRepository interface {
	Create(n *model.Notification) error
	FindByUser(userID uint64, limit, offset int) ([]model.Notification, error)
	CountUnread(userID uint64) (int64, error)
	MarkRead(id, userID uint64) error
	MarkAllRead(userID uint64) error
}

type notificationRepository struct{}

func NewNotificationRepository() NotificationRepository {
	return &notificationRepository{}
}

func (r *notificationRepository) Create(n *model.Notification) error {
	return config.DB.Create(n).Error
}

func (r *notificationRepository) FindByUser(userID uint64, limit, offset int) ([]model.Notification, error) {
	var notifs []model.Notification
	q := config.DB.Where("user_id = ?", userID).Order("created_at desc")
	if limit > 0 {
		q = q.Limit(limit).Offset(offset)
	}
	if err := q.Find(&notifs).Error; err != nil {
		return nil, err
	}
	return notifs, nil
}

func (r *notificationRepository) CountUnread(userID uint64) (int64, error) {
	var count int64
	if err := config.DB.Model(&model.Notification{}).
		Where("user_id = ? AND is_read = false", userID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *notificationRepository) MarkRead(id, userID uint64) error {
	return config.DB.Model(&model.Notification{}).
		Where("id = ? AND user_id = ?", id, userID).
		Update("is_read", true).Error
}

func (r *notificationRepository) MarkAllRead(userID uint64) error {
	return config.DB.Model(&model.Notification{}).
		Where("user_id = ? AND is_read = false", userID).
		Update("is_read", true).Error
}
