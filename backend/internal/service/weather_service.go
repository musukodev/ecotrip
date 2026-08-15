package service

import (
	"time"
)

// WeatherService — MF-008 (F-029) & MF-013 (F-036, F-037): Widget Cuaca & Prakiraan Cuaca Batam
type WeatherService interface {
	GetCurrentWeather() (*CurrentWeatherResponse, error)
	GetForecast() ([]DailyForecast, error)
}

type CurrentWeatherResponse struct {
	Location    string    `json:"location"`
	Temperature float64   `json:"temperature"`
	Condition   string    `json:"condition"` // e.g. "Sebagian Berawan"
	Humidity    int       `json:"humidity"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type DailyForecast struct {
	Date        string  `json:"date"`
	DayName     string  `json:"day_name"`
	Temperature float64 `json:"temperature"`
	Condition   string  `json:"condition"`
}

type weatherService struct{}

func NewWeatherService() WeatherService {
	return &weatherService{}
}

// GetCurrentWeather — F-036: Suhu saat ini dan kondisi cuaca di Batam
func (s *weatherService) GetCurrentWeather() (*CurrentWeatherResponse, error) {
	return &CurrentWeatherResponse{
		Location:    "Batam, Kepulauan Riau",
		Temperature: 29.5,
		Condition:   "Sebagian Berawan",
		Humidity:    78,
		UpdatedAt:   time.Now(),
	}, nil
}

// GetForecast — F-037: Prakiraan cuaca 4 hari ke depan
func (s *weatherService) GetForecast() ([]DailyForecast, error) {
	now := time.Now()
	daysID := []string{"Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"}

	forecasts := make([]DailyForecast, 0, 4)
	temps := []float64{30.0, 29.0, 28.5, 31.0}
	conds := []string{"Cerah Berawan", "Hujan Ringan", "Berawan", "Cerah"}

	for i := 1; i <= 4; i++ {
		targetDate := now.AddDate(0, 0, i)
		forecasts = append(forecasts, DailyForecast{
			Date:        targetDate.Format("2006-01-02"),
			DayName:     daysID[int(targetDate.Weekday())],
			Temperature: temps[i-1],
			Condition:   conds[i-1],
		})
	}
	return forecasts, nil
}
