package model

import "time"

// ChatMessage — riwayat percakapan chat AI per trip. F-011 s/d F-016.
type ChatMessage struct {
	ID        uint64    `json:"id"         gorm:"primaryKey"`
	TripID    uint64    `json:"trip_id"    gorm:"not null;index"`
	// 'user' | 'ai' | 'system'
	Sender    string    `json:"sender"     gorm:"not null"`
	Message   string    `json:"message"    gorm:"type:text;not null"`
	// F-015: nomor versi yang dihasilkan jika pesan ini memicu update itinerary.
	// NULL jika pesan tidak mengubah itinerary (F-016: tanya umum).
	ResultedVersion *int `json:"resulted_version"`
	CreatedAt time.Time  `json:"created_at"`

	// Relations
	Trip Trip `json:"-" gorm:"foreignKey:TripID"`
}

func (ChatMessage) TableName() string { return "chat_messages" }
