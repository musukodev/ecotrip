package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type FerryHandler struct {
	ferrySvc service.FerryService
}

func NewFerryHandler(ferrySvc service.FerryService) *FerryHandler {
	return &FerryHandler{ferrySvc: ferrySvc}
}

// GET /ferry/routes?origin_country=singapore|malaysia&origin_port=HarbourFront — F-047
func (h *FerryHandler) GetRoutes(c *gin.Context) {
	originCountry := c.Query("origin_country")
	originPort := c.Query("origin_port")

	routes, err := h.ferrySvc.GetRoutes(originCountry, originPort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat rute feri"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"routes": routes, "count": len(routes)})
}

// GET /ferry/routes/:id
func (h *FerryHandler) GetRoute(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	route, err := h.ferrySvc.GetRouteByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rute feri tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, route)
}
