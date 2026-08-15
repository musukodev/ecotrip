package handler

import (
	"net/http"
	"strconv"

	"github.com/ecotrip/backend/internal/model"
	"github.com/ecotrip/backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type BusinessAdminHandler struct {
	destSvc service.DestinationService
	accSvc  service.AccommodationService
}

func NewBusinessAdminHandler(
	destSvc service.DestinationService,
	accSvc service.AccommodationService,
) *BusinessAdminHandler {
	return &BusinessAdminHandler{
		destSvc: destSvc,
		accSvc:  accSvc,
	}
}

// =========================================================================
// DESTINASI (Alam, Budaya, Kuliner)
// =========================================================================

type createDestinationRequest struct {
	Name                       string   `json:"name"                         binding:"required"`
	Category                   string   `json:"category"                     binding:"required"` // nature|culture|culinary|shopping|adventure|relaxation
	Description                string   `json:"description"`
	Location                   string   `json:"location"                     binding:"required"`
	Latitude                   *float64 `json:"latitude"`
	Longitude                  *float64 `json:"longitude"`
	OpeningHours               string   `json:"opening_hours"`
	TicketPrice                float64  `json:"ticket_price"`
	BestVisitTime              string   `json:"best_visit_time"`
	Facilities                 []string `json:"facilities"`
	Photos                     []string `json:"photos"`
	Phone                      string   `json:"phone"`
	ConservationContributionPct float64 `json:"conservation_contribution_pct"`
}

func (h *BusinessAdminHandler) CreateDestination(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req createDestinationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dest := &model.Destination{
		CreatedBy:                  &userID,
		Name:                       req.Name,
		Category:                   req.Category,
		Description:                req.Description,
		Location:                   req.Location,
		Latitude:                   req.Latitude,
		Longitude:                  req.Longitude,
		OpeningHours:               req.OpeningHours,
		TicketPrice:                req.TicketPrice,
		BestVisitTime:              req.BestVisitTime,
		Facilities:                 pq.StringArray(req.Facilities),
		Photos:                     pq.StringArray(req.Photos),
		Phone:                      req.Phone,
		ConservationContributionPct: req.ConservationContributionPct,
	}

	if err := h.destSvc.Create(dest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Destinasi berhasil ditambahkan", "destination": dest})
}

func (h *BusinessAdminHandler) GetMyDestinations(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	dests, err := h.destSvc.GetByCreator(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat destinasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"destinations": dests, "count": len(dests)})
}

func (h *BusinessAdminHandler) UpdateDestination(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	existing, err := h.destSvc.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destinasi tidak ditemukan"})
		return
	}
	if existing.CreatedBy != nil && *existing.CreatedBy != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Anda tidak berhak mengubah destinasi ini"})
		return
	}

	var req createDestinationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dest := &existing.Destination
	dest.Name = req.Name
	dest.Category = req.Category
	dest.Description = req.Description
	dest.Location = req.Location
	dest.Latitude = req.Latitude
	dest.Longitude = req.Longitude
	dest.OpeningHours = req.OpeningHours
	dest.TicketPrice = req.TicketPrice
	dest.BestVisitTime = req.BestVisitTime
	dest.Facilities = pq.StringArray(req.Facilities)
	dest.Photos = pq.StringArray(req.Photos)
	dest.Phone = req.Phone
	dest.ConservationContributionPct = req.ConservationContributionPct

	if err := h.destSvc.Update(dest); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate destinasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Destinasi berhasil diperbarui", "destination": dest})
}

func (h *BusinessAdminHandler) DeleteDestination(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	if err := h.destSvc.Delete(id, userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Destinasi berhasil dihapus"})
}

// =========================================================================
// AKOMODASI (Hotel, Resort, Homestay)
// =========================================================================

type createAccommodationRequest struct {
	Name                string   `json:"name"                 binding:"required"`
	Category            string   `json:"category"             binding:"required"` // hotel|resort|homestay
	Description         string   `json:"description"`
	Location            string   `json:"location"             binding:"required"`
	Latitude            *float64 `json:"latitude"`
	Longitude           *float64 `json:"longitude"`
	PricePerNight       float64  `json:"price_per_night"      binding:"required"`
	Facilities          []string `json:"facilities"`
	Photos              []string `json:"photos"`
	Phone               string   `json:"phone"`
	EnvironmentalImpact string   `json:"environmental_impact"`
}

func (h *BusinessAdminHandler) CreateAccommodation(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	var req createAccommodationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	acc := &model.Accommodation{
		CreatedBy:           &userID,
		Name:                req.Name,
		Category:            req.Category,
		Description:         req.Description,
		Location:            req.Location,
		Latitude:            req.Latitude,
		Longitude:           req.Longitude,
		PricePerNight:       req.PricePerNight,
		Facilities:          pq.StringArray(req.Facilities),
		Photos:              pq.StringArray(req.Photos),
		Phone:               req.Phone,
		EnvironmentalImpact: req.EnvironmentalImpact,
	}

	if err := h.accSvc.Create(acc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Akomodasi berhasil ditambahkan", "accommodation": acc})
}

func (h *BusinessAdminHandler) GetMyAccommodations(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	accs, err := h.accSvc.GetByCreator(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat akomodasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"accommodations": accs, "count": len(accs)})
}

func (h *BusinessAdminHandler) UpdateAccommodation(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	existing, err := h.accSvc.GetByID(id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akomodasi tidak ditemukan"})
		return
	}
	if existing.CreatedBy != nil && *existing.CreatedBy != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Anda tidak berhak mengubah akomodasi ini"})
		return
	}

	var req createAccommodationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	acc := &existing.Accommodation
	acc.Name = req.Name
	acc.Category = req.Category
	acc.Description = req.Description
	acc.Location = req.Location
	acc.Latitude = req.Latitude
	acc.Longitude = req.Longitude
	acc.PricePerNight = req.PricePerNight
	acc.Facilities = pq.StringArray(req.Facilities)
	acc.Photos = pq.StringArray(req.Photos)
	acc.Phone = req.Phone
	acc.EnvironmentalImpact = req.EnvironmentalImpact

	if err := h.accSvc.Update(acc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate akomodasi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Akomodasi berhasil diperbarui", "accommodation": acc})
}

func (h *BusinessAdminHandler) DeleteAccommodation(c *gin.Context) {
	userID := c.MustGet("user_id").(uint64)
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	if err := h.accSvc.Delete(id, userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Akomodasi berhasil dihapus"})
}
