package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type DestinationHandler struct {
	destSvc service.DestinationService
}

func NewDestinationHandler(destSvc service.DestinationService) *DestinationHandler {
	return &DestinationHandler{destSvc: destSvc}
}

// GET /destinations?category=nature|culture|culinary|shopping|adventure|relaxation — F-043
func (h *DestinationHandler) GetDestinations(c *gin.Context) {
	category := c.Query("category")
	dests, err := h.destSvc.GetByCategory(category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat destinasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"destinations": dests, "count": len(dests)})
}

// GET /destinations/:id — F-044, F-045, F-046
func (h *DestinationHandler) GetDestination(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	dest, err := h.destSvc.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destinasi tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, dest)
}
