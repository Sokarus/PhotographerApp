package user

import (
	"database/sql"
	"photographer-app/controllers/user"

	"github.com/gin-gonic/gin"
)

func AddPublicRoutes(router *gin.RouterGroup, db *sql.DB, jwtKey []byte) {
	router.POST("user/login", func(c *gin.Context) {
		user.Login(c, db, jwtKey)
	})
	router.POST("user/registration", func(c *gin.Context) {
		user.Registration(c, db, jwtKey)
	})
}

func AddPrivateRoutes(router *gin.RouterGroup, db *sql.DB) {
	router.GET("user/data", func(c *gin.Context) {
		user.Data(c, db)
	})
}
