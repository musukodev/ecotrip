package model

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

// Destination — MF-016: Direktori Destinasi Wisata Batam (nature, culture, culinary, shopping, adventure, relaxation)
type Destination struct {
	ID                         uint64         `json:"id"                           gorm:"primaryKey"`
	CreatedBy                  *uint64        `json:"created_by"                   gorm:"index"`
	Name                       string         `json:"name"                         gorm:"not null"`
	Category                   string         `json:"category"                     gorm:"not null;check:category IN ('nature', 'culture', 'culinary', 'shopping', 'adventure', 'relaxation')"`
	Description                string         `json:"description"                  gorm:"type:text"`
	Location                   string         `json:"location"                     gorm:"type:varchar(255);not null"`
	Latitude                   *float64       `json:"latitude"                     gorm:"type:numeric(10,7)"`
	Longitude                  *float64       `json:"longitude"                    gorm:"type:numeric(10,7)"`
	OpeningHours               string         `json:"opening_hours"                gorm:"type:varchar(100)"` // e.g. "08:00 - 18:00"
	TicketPrice                float64        `json:"ticket_price"                 gorm:"type:numeric(15,2);default:0"`
	BestVisitTime              string         `json:"best_visit_time"              gorm:"type:varchar(100)"` // e.g. "Morning / Afternoon"
	Facilities                 pq.StringArray `json:"facilities"                   gorm:"type:text[];default:'{}'"`
	Photos                     pq.StringArray `json:"photos"                       gorm:"type:text[];default:'{}'"`
	Phone                      string         `json:"phone"                        gorm:"type:varchar(50)"`
	EcoScore                   float64        `json:"eco_score"                    gorm:"type:numeric(5,2);default:0"` // Scale 0-100
	ConservationContributionPct float64       `json:"conservation_contribution_pct" gorm:"type:numeric(5,2);default:0"` // e.g. 10.0 (%)
	CreatedAt                  time.Time      `json:"created_at"`
	UpdatedAt                  time.Time      `json:"updated_at"`
	DeletedAt                  gorm.DeletedAt `json:"-"                            gorm:"index"`

	// Relations
	Ratings    []Rating            `json:"ratings,omitempty"    gorm:"foreignKey:DestinationID"`
	Activities []ItineraryActivity `json:"activities,omitempty" gorm:"foreignKey:DestinationID"`
	Creator    *User               `json:"creator,omitempty"    gorm:"foreignKey:CreatedBy"`
}

func (Destination) TableName() string { return "destinations" }
