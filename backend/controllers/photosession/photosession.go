package photosession

import (
	"database/sql"
	"mime/multipart"
	"net/http"
	psModel "photographer-app/models/photosession"
	"photographer-app/models/yandex"
	pService "photographer-app/services/photo"
	psService "photographer-app/services/photosession"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
}

type CreatePhotosessionData struct {
	Title           string                  `form:"title" binding:"required,min=2"`
	Path            string                  `form:"path" binding:"required,min=2"`
	Photos          []*multipart.FileHeader `form:"photos" binding:"required"`
	PhotosConverted []*multipart.FileHeader `form:"photosConverted" binding:"required"`
}

// PUBLIC METHODS

func CreatePhotosession(c *gin.Context, db *sql.DB, yandex *yandex.Yandex) {
	data := getCreateData(c)
	psService := psService.PhotosessionService{
		DB:     db,
		Yandex: yandex,
	}

	if !psService.CheckUnique(data.Path) {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Фотосессия с таким названием уже существует."})
		return
	}

	err := psService.UploadPhotosToYandex(data.Photos, data.PhotosConverted, data.Path)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото в яндекс облако"})
		return
	}

	maxPosition, err := psService.MaxPosition(db)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}
	photosessionId, err := psService.CreatePhotosession(data.Title, data.Path, maxPosition)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фотосессии, попробуйте позже."})
		return
	}

	pService := pService.PhotoService{
		DB: db,
	}
	err = pService.CreatePhotos(data.Photos, photosessionId)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото, попробуйте позже."})
		return
	}

	c.Status(http.StatusCreated)
}

func List(c *gin.Context, db *sql.DB) {
	psService := psService.PhotosessionService{
		DB: db,
	}
	list, err := psService.List()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": list})
}

func Portfolio(c *gin.Context, db *sql.DB) {
	psService := psService.PhotosessionService{
		DB: db,
	}

	portfolio, err := psService.Portfolio()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func UpdatePhotosession(c *gin.Context, db *sql.DB) {
	data := getUpdateData(c)
	psService := psService.PhotosessionService{
		DB: db,
	}

	err := psService.UpdatePhotosession(data)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка сохранения фотосессии, попробуйте позже."})
		return
	}

	pService := pService.PhotoService{
		DB: db,
	}

	err = pService.UpdatePhotos(data.Photos)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка сохранения фотосессии, попробуйте позже."})
		return
	}

	c.Status(http.StatusOK)
}

func GetPhotosession(c *gin.Context, db *sql.DB) {
	name := c.Query("name")
	psService := psService.PhotosessionService{
		DB: db,
	}

	photosession, err := psService.GetPhotosession(name)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка получения фотосессии, попробуйте позже."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": photosession})
}

// PRIVATE METHODS

func getCreateData(c *gin.Context) *CreatePhotosessionData {
	var photosessionData CreatePhotosessionData

	if err := c.ShouldBind(&photosessionData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Ошибка валидации данных."})
		return nil
	}
	if len(photosessionData.Photos) == 0 || len(photosessionData.PhotosConverted) == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Нужно загрузить хотя бы одно фото!"})
		return nil
	}

	return &photosessionData
}

func getUpdateData(c *gin.Context) *psModel.Photosession {
	var photosessionData psModel.Photosession

	if err := c.ShouldBindJSON(&photosessionData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Ошибка валидации данных."})
		return nil
	}

	return &photosessionData
}
