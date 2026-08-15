package repository

import (
	"github.com/ecotrip/backend/config"
	"github.com/ecotrip/backend/internal/model"
)

type UserRepository interface {
	Create(user *model.User) error
	FindByEmail(email string) (*model.User, error)
	FindByID(id uint64) (*model.User, error)
	UpdateEmail(id uint64, email string) error
	UpdatePassword(id uint64, passwordHash string) error
	FindPendingBusinessUsers() ([]model.User, error)
	UpdateApprovalStatus(id uint64, status string) error
	CountBusinessStats() (totalPending int64, totalApprovedBusiness int64, err error)
}

type userRepository struct{}

func NewUserRepository() UserRepository {
	return &userRepository{}
}

func (r *userRepository) Create(user *model.User) error {
	return config.DB.Create(user).Error
}

func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := config.DB.Where("email = ? AND deleted_at IS NULL", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(id uint64) (*model.User, error) {
	var user model.User
	if err := config.DB.Where("id = ? AND deleted_at IS NULL", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateEmail — F-005: ganti alamat email
func (r *userRepository) UpdateEmail(id uint64, email string) error {
	return config.DB.Model(&model.User{}).
		Where("id = ?", id).
		Update("email", email).Error
}

// UpdatePassword — F-004: ganti kata sandi
func (r *userRepository) UpdatePassword(id uint64, passwordHash string) error {
	return config.DB.Model(&model.User{}).
		Where("id = ?", id).
		Update("password_hash", passwordHash).Error
}

// FindPendingBusinessUsers — ambil akun pelaku usaha yang statusnya pending
func (r *userRepository) FindPendingBusinessUsers() ([]model.User, error) {
	var users []model.User
	err := config.DB.
		Where("role IN ('business_destination', 'business_accommodation') AND approval_status = 'pending' AND deleted_at IS NULL").
		Order("created_at desc").
		Find(&users).Error
	return users, err
}

// UpdateApprovalStatus — ACC / Tolak akun pelaku usaha
func (r *userRepository) UpdateApprovalStatus(id uint64, status string) error {
	return config.DB.Model(&model.User{}).
		Where("id = ?", id).
		Update("approval_status", status).Error
}

// CountBusinessStats — statistik jumlah admin pelaku usaha
func (r *userRepository) CountBusinessStats() (totalPending int64, totalApprovedBusiness int64, err error) {
	err = config.DB.Model(&model.User{}).
		Where("role IN ('business_destination', 'business_accommodation') AND approval_status = 'pending' AND deleted_at IS NULL").
		Count(&totalPending).Error
	if err != nil {
		return
	}

	err = config.DB.Model(&model.User{}).
		Where("role IN ('business_destination', 'business_accommodation') AND approval_status = 'approved' AND deleted_at IS NULL").
		Count(&totalApprovedBusiness).Error
	return
}
