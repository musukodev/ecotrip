package handler

import (
	"net/http"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authSvc service.AuthService
}

func NewAuthHandler(authSvc service.AuthService) *AuthHandler {
	return &AuthHandler{authSvc: authSvc}
}

type registerRequest struct {
	Name     string `json:"name"     binding:"required,min=2"`
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role"` // 'tourist' | 'business_admin'
}

type loginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type forgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type resetPasswordRequest struct {
	Token       string `json:"token"        binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

// POST /auth/register — F-001
func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, token, err := h.authSvc.Register(req.Name, req.Email, req.Password, req.Role)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": token, "user": user})
}

// POST /auth/login — F-002
func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, token, err := h.authSvc.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

// POST /auth/forgot-password — F-003
// Selalu return 200 agar tidak bocorkan apakah email terdaftar
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req forgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.authSvc.ForgotPassword(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses permintaan"})
		return
	}

	// token dikirim via email (Phase 9). Di development, kembalikan token di response.
	resp := gin.H{"message": "Jika email terdaftar, link reset akan dikirim ke email kamu"}
	if gin.Mode() == gin.DebugMode && token != "" {
		resp["dev_token"] = token // hanya untuk development
	}

	c.JSON(http.StatusOK, resp)
}

// POST /auth/reset-password — F-003
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req resetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.authSvc.ResetPassword(req.Token, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kata sandi berhasil diperbarui"})
}

// POST /auth/logout — F-035: Keluar dari akun
func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Berhasil keluar dari akun",
	})
}
