package service

import (
	"errors"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	// F-004: ganti kata sandi
	ChangePassword(userID uint64, oldPassword, newPassword string) error
	// F-005: ganti email
	ChangeEmail(userID uint64, newEmail string) error
	// Get profil user
	GetProfile(userID uint64) (*model.User, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetProfile(userID uint64) (*model.User, error) {
	return s.userRepo.FindByID(userID)
}

// ChangePassword — F-004
func (s *userService) ChangePassword(userID uint64, oldPassword, newPassword string) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return errors.New("user tidak ditemukan")
	}

	// verifikasi password lama
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(oldPassword)); err != nil {
		return errors.New("kata sandi lama tidak sesuai")
	}

	if len(newPassword) < 6 {
		return errors.New("kata sandi baru minimal 6 karakter")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.userRepo.UpdatePassword(userID, string(hash))
}

// ChangeEmail — F-005
func (s *userService) ChangeEmail(userID uint64, newEmail string) error {
	// cek apakah email sudah dipakai user lain
	existing, _ := s.userRepo.FindByEmail(newEmail)
	if existing != nil && existing.ID != userID {
		return errors.New("email sudah digunakan oleh akun lain")
	}
	return s.userRepo.UpdateEmail(userID, newEmail)
}
