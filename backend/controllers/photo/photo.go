package photo

import (
	"database/sql"
	"net/http"
	"strconv"

	pModel "photographer-app/models/photo"
	"photographer-app/models/yandex"
	pService "photographer-app/services/photo"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
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
