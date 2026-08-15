package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type RatingHandler struct {
	ratingSvc service.RatingService
}

func NewRatingHandler(ratingSvc service.RatingService) *RatingHandler {
	return &RatingHandler{ratingSvc: ratingSvc}
}

type submitRatingRequest struct {
	TargetType             string  `json:"target_type"             binding:"required"` // 'destination' | 'accommodation'
	TargetID               uint64  `json:"target_id"               binding:"required"`
	TripID                 *uint64 `json:"trip_id"`
	Cleanliness            int     `json:"cleanliness"             binding:"required,min=1,max=5"`
	EnvironmentalCondition int     `json:"environmental_condition" binding:"required,min=1,max=5"`
	EnvironmentalCare      int     `json:"environmental_care"      binding:"required,min=1,max=5"`
	ReviewComment          string  `json:"review_comment"`
}

// POST /ratings — F-026 & F-027: submit rating 3 aspek
func (h *RatingHandler) SubmitRating(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req submitRatingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rating, err := h.ratingSvc.SubmitRating(
		userID,
		req.TargetType,
		req.TargetID,
		req.TripID,
		req.Cleanliness,
		req.EnvironmentalCondition,
		req.EnvironmentalCare,
		req.ReviewComment,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Terima kasih atas penilaian eco kamu!",
		"rating":  rating,
	})
}

// GET /ratings?target_type=destination&target_id=1 — F-028: ulasan & Eco Score
func (h *RatingHandler) GetRatings(c *gin.Context) {
	targetType := c.Query("target_type")
	targetIDStr := c.Query("target_id")

	if targetType == "" || targetIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "target_type dan target_id wajib diisi"})
		return
	}

	targetID, err := strconv.ParseUint(targetIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "target_id tidak valid"})
		return
	}

	ratings, avgScore, count, err := h.ratingSvc.GetRatings(targetType, targetID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat ulasan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"eco_score":    avgScore,
		"rating_count": count,
		"ratings":      ratings,
	})
}
