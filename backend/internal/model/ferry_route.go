package model

import "time"

// FerryRoute — MF-017: Estimasi biaya kapal/feri keberangkatan
type FerryRoute struct {
	ID               uint64     `json:"id"                gorm:"primaryKey"`
	CreatedBy        *uint64    `json:"created_by"        gorm:"index"`
	OriginCountry    string     `json:"origin_country"    gorm:"not null;check:origin_country IN ('singapore', 'malaysia')"`
	OriginPort       string     `json:"origin_port"       gorm:"not null"` // e.g. "HarbourFront", "Stulang Laut"
	DestinationPort  string     `json:"destination_port"  gorm:"not null"` // e.g. "Harbour Bay Batam", "Batam Center"
	OperatorName     string     `json:"operator_name"     gorm:"type:varchar(255)"`
	PriceOneWay      float64    `json:"price_one_way"     gorm:"type:numeric(15,2);not null"`
	PriceRoundTrip   float64    `json:"price_round_trip"  gorm:"type:numeric(15,2);not null"`
	Currency         string     `json:"currency"          gorm:"type:varchar(10);not null;default:'IDR'"`
	DurationMinutes  int        `json:"duration_minutes"  gorm:"default:50"`
	SourceURL        string     `json:"source_url"        gorm:"type:varchar(500)"`
	LastScrapedAt    *time.Time `json:"last_scraped_at"`
	UpdatedAt        time.Time  `json:"updated_at"`

	// Relations
	Creator *User `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
}

func (FerryRoute) TableName() string { return "ferry_routes" }
