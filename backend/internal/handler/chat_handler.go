package handler

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type ChatHandler struct {
	chatSvc service.ChatService
}

func NewChatHandler(chatSvc service.ChatService) *ChatHandler {
	return &ChatHandler{chatSvc: chatSvc}
}

type sendMessageRequest struct {
	Message string `json:"message" binding:"required,min=1"`
}

// GET /trips/:tripId/chat — F-011: riwayat chat
func (h *ChatHandler) GetHistory(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}

	msgs, err := h.chatSvc.GetHistory(tripID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"messages": msgs, "count": len(msgs)})
}

// POST /trips/:id/chat — F-012–F-016: kirim pesan ke AI
func (h *ChatHandler) SendMessage(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trip ID tidak valid"})
		return
	}

	var req sendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	resp, err := h.chatSvc.SendMessage(ctx, tripID, userID, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses pesan"})
		return
	}

	c.JSON(http.StatusOK, resp)
}
