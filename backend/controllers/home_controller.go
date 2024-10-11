package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"photographer-app/models"
)

func Home(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, models.GetData())
}

func About(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, "{asd: \"asd\"}")
}
