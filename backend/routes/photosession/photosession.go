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
	router.POST("photosession/create", func(c *gin.Context) {
		photosession.CreatePhotosession(c, db, yandex)
	})
	router.GET("photosession/list", func(c *gin.Context) {
		photosession.List(c, db)
	})
	router.POST("photosession/update", func(c *gin.Context) {
		photosession.UpdatePhotosession(c, db)
	})
}
