package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"log"
	"os"
	"time"

	"github.com/ecotrip/backend/internal/email"
	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(name, email, password, role string) (*model.User, string, error)
	Login(email, password string) (*model.User, string, error)
	ForgotPassword(email string) (token string, err error)
	ResetPassword(token, newPassword string) error
}

type authService struct {
	userRepo          repository.UserRepository
	passwordResetRepo repository.PasswordResetRepository
	mailer            email.MailerService
}

func NewAuthService(
	userRepo repository.UserRepository,
	passwordResetRepo repository.PasswordResetRepository,
	mailer email.MailerService,
) AuthService {
	return &authService{
		userRepo:          userRepo,
		passwordResetRepo: passwordResetRepo,
		mailer:            mailer,
	}
}

func (s *authService) Register(name, email, password, role string) (*model.User, string, error) {
	existing, _ := s.userRepo.FindByEmail(email)
	if existing != nil {
		return nil, "", errors.New("email sudah terdaftar")
	}

	approvalStatus := "approved"
	if role == "business_destination" || role == "business_accommodation" {
		approvalStatus = "pending"
	} else {
		role = "tourist"
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", err
	}

	user := &model.User{
		Name:           name,
		Email:          email,
		PasswordHash:   string(hash),
		Role:           role,
		ApprovalStatus: approvalStatus,
	}
	if err := s.userRepo.Create(user); err != nil {
		return nil, "", err
	}

	// Jika status pending, jangan berikan token
	if approvalStatus == "pending" {
		return user, "", nil
	}

	token, err := generateToken(user.ID, user.Role)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *authService) Login(email, password string) (*model.User, string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, "", errors.New("email atau password salah")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, "", errors.New("email atau password salah")
	}

	// Cek status persetujuan jika akun adalah admin pelaku usaha
	if user.Role == "business_destination" || user.Role == "business_accommodation" {
		if user.ApprovalStatus == "pending" {
			return nil, "", errors.New("Akun Anda sedang dalam proses verifikasi oleh Superadmin. Silakan tunggu persetujuan.")
		}
		if user.ApprovalStatus == "rejected" {
			return nil, "", errors.New("Pendaftaran akun bisnis Anda telah ditolak oleh Superadmin.")
		}
	}

	token, err := generateToken(user.ID, user.Role)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *authService) ForgotPassword(userEmail string) (string, error) {
	user, err := s.userRepo.FindByEmail(userEmail)
	if err != nil {
		return "", nil
	}

	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	token := hex.EncodeToString(b)

	reset := &model.PasswordReset{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}
	if err := s.passwordResetRepo.Create(reset); err != nil {
		return "", err
	}

	if s.mailer != nil {
		go func(toEmail, toName, tkn string) {
			if err := s.mailer.SendPasswordResetEmail(toEmail, toName, tkn); err != nil {
				log.Printf("Gagal kirim email reset password: %v", err)
			}
		}(user.Email, user.Name, token)
	}

	return token, nil
}

func (s *authService) ResetPassword(token, newPassword string) error {
	reset, err := s.passwordResetRepo.FindByToken(token)
	if err != nil {
		return errors.New("token tidak valid atau sudah kadaluwarsa")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if err := s.userRepo.UpdatePassword(reset.UserID, string(hash)); err != nil {
		return err
	}

	return s.passwordResetRepo.MarkUsed(reset.ID)
}

func generateToken(userID uint64, role string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "ecotrip-secret-change-in-production"
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
