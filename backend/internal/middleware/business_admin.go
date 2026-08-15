package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// BusinessDestinationMiddleware — memastikan pengguna adalah admin usaha destinasi & kuliner
func BusinessDestinationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists || role != "business_destination" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "Akses ditolak. Endpoint ini khusus untuk Admin Pelaku Usaha Destinasi & Kuliner.",
			})
			return
		}
		c.Next()
	}
}

// BusinessAccommodationMiddleware — memastikan pengguna adalah admin usaha penginapan / akomodasi
func BusinessAccommodationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists || role != "business_accommodation" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "Akses ditolak. Endpoint ini khusus untuk Admin Pelaku Usaha Penginapan/Akomodasi.",
			})
			return
		}
		c.Next()
	}
}
