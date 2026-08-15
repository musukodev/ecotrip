package model

import "time"

// CarbonOffset — donasi carbon offset dari Turis. F-019.
type CarbonOffset struct {
	ID          uint64    `json:"id"           gorm:"primaryKey"`
	UserID      uint64    `json:"user_id"      gorm:"not null;index"`
	TripID      uint64    `json:"trip_id"      gorm:"not null;index"`
	// nominal donasi dalam IDR (Rp 25.000 / 50.000 / 100.000 sesuai prototype)
	AmountIDR   float64   `json:"amount_idr"   gorm:"column:amount_idr;type:numeric(15,2);not null;check:amount_idr > 0"`
	// jumlah emisi yang ditebus (kg CO2)
	CarbonKg    float64   `json:"carbon_kg"    gorm:"type:numeric(8,2);not null;check:carbon_kg > 0"`
	// nama program penerima donasi
	ProgramName string    `json:"program_name" gorm:"not null;default:'Penanaman Mangrove Lokal'"`
	// 'pending' | 'completed' | 'failed'
	Status      string    `json:"status"       gorm:"not null;default:completed"`
	CreatedAt   time.Time `json:"created_at"`

	// Relations
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Trip Trip `json:"trip,omitempty" gorm:"foreignKey:TripID"`
}

func (CarbonOffset) TableName() string { return "carbon_offsets" }
