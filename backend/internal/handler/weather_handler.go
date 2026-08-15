package handler

import (
	"net/http"

	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type WeatherHandler struct {
	weatherSvc service.WeatherService
}

func NewWeatherHandler(weatherSvc service.WeatherService) *WeatherHandler {
	return &WeatherHandler{weatherSvc: weatherSvc}
}

// GET /weather/current — F-036: widget cuaca ringkas Home
func (h *WeatherHandler) GetCurrent(c *gin.Context) {
	current, err := h.weatherSvc.GetCurrentWeather()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat cuaca"})
		return
	}
	c.JSON(http.StatusOK, current)
}

// GET /weather/forecast — F-037: prakiraan cuaca 4 hari ke depan
func (h *WeatherHandler) GetForecast(c *gin.Context) {
	forecast, err := h.weatherSvc.GetForecast()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat prakiraan cuaca"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"forecast": forecast, "count": len(forecast)})
}
