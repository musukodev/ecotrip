package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type SuperadminHandler struct {
	superadminSvc service.SuperadminService
}

func NewSuperadminHandler(superadminSvc service.SuperadminService) *SuperadminHandler {
	return &SuperadminHandler{superadminSvc: superadminSvc}
}

// GET /superadmin/stats
func (h *SuperadminHandler) GetStats(c *gin.Context) {
	stats, err := h.superadminSvc.GetStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// GET /superadmin/business-users/pending
func (h *SuperadminHandler) GetPendingBusinessUsers(c *gin.Context) {
	users, err := h.superadminSvc.GetPendingBusinessUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat akun pending"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"users": users, "count": len(users)})
}

// POST /superadmin/business-users/:id/approve
func (h *SuperadminHandler) ApproveBusinessUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	if err := h.superadminSvc.ApproveBusinessUser(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Akun pelaku usaha berhasil disetujui (ACC)"})
}

// POST /superadmin/business-users/:id/reject
func (h *SuperadminHandler) RejectBusinessUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	if err := h.superadminSvc.RejectBusinessUser(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pendaftaran akun pelaku usaha ditolak"})
}

// GET /superadmin/destinations
func (h *SuperadminHandler) GetAllDestinations(c *gin.Context) {
	dests, err := h.superadminSvc.GetAllDestinations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat destinasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"destinations": dests, "count": len(dests)})
}

// GET /superadmin/accommodations
func (h *SuperadminHandler) GetAllAccommodations(c *gin.Context) {
	accs, err := h.superadminSvc.GetAllAccommodations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat akomodasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"accommodations": accs, "count": len(accs)})
}
