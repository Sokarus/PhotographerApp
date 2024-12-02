package routes

import (
	"database/sql"
	"log"
	"net/http"
	"photographer-app/models/yandex"
	"photographer-app/routes/photo"
	"photographer-app/routes/photosession"
	"photographer-app/routes/user"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type Claims struct {
	Login string
	jwt.StandardClaims
}

func InitRouter(db *sql.DB, jwtKey []byte, yandex *yandex.Yandex, host string) *gin.Engine {
	router := gin.Default()
	oapi := router.Group("/oapi/")
	{
		user.AddPublicRoutes(oapi, db, jwtKey, host)
		photosession.AddPublicRoutes(oapi, db)
	}
	api := router.Group("/api/")
	api.Use(AuthMiddleware(jwtKey))
	{
		user.AddPrivateRoutes(api, db, host)
		photosession.AddPrivateRoutes(api, db, yandex)
		photo.AddPrivateRoutes(api, db, yandex)
	}

	return router
}

func AuthMiddleware(jwtKey []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("authToken")

		if err != nil {
			log.Println("Getting auth token error:", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Требуется авторизация"})
			return
		}

		if tokenString == "" {
			log.Println("Empty auth token")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Токен отсутствует"})
			return
		}

		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				log.Println("Wrong token signature")
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Неверная подпись токена"})
				return
			}
			log.Println("Wrong token:", err)
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Неверный токен"})
			return
		}

		if !token.Valid {
			log.Println("Not valid token")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Невалидный токен"})
			return
		}

		c.Set("login", claims.Login)
		c.Next()
	}
}
