package user

import (
	"database/sql"
	"photographer-app/controllers/user"

	"github.com/gin-gonic/gin"
)

func AddPublicRoutes(router *gin.RouterGroup, db *sql.DB, jwtKey []byte, host string) {
	userController := user.Controller{
		DB:     db,
		JwtKey: jwtKey,
		Host:   host,
	}

	router.POST("user/login", func(c *gin.Context) {
		userController.Login(c)
	})
	router.POST("user/registration", func(c *gin.Context) {
		userController.Registration(c)
	})
}

func AddPrivateRoutes(router *gin.RouterGroup, db *sql.DB, host string) {
	userController := user.Controller{
		DB: db,
	}

	router.GET("user/data", func(c *gin.Context) {
		userController.Data(c)
	})
	router.POST("user/logout", func(c *gin.Context) {
		user.Logout(c, host)
	})
}
