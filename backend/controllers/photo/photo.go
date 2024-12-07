package photo

import (
	"database/sql"
	"mime/multipart"
	"net/http"
	"strconv"

	pModel "photographer-app/models/photo"
	"photographer-app/models/yandex"
	pService "photographer-app/services/photo"
	psService "photographer-app/services/photosession"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
}

type UploadPhotosData struct {
	PhotosessionName string                  `form:"photosessionName" binding:"required,min=2"`
	Photos           []*multipart.FileHeader `form:"photos" binding:"required"`
	PhotosConverted  []*multipart.FileHeader `form:"photosConverted" binding:"required"`
}

func (pc *Controller) Upload(c *gin.Context) {
	uploadPhotosData := getUploadData(c)
	psService := psService.PhotosessionService{
		DB:     pc.DB,
		Yandex: pc.Yandex,
	}
	photosession, err := psService.GetPhotosession(uploadPhotosData.PhotosessionName)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Не удалось найти фотосессию для загрузки."})
		return
	}

	err = psService.UploadPhotosToYandex(uploadPhotosData.Photos, uploadPhotosData.PhotosConverted, uploadPhotosData.PhotosessionName)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото в яндекс облако"})
		return
	}

	pService := pService.PhotoService{
		DB: pc.DB,
	}

	err = pService.CreatePhotos(uploadPhotosData.Photos, photosession.ID)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото, попробуйте позже."})
		return
	}

	c.Status(http.StatusOK)
}

func (pc *Controller) Delete(c *gin.Context) {
	photoId := c.Query("id")
	id, err := strconv.Atoi(photoId)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Ошибка удаления, попробуйте позже."})
		return
	}

	photoData := pModel.Photo{
		ID: id,
	}
	pService := pService.PhotoService{
		DB:     pc.DB,
		Yandex: pc.Yandex,
	}
	err = pService.Delete(&photoData)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка удаления, попробуйте позже."})
		return
	}

	c.Status(http.StatusOK)
}

func getUploadData(c *gin.Context) *UploadPhotosData {
	var uploadPhotosData UploadPhotosData

	if err := c.ShouldBind(&uploadPhotosData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Ошибка валидации данных."})
		return nil
	}
	if len(uploadPhotosData.Photos) == 0 || len(uploadPhotosData.PhotosConverted) == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Нужно загрузить хотя бы одно фото!"})
		return nil
	}

	return &uploadPhotosData
}
