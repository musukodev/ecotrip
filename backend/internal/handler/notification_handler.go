package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	notifSvc service.NotificationService
}

func NewNotificationHandler(notifSvc service.NotificationService) *NotificationHandler {
	return &NotificationHandler{notifSvc: notifSvc}
}

// GET /notifications?limit=20&offset=0
func (h *NotificationHandler) GetNotifications(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	notifs, err := h.notifSvc.GetForUser(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat notifikasi"})
		return
	}

	unread, _ := h.notifSvc.CountUnread(userID)

	c.JSON(http.StatusOK, gin.H{
		"notifications": notifs,
		"count":         len(notifs),
		"unread_count":  unread,
	})
}

// GET /notifications/count — untuk badge dot di ikon notifikasi
func (h *NotificationHandler) CountUnread(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	count, err := h.notifSvc.CountUnread(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghitung notifikasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

// PUT /notifications/:id/read — tandai satu notifikasi sudah dibaca
func (h *NotificationHandler) MarkRead(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	if err := h.notifSvc.MarkRead(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui notifikasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Notifikasi ditandai sudah dibaca"})
}

// PUT /notifications/read-all — tandai semua notifikasi sudah dibaca
func (h *NotificationHandler) MarkAllRead(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	if err := h.notifSvc.MarkAllRead(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui notifikasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Semua notifikasi ditandai sudah dibaca"})
}
