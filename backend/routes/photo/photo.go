package photo

import (
	"database/sql"
	"photographer-app/controllers/photo"
	"photographer-app/models/yandex"

	"github.com/gin-gonic/gin"
)

func AddPublicRoutes(router *gin.RouterGroup, db *sql.DB) {}

func AddPrivateRoutes(router *gin.RouterGroup, db *sql.DB, yandex *yandex.Yandex) {
	photoController := photo.Controller{
		DB:     db,
		Yandex: yandex,
	}

	router.DELETE("photo/delete", func(c *gin.Context) {
		photoController.Delete(c)
	})
}
