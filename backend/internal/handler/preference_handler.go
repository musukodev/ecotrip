package handler

import (
	"net/http"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PreferenceHandler struct {
	prefSvc service.PreferenceService
}

func NewPreferenceHandler(prefSvc service.PreferenceService) *PreferenceHandler {
	return &PreferenceHandler{prefSvc: prefSvc}
}

type updatePreferenceRequest struct {
	// 'id' | 'en' | 'zh'
	Language  string   `json:"language"  binding:"required"`
	// nilai valid: 'alam', 'budaya', 'kuliner', 'petualangan', 'belanja', 'santai'
	Interests []string `json:"interests" binding:"required"`
}

// GET /user/preferences — F-006: ambil preferensi
func (h *PreferenceHandler) Get(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	pref, err := h.prefSvc.Get(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat preferensi"})
		return
	}
	c.JSON(http.StatusOK, pref)
}

// PUT /user/preferences — F-006: simpan preferensi bahasa & minat
func (h *PreferenceHandler) Update(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req updatePreferenceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pref, err := h.prefSvc.Update(userID, req.Language, req.Interests)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pref)
}
