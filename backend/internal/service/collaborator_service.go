package service

import (
	"errors"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/repository"
)

type CollaboratorService interface {
	// F-037: undang kolaborator via email
	Invite(ownerID, tripID uint64, inviteeEmail, role string) (*model.TripCollaborator, error)
	// F-037: daftar kolaborator sebuah trip
	GetCollaborators(tripID, requesterID uint64) ([]model.TripCollaborator, error)
	// F-037: hapus kolaborator
	Remove(ownerID, tripID, targetUserID uint64) error
}

type collaboratorService struct {
	collabRepo repository.TripCollaboratorRepository
	tripRepo   repository.TripRepository
	userRepo   repository.UserRepository
	notifRepo  repository.NotificationRepository
}

func NewCollaboratorService(
	collabRepo repository.TripCollaboratorRepository,
	tripRepo repository.TripRepository,
	userRepo repository.UserRepository,
	notifRepo repository.NotificationRepository,
) CollaboratorService {
	return &collaboratorService{
		collabRepo: collabRepo,
		tripRepo:   tripRepo,
		userRepo:   userRepo,
		notifRepo:  notifRepo,
	}
}

func (s *collaboratorService) Invite(ownerID, tripID uint64, inviteeEmail, role string) (*model.TripCollaborator, error) {
	// validasi trip milik owner
	trip, err := s.tripRepo.FindByID(tripID, ownerID)
	if err != nil {
		return nil, errors.New("trip tidak ditemukan atau bukan milik kamu")
	}

	// validasi role
	if role != "editor" && role != "viewer" {
		return nil, errors.New("role harus 'editor' atau 'viewer'")
	}

	// cari user berdasarkan email
	invitee, err := s.userRepo.FindByEmail(inviteeEmail)
	if err != nil {
		return nil, errors.New("email tidak terdaftar")
	}

	// tidak boleh undang diri sendiri
	if invitee.ID == ownerID {
		return nil, errors.New("kamu tidak bisa mengundang dirimu sendiri")
	}

	// cek sudah jadi kolaborator
	if s.collabRepo.IsCollaborator(invitee.ID, tripID) {
		return nil, errors.New("pengguna sudah menjadi kolaborator trip ini")
	}

	collab := &model.TripCollaborator{
		TripID: tripID,
		UserID: invitee.ID,
		Role:   role,
	}
	if err := s.collabRepo.Create(collab); err != nil {
		return nil, err
	}

	// notifikasi ke invitee (trip_shared)
	refType := "trip"
	refID := tripID
	_ = s.notifRepo.Create(&model.Notification{
		UserID:  invitee.ID,
		Type:    "trip_shared",
		Title:   "Trip Dibagikan ke Kamu",
		Message: "Kamu diundang untuk " + roleLabel(role) + " trip: " + trip.Title,
		RefType: &refType,
		RefID:   &refID,
	})

	return collab, nil
}

func (s *collaboratorService) GetCollaborators(tripID, requesterID uint64) ([]model.TripCollaborator, error) {
	// hanya owner atau kolaborator yang bisa lihat daftar
	ok, err := repository.IsTripOwnerOrCollaborator(requesterID, tripID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, errors.New("akses ditolak")
	}
	return s.collabRepo.FindByTrip(tripID)
}

func (s *collaboratorService) Remove(ownerID, tripID, targetUserID uint64) error {
	// hanya owner yang bisa hapus kolaborator
	if _, err := s.tripRepo.FindByID(tripID, ownerID); err != nil {
		return errors.New("trip tidak ditemukan atau bukan milik kamu")
	}

	if err := s.collabRepo.Delete(targetUserID, tripID); err != nil {
		return errors.New("gagal menghapus kolaborator")
	}

	// notifikasi ke user yang dihapus
	refType := "trip"
	refID := tripID
	_ = s.notifRepo.Create(&model.Notification{
		UserID:  targetUserID,
		Type:    "collaborator_removed",
		Title:   "Akses Trip Dicabut",
		Message: "Akses kamu ke trip telah dicabut oleh pemilik trip.",
		RefType: &refType,
		RefID:   &refID,
	})

	return nil
}

func roleLabel(role string) string {
	if role == "editor" {
		return "mengedit"
	}
	return "melihat"
}
