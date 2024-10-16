package routes

import (
	"database/sql"
	"net/http"
	"photographer-app/routes/user"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type Claims struct {
	Login string
	jwt.StandardClaims
}

func InitRouter(db *sql.DB, jwtKey []byte) *gin.Engine {
	router := gin.Default()
	oapi := router.Group("/oapi/")
	{
		user.AddPublicRoutes(oapi, db, jwtKey)
	}
	api := router.Group("/api/")
	api.Use(AuthMiddleware(jwtKey))
	{
		user.AddPrivateRoutes(api, db)
	}

	return router
}

func AuthMiddleware(jwtKey []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("authToken")

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Требуется авторизация"})
			return
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Токен отсутствует"})
			c.Abort()
			return
		}

		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверная подпись токена"})
				c.Abort()
				return
			}
			c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный токен"})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Невалидный токен"})
			c.Abort()
			return
		}

		c.Set("login", claims.Login)
		c.Next()
	}
}

func protected(c *gin.Context) {
	username := c.MustGet("username").(string)
	c.JSON(http.StatusOK, gin.H{"message": "Добро пожаловать!", "user": username})
}
