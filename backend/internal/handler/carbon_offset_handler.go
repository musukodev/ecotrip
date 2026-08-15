package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type CarbonOffsetHandler struct {
	offsetSvc service.CarbonOffsetService
}

func NewCarbonOffsetHandler(offsetSvc service.CarbonOffsetService) *CarbonOffsetHandler {
	return &CarbonOffsetHandler{offsetSvc: offsetSvc}
}

type donateRequest struct {
	TripID    uint64  `json:"trip_id"    binding:"required"`
	AmountIDR float64 `json:"amount_idr" binding:"required"` // 25000 | 50000 | 100000
}

// POST /carbon-offset — F-020: donasi carbon offset
func (h *CarbonOffsetHandler) Donate(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req donateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	offset, err := h.offsetSvc.Donate(userID, req.TripID, req.AmountIDR)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Terima kasih! Donasi carbon offset kamu berhasil",
		"offset":  offset,
	})
}

// GET /carbon-offset/my
func (h *CarbonOffsetHandler) GetMyOffsets(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	offsets, err := h.offsetSvc.GetMyOffsets(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat data"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"offsets": offsets, "count": len(offsets)})
}

// GET /carbon-offset/trip/:id
func (h *CarbonOffsetHandler) GetTripOffsets(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}
	offsets, err := h.offsetSvc.GetTripOffsets(tripID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"offsets": offsets, "count": len(offsets)})
}
