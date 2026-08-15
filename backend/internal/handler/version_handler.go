package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type VersionHandler struct {
	versionSvc service.VersionService
}

func NewVersionHandler(versionSvc service.VersionService) *VersionHandler {
	return &VersionHandler{versionSvc: versionSvc}
}

type rollbackRequest struct {
	Version int `json:"version" binding:"required,min=1"`
}

// GET /trips/:tripId/versions — F-015: daftar riwayat versi
func (h *VersionHandler) GetVersions(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}

	versions, err := h.versionSvc.GetVersions(tripID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"versions": versions, "count": len(versions)})
}

// POST /trips/:id/versions/rollback — F-015: rollback ke versi tertentu
func (h *VersionHandler) Rollback(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}

	var req rollbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.versionSvc.Rollback(tripID, userID, req.Version); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Itinerary berhasil dikembalikan ke v" + strconv.Itoa(req.Version),
	})
}
