package photosession

import (
	"database/sql"
	"log"
	"mime/multipart"
	"net/http"
	pModel "photographer-app/models/photo"
	psModel "photographer-app/models/photosession"
	"photographer-app/models/yandex"
	"sync"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
}

type PhotosessionData struct {
	Title           string                  `form:"title" binding:"required,min=2"`
	Path            string                  `form:"path" binding:"required,min=2"`
	Photos          []*multipart.FileHeader `form:"photos" binding:"required"`
	PhotosConverted []*multipart.FileHeader `form:"photosConverted" binding:"required"`
}

func (pc *Controller) CreatePhotosession(c *gin.Context) {
	photosessionData := getPhotosessionData(c)

	if !psModel.CheckUnique(pc.DB, photosessionData.Path) {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Фотосессия с таким названием уже существует."})
		return
	}

	pc.uploadPhotosToYandex(c, photosessionData.Photos, photosessionData.PhotosConverted, photosessionData.Path)

	maxPosition, err := psModel.MaxPosition(pc.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}
	photosessionId := pc.createPhotosession(c, photosessionData.Title, photosessionData.Path, maxPosition)
	pc.createPhotos(c, photosessionData.Photos, photosessionId)

	c.Status(http.StatusCreated)
}

func getPhotosessionData(c *gin.Context) *PhotosessionData {
	var photosessionData PhotosessionData

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

func (pc *Controller) uploadPhotosToYandex(c *gin.Context, photos, photosConverted []*multipart.FileHeader, path string) {
	var wg sync.WaitGroup
	var uploadErr error
	var mu sync.Mutex

	upload := func(photo *multipart.FileHeader, subPath string) {
		defer wg.Done()

		err := pc.Yandex.UploadPhoto(photo, subPath)
		if err != nil {
			log.Println("Upload image to Yandex error:", err)
			mu.Lock()
			if uploadErr == nil {
				uploadErr = err
			}
			mu.Unlock()
		}
	}

	for _, photo := range photos {
		wg.Add(1)
		go upload(photo, "photosession/"+path+"/")
	}
	for _, photo := range photosConverted {
		wg.Add(1)
		go upload(photo, "photosession/"+path+"/")
	}

	wg.Wait()

	if uploadErr != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото в яндекс облако"})
	}
}

func (pc *Controller) createPhotosession(c *gin.Context, title, folderName string, maxPosition int) int {
	photosession := psModel.Photosession{
		Title:      title,
		FolderName: folderName,
		Position:   maxPosition + 1,
		Public:     false,
		Type:       "portfolio",
	}

	photosessionId, err := photosession.Create(pc.DB)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фотосессии, попробуйте позже."})
		return 0
	}

	return photosessionId
}

func (pc *Controller) createPhotos(c *gin.Context, photos []*multipart.FileHeader, photosessionId int) {
	for index, photo := range photos {
		photoData := pModel.Photo{
			Name:           photo.Filename,
			Position:       index,
			Public:         false,
			PhotosessionId: photosessionId,
		}

		err := photoData.Create(pc.DB)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки фото, попробуйте позже."})
			return
		}
	}
}
