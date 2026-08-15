package model

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

// ItineraryActivity — aktivitas per hari dalam itinerary Batam
type ItineraryActivity struct {
	ID        uint64         `json:"id"         gorm:"primaryKey"`
	DayID     uint64         `json:"day_id"     gorm:"not null;index"`
	SortOrder int            `json:"sort_order" gorm:"not null;default:0"`
	StartTime string         `json:"start_time" gorm:"type:varchar(20);not null"`
	Title     string         `json:"title"      gorm:"not null"`
	Description string       `json:"description" gorm:"type:text"`
	// 'nature'|'culture'|'culinary'|'shopping'|'adventure'|'relaxation'|'ferry'|'accommodation'
	Category  string         `json:"category"   gorm:"not null"`
	Tags      pq.StringArray `json:"tags"       gorm:"type:text[];not null;default:'{}'"`

	DistanceKm      float64 `json:"distance_km"      gorm:"type:numeric(8,2);not null;default:0"`
	DurationMinutes int     `json:"duration_minutes" gorm:"not null;default:0"`
	EstimatedCost   float64 `json:"estimated_cost"   gorm:"type:numeric(15,2);not null;default:0"`
	CarbonKg        float64 `json:"carbon_kg"        gorm:"type:numeric(8,2);not null;default:0"`
	IsValidated     bool    `json:"is_validated"     gorm:"not null;default:false"`

	// Relasi ke Destinasi atau Akomodasi
	DestinationID   *uint64 `json:"destination_id"   gorm:"index"`
	AccommodationID *uint64 `json:"accommodation_id" gorm:"index"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	Day           ItineraryDay   `json:"-"                      gorm:"foreignKey:DayID"`
	Destination   *Destination   `json:"destination,omitempty"   gorm:"foreignKey:DestinationID"`
	Accommodation *Accommodation `json:"accommodation,omitempty" gorm:"foreignKey:AccommodationID"`
}

func (ItineraryActivity) TableName() string { return "itinerary_activities" }
