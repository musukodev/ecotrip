package model

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Trip struct {
	ID          uint64         `json:"id"          gorm:"primaryKey"`
	UserID      uint64         `json:"user_id"     gorm:"not null;index"`
	Title       string         `json:"title"       gorm:"not null"`
	Destination string         `json:"destination" gorm:"not null;default:'Batam'"`

	// F-007, F-008: preferensi input Turis
	OriginCountry           string         `json:"origin_country"           gorm:"type:varchar(50)"`
	OriginPort              string         `json:"origin_port"              gorm:"type:varchar(255)"`
	DurationDays            int            `json:"duration_days"            gorm:"not null;check:duration_days >= 1"`
	Pax                     int            `json:"pax"                      gorm:"not null;default:1;check:pax >= 1"`
	Budget                  float64        `json:"budget"                   gorm:"type:numeric(15,2);not null;default:0"`
	Interests               pq.StringArray `json:"interests"                gorm:"type:text[];not null;default:'{}'"`
	AccommodationPreference string         `json:"accommodation_preference" gorm:"type:varchar(50);default:'hotel'"` // hotel|resort|homestay|glamping|other
	Notes                   string         `json:"notes"                    gorm:"type:text"`
	StartDate               *time.Time     `json:"start_date"               gorm:"type:date"`
	EndDate                 *time.Time     `json:"end_date"                 gorm:"type:date"`

	// F-010, F-018, F-021, F-034: kalkulasi & estimasi biaya
	FerryCostRoundTrip  float64 `json:"ferry_cost_round_trip"  gorm:"type:numeric(15,2);not null;default:0"`
	TotalEstimatedCost  float64 `json:"total_estimated_cost"   gorm:"type:numeric(15,2);not null;default:0"`
	TotalCarbonKg       float64 `json:"total_carbon_kg"        gorm:"type:numeric(10,2);not null;default:0"`
	SustainabilityScore int     `json:"sustainability_score"   gorm:"not null;default:0;check:sustainability_score >= 0 AND sustainability_score <= 100"`

	// F-019: breakdown carbon
	CarbonFerryPct    float64 `json:"carbon_ferry_pct"    gorm:"type:numeric(5,2);not null;default:0"`
	CarbonAccomPct    float64 `json:"carbon_accom_pct"    gorm:"type:numeric(5,2);not null;default:0"`
	CarbonActivityPct float64 `json:"carbon_activity_pct" gorm:"type:numeric(5,2);not null;default:0"`

	// F-016: versi itinerary aktif
	CurrentVersion int    `json:"current_version" gorm:"not null;default:1"`
	Status         string `json:"status"          gorm:"not null;default:active;check:status IN ('draft', 'active', 'completed', 'archived', 'cancelled')"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	User          User               `json:"user,omitempty"          gorm:"foreignKey:UserID"`
	Versions      []TripVersion      `json:"versions,omitempty"      gorm:"foreignKey:TripID"`
	Days          []ItineraryDay     `json:"days,omitempty"          gorm:"foreignKey:TripID"`
	ChatMessages  []ChatMessage      `json:"chat_messages,omitempty" gorm:"foreignKey:TripID"`
	Collaborators []TripCollaborator `json:"collaborators,omitempty" gorm:"foreignKey:TripID"`
	CarbonOffsets []CarbonOffset     `json:"carbon_offsets,omitempty" gorm:"foreignKey:TripID"`
}
