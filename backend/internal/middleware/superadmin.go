package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// SuperadminMiddleware — memastikan pengguna adalah Superadmin
func SuperadminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists || role != "superadmin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "Akses ditolak. Endpoint ini khusus untuk Superadmin.",
			})
			return
		}
		c.Next()
	}
}
