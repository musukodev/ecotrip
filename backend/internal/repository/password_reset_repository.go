package repository

import (
	"time"

	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type PasswordResetRepository interface {
	Create(reset *model.PasswordReset) error
	FindByToken(token string) (*model.PasswordReset, error)
	MarkUsed(id uint64) error
	DeleteExpired() error
}

type passwordResetRepository struct{}

func NewPasswordResetRepository() PasswordResetRepository {
	return &passwordResetRepository{}
}

func (r *passwordResetRepository) Create(reset *model.PasswordReset) error {
	return config.DB.Create(reset).Error
}

// FindByToken — cari token yang belum dipakai dan belum expired
func (r *passwordResetRepository) FindByToken(token string) (*model.PasswordReset, error) {
	var reset model.PasswordReset
	if err := config.DB.
		Where("token = ? AND used_at IS NULL AND expires_at > ?", token, time.Now()).
		First(&reset).Error; err != nil {
		return nil, err
	}
	return &reset, nil
}

// MarkUsed — tandai token sudah dipakai (one-time use)
func (r *passwordResetRepository) MarkUsed(id uint64) error {
	now := time.Now()
	return config.DB.Model(&model.PasswordReset{}).
		Where("id = ?", id).
		Update("used_at", now).Error
}

// DeleteExpired — bersihkan token expired (bisa dipanggil periodik)
func (r *passwordResetRepository) DeleteExpired() error {
	return config.DB.
		Where("expires_at < ? OR used_at IS NOT NULL", time.Now()).
		Delete(&model.PasswordReset{}).Error
}
