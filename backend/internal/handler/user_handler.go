package handler

import (
	"net/http"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userSvc service.UserService
}

func NewUserHandler(userSvc service.UserService) *UserHandler {
	return &UserHandler{userSvc: userSvc}
}

type changePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type changeEmailRequest struct {
	NewEmail string `json:"new_email" binding:"required,email"`
}

// GET /user/me — ambil profil user yang sedang login
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	user, err := h.userSvc.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// PUT /user/password — F-004: ganti kata sandi
func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req changePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userSvc.ChangePassword(userID, req.OldPassword, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kata sandi berhasil diperbarui"})
}

// PUT /user/email — F-005: ganti email
func (h *UserHandler) ChangeEmail(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req changeEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userSvc.ChangeEmail(userID, req.NewEmail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email berhasil diperbarui"})
}
