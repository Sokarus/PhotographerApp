package user

import (
	"database/sql"
	"net/http"
	"photographer-app/models/user"

	"github.com/gin-gonic/gin"
)

type LoginData struct {
	Login    string `json:"login" binding:"required,min=3"`
	Password string `json:"password" binding:"required,min=6"`
}

func Login(c *gin.Context, db *sql.DB, jwtKey []byte) {
	var json LoginData

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := user.User{
		Login:    json.Login,
		Password: json.Password,
	}

	token, err := user.DoLogin(db, jwtKey)

	if err == nil {
		c.SetCookie(
			"authToken",
			token,
			3600,
			"/",
			"localhost",
			false,
			true,
		)

		c.Status(http.StatusOK)
		return
	}

	switch err.Error() {
	case "user not exist":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Пользователь не найден."})
		return
	case "wrong password":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Неверный пароль."})
		return
	case "coudnt make token":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	case "db request error":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}
}

type RegistrationData struct {
	Login    string `json:"login" binding:"required,min=3"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func Registration(c *gin.Context, db *sql.DB, jwtKey []byte) {
	var json RegistrationData

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := user.User{
		Login:    json.Login,
		Email:    json.Email,
		Password: json.Password,
	}

	token, err := user.CreateUser(db, jwtKey)

	if err == nil {
		c.SetCookie(
			"authToken",
			token,
			3600,
			"/",
			"localhost",
			false,
			true,
		)

		c.Status(http.StatusCreated)
		return
	}

	switch err.Error() {
	case "unique_login":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Такой логин уже существует."})
		return
	case "unique_email":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Данная почта уже используется."})
		return
	case "db request error":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	case "hash password error":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	case "cant parse roles from db":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}
}

func Data(c *gin.Context, db *sql.DB) {
	login, exist := c.Get("login")

	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Ошибка авторизации"})
		return
	}

	loginStr, ok := login.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Ошибка авторизации"})
		return
	}

	userData, err := user.Data(db, loginStr)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{"login": userData["login"], "roles": userData["roles"]})
		return
	}

	switch err.Error() {
	case "not valid token":
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Невалидный токен."})
		return
	case "user not exist":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Пользователь не найден."})
		return
	case "db request error":
		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка, попробуйте позже."})
		return
	}
}

func Logout(c *gin.Context) {
	c.SetCookie(
		"authToken",
		"",
		0,
		"/",
		"localhost",
		false,
		true,
	)
	c.Set("login", nil)

	c.Status(http.StatusOK)
}