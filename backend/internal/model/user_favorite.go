package model

import "time"

// UserFavorite — MF-015: Favorit Akomodasi Turis
type UserFavorite struct {
	ID              uint64        `json:"id"               gorm:"primaryKey"`
	UserID          uint64        `json:"user_id"          gorm:"not null;index"`
	AccommodationID uint64        `json:"accommodation_id" gorm:"not null;index"`
	CreatedAt       time.Time     `json:"created_at"`

	// Relations
	User          User          `json:"-"                      gorm:"foreignKey:UserID"`
	Accommodation Accommodation `json:"accommodation,omitempty" gorm:"foreignKey:AccommodationID"`
}

func (UserFavorite) TableName() string { return "user_favorites" }
