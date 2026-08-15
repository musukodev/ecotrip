package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type CollaboratorHandler struct {
	collabSvc service.CollaboratorService
}

func NewCollaboratorHandler(collabSvc service.CollaboratorService) *CollaboratorHandler {
	return &CollaboratorHandler{collabSvc: collabSvc}
}

type inviteCollaboratorRequest struct {
	Email string `json:"email" binding:"required,email"`
	// 'editor' | 'viewer'
	Role  string `json:"role"  binding:"required"`
}

// GET /trips/:tripId/collaborators — F-037: daftar kolaborator
func (h *CollaboratorHandler) GetCollaborators(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}

	collabs, err := h.collabSvc.GetCollaborators(tripID, userID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collaborators": collabs, "count": len(collabs)})
}

// POST /trips/:id/collaborators — F-037: undang kolaborator
func (h *CollaboratorHandler) Invite(c *gin.Context) {
	ownerID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}

	var req inviteCollaboratorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collab, err := h.collabSvc.Invite(ownerID, tripID, req.Email, req.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, collab)
}

// DELETE /trips/:id/collaborators/:userId — F-037: hapus kolaborator
func (h *CollaboratorHandler) Remove(c *gin.Context) {
	ownerID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}
	targetUserID, err := strconv.ParseUint(c.Param("userId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID tidak valid"})
		return
	}

	if err := h.collabSvc.Remove(ownerID, tripID, targetUserID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Kolaborator berhasil dihapus"})
}
