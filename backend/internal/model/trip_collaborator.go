package model

import "time"

// TripCollaborator — kolaborator yang diundang ke sebuah trip. F-037.
type TripCollaborator struct {
	ID        uint64    `json:"id"         gorm:"primaryKey"`
	TripID    uint64    `json:"trip_id"    gorm:"not null;index"`
	// user yang diundang (bukan pemilik trip)
	UserID    uint64    `json:"user_id"    gorm:"not null;index"`
	// 'editor' (bisa edit) | 'viewer' (hanya lihat)
	Role      string    `json:"role"       gorm:"not null;default:viewer"`
	InvitedAt time.Time `json:"invited_at" gorm:"not null;default:now()"`

	// Relations
	Trip Trip `json:"trip,omitempty" gorm:"foreignKey:TripID"`
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (TripCollaborator) TableName() string { return "trip_collaborators" }
