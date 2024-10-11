package routes

import (
	"photographer-app/controllers"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/", controllers.Home)
	router.GET("/about", controllers.About)

	return router
}
