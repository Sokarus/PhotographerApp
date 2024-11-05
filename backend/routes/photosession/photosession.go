package photosession

import (
	"database/sql"
	"photographer-app/controllers/photosession"
	"photographer-app/models/yandex"

	"github.com/gin-gonic/gin"
)

func AddPublicRoutes(router *gin.RouterGroup, db *sql.DB) {
	router.GET("photosession/portfolio", func(c *gin.Context) {
		photosession.Portfolio(c, db)
	})
	router.GET("photosession", func(c *gin.Context) {
		photosession.GetPhotosession(c, db)
	})
}

func AddPrivateRoutes(router *gin.RouterGroup, db *sql.DB, yandex *yandex.Yandex) {
	router.POST("photosession/create", func(c *gin.Context) {
		photosession.CreatePhotosession(c, db, yandex)
	})
	router.POST("photosession/update", func(c *gin.Context) {
		photosession.UpdatePhotosession(c, db)
	})
	router.GET("photosession/list", func(c *gin.Context) {
		photosession.List(c, db)
	})
}
