package model

import (
	"time"

	"gorm.io/gorm"
)

// ItineraryDay — satu baris per hari dalam itinerary. F-008, F-033, F-034.
type ItineraryDay struct {
	ID         uint64         `json:"id"          gorm:"primaryKey"`
	TripID     uint64         `json:"trip_id"     gorm:"not null;index"`
	DayNumber  int            `json:"day_number"  gorm:"not null;check:day_number >= 1"`
	// label ditampilkan di UI day-pills, contoh: "Batam", "Nyebrang", "Singapura"
	Label      string         `json:"label"       gorm:"type:varchar(100)"`

	// F-033: cuaca real-time dari API eksternal
	WeatherSummary string   `json:"weather_summary" gorm:"type:varchar(100)"`
	WeatherTempC   *float64 `json:"weather_temp_c"  gorm:"type:numeric(4,1)"`
	WeatherIcon    string   `json:"weather_icon"    gorm:"type:varchar(50)"`

	// F-034: prediksi kepadatan — 'rendah' | 'sedang' | 'tinggi' | 'sangat_tinggi'
	CrowdDensity string `json:"crowd_density" gorm:"type:varchar(20)"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	Trip       Trip                  `json:"-"                   gorm:"foreignKey:TripID"`
	Activities []ItineraryActivity   `json:"activities,omitempty" gorm:"foreignKey:DayID"`
}

func (ItineraryDay) TableName() string { return "itinerary_days" }
