package photosession

import (
	"database/sql"
	"photographer-app/controllers/photosession"
	"photographer-app/models/yandex"

	"github.com/gin-gonic/gin"
)

func AddPublicRoutes(router *gin.RouterGroup, db *sql.DB, jwtKey []byte) {
	// TODO: Ручки по получению фотосессий
}

func AddPrivateRoutes(router *gin.RouterGroup, db *sql.DB, yandex *yandex.Yandex) {
	photosessionController := photosession.Controller{
		DB:     db,
		Yandex: yandex,
	}

	router.POST("photosession/create", func(c *gin.Context) {
		photosessionController.CreatePhotosession(c)
	})
}
