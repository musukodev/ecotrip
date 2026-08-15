package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type TripHandler struct {
	tripSvc service.TripService
}

func NewTripHandler(tripSvc service.TripService) *TripHandler {
	return &TripHandler{tripSvc: tripSvc}
}

type createTripRequest struct {
	Title       string `json:"title" binding:"required,min=2"`
	Description string `json:"description"`
	Destination string `json:"destination" binding:"required"`
	StartDate   string `json:"start_date" binding:"required"`
	EndDate     string `json:"end_date" binding:"required"`
}

func (h *TripHandler) GetTrips(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	trips, err := h.tripSvc.GetTrips(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat trips"})
		return
	}
	c.JSON(http.StatusOK, trips)
}

func (h *TripHandler) GetTrip(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	trip, err := h.tripSvc.GetTrip(uint(id), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, trip)
}

func (h *TripHandler) CreateTrip(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	var req createTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	trip, err := h.tripSvc.CreateTrip(userID, req.Title, req.Description, req.Destination, req.StartDate, req.EndDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat trip"})
		return
	}
	c.JSON(http.StatusCreated, trip)
}

func (h *TripHandler) DeleteTrip(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	if err := h.tripSvc.DeleteTrip(uint(id), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus trip"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Trip berhasil dihapus"})
}
