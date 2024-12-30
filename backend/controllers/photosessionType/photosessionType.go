package photosessionType

import (
	"database/sql"
	"mime/multipart"
	"net/http"
	"photographer-app/models/yandex"
	pService "photographer-app/services/photo"
	pstService "photographer-app/services/photosessionType"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
}

type CreatePhotosessionTypeData struct {
	Title       string                `form:"title" binding:"required,min=3"`
	Mnemonic    string                `form:"title" binding:"required,min=3"`
	Photo       *multipart.FileHeader `form:"photo" binding:"required"`
	Description string                `form:"description" binding:"required,min=10"`
}

func CreatePhotosessionType(c *gin.Context, db *sql.DB, yandex *yandex.Yandex) {
	data := getCreateData(c)
	pstService := pstService.PhotosessionTypeService{
		DB:     db,
		Yandex: yandex,
	}

	if !pstService.CheckUnique(data.Mnemonic) {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Тип фотосессии с таким названием уже существует."})
		return
	}

	err := pstService.UploadPhotoToYandex(data.Photo)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото в яндекс облако"})
		return
	}

	err = pstService.CreatePhotosessionType(data.Title, data.Mnemonic, data.Photo.Filename, data.Description)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки типа фотосессии, попробуйте позже."})
		return
	}

	pService := pService.PhotoService{
		DB: db,
	}
	err = pService.CreatePhoto(data.Photo, 0, true, nil)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото, попробуйте позже."})
		return
	}

	c.Status(http.StatusCreated)
}

// PRIVATE METHODS

func getCreateData(c *gin.Context) *CreatePhotosessionTypeData {
	var photosessionTypeData CreatePhotosessionTypeData

	if err := c.ShouldBind(&photosessionTypeData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Ошибка валидации данных."})
		return nil
	}

	return &photosessionTypeData
}
