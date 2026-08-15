package handler

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type TripHandler struct {
	tripSvc        service.TripService
	itineraryAISvc service.ItineraryAIService
	carbonSvc      service.CarbonService
}

func NewTripHandler(
	tripSvc service.TripService,
	itineraryAISvc service.ItineraryAIService,
	carbonSvc service.CarbonService,
) *TripHandler {
	return &TripHandler{
		tripSvc:        tripSvc,
		itineraryAISvc: itineraryAISvc,
		carbonSvc:      carbonSvc,
	}
}

type createTripRequest struct {
	Title                   string   `json:"title"                    binding:"required,min=2"`
	OriginCountry           string   `json:"origin_country"`          // 'singapore' | 'malaysia' (kosong jika lokal Batam)
	OriginPort              string   `json:"origin_port"`             // 'HarbourFront', dll
	DurationDays            int      `json:"duration_days"            binding:"required,min=1"`
	Pax                     int      `json:"pax"                      binding:"required,min=1"`
	Budget                  float64  `json:"budget"`
	Interests               []string `json:"interests"`
	AccommodationPreference string   `json:"accommodation_preference"` // hotel|resort|homestay|glamping|other
	Notes                   string   `json:"notes"`
	StartDate               string   `json:"start_date"`
	EndDate                 string   `json:"end_date"`
}

func (h *TripHandler) GetTrips(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	trips, err := h.tripSvc.GetTrips(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat trips"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"trips": trips, "count": len(trips)})
}

func (h *TripHandler) GetTrip(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	trip, err := h.tripSvc.GetTrip(uint64(id), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, trip)
}

func (h *TripHandler) GetTripFull(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	trip, days, err := h.tripSvc.GetTripFull(uint64(id), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"trip": trip, "days": days})
}

// POST /trips — F-007, F-008: buat draft trip + generate AI
func (h *TripHandler) CreateTrip(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req createTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var startDate, endDate *time.Time
	if req.StartDate != "" {
		t, err := time.Parse("2006-01-02", req.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "format start_date harus YYYY-MM-DD"})
			return
		}
		startDate = &t
	}
	if req.EndDate != "" {
		t, err := time.Parse("2006-01-02", req.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "format end_date harus YYYY-MM-DD"})
			return
		}
		endDate = &t
	}

	trip, err := h.tripSvc.CreateDraft(
		userID, req.Title, req.OriginCountry, req.OriginPort,
		req.DurationDays, req.Pax, req.Budget,
		req.Interests, req.AccommodationPreference, req.Notes,
		startDate, endDate,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if h.itineraryAISvc != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		if err := h.itineraryAISvc.GenerateAndSave(ctx, trip); err != nil {
			c.JSON(http.StatusCreated, gin.H{
				"trip":    trip,
				"warning": "Itinerary belum berhasil dibuat: " + err.Error(),
			})
			return
		}
	}

	updatedTrip, days, _ := h.tripSvc.GetTripFull(trip.ID, userID)
	c.JSON(http.StatusCreated, gin.H{"trip": updatedTrip, "days": days})
}

func (h *TripHandler) RegenerateItinerary(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	trip, err := h.tripSvc.GetTrip(uint64(id), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip tidak ditemukan"})
		return
	}

	if h.itineraryAISvc == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Layanan AI tidak tersedia"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	if err := h.itineraryAISvc.GenerateAndSave(ctx, trip); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal generate itinerary: " + err.Error()})
		return
	}

	updatedTrip, days, _ := h.tripSvc.GetTripFull(trip.ID, userID)
	c.JSON(http.StatusOK, gin.H{
		"message": "Itinerary berhasil dibuat ulang",
		"trip":    updatedTrip,
		"days":    days,
	})
}

type updateStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func (h *TripHandler) UpdateStatus(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var req updateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	trip, err := h.tripSvc.UpdateStatus(uint64(id), userID, req.Status)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Status trip berhasil diubah menjadi " + req.Status,
		"trip":    trip,
	})
}

func (h *TripHandler) DeleteTrip(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	if err := h.tripSvc.DeleteTrip(uint64(id), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus trip"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Trip berhasil dihapus"})
}

func (h *TripHandler) GetCarbonReport(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	report, err := h.carbonSvc.GetCarbonReport(id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, report)
}

func (h *TripHandler) GetScore(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	score, err := h.carbonSvc.GetSustainabilityScore(id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"trip_id": id, "sustainability_score": score})
}
