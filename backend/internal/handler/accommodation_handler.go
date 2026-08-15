package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AccommodationHandler struct {
	accSvc service.AccommodationService
}

func NewAccommodationHandler(accSvc service.AccommodationService) *AccommodationHandler {
	return &AccommodationHandler{accSvc: accSvc}
}

// GET /accommodations?category=hotel|resort|homestay — F-040
func (h *AccommodationHandler) GetAccommodations(c *gin.Context) {
	category := c.Query("category")
	accs, err := h.accSvc.GetByCategory(category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat akomodasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"accommodations": accs, "count": len(accs)})
}

// GET /accommodations/:id — F-041
func (h *AccommodationHandler) GetAccommodation(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var userID uint64
	if uID, exists := c.Get("user_id"); exists {
		userID = uID.(uint64)
	}

	acc, err := h.accSvc.GetByID(id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akomodasi tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, acc)
}

// POST /accommodations/:id/favorite — F-042: toggle favorit
func (h *AccommodationHandler) ToggleFavorite(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	isFav, err := h.accSvc.ToggleFavorite(userID, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui favorit"})
		return
	}

	msg := "Ditambahkan ke favorit"
	if !isFav {
		msg = "Dihapus dari favorit"
	}
	c.JSON(http.StatusOK, gin.H{"message": msg, "is_favorite": isFav})
}

// GET /accommodations/favorites — daftar favorit user
func (h *AccommodationHandler) GetFavorites(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	favs, err := h.accSvc.GetFavorites(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat favorit"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"favorites": favs, "count": len(favs)})
}
