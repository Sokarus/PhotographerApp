package user

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       int      `json:"id"`
	Login    string   `json:"login"`
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Roles    []string `json:"roles"`
}

type Claims struct {
	Login string
	jwt.StandardClaims
}

func (u *User) CreateUser(db *sql.DB, jwtKey []byte) (string, string) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)

	if err != nil {
		log.Println("Hash generating from password error:", err)
		return "", "Hash password error"
	}

	u.Password = string(hashedPassword)

	query := "insert into users (login, email, password) values ($1, $2, $3)"
	_, err = db.Exec(query, u.Login, u.Email, u.Password)

	if err != nil {
		log.Println("Insert new user error:", err)
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" {
				return "", pqErr.Constraint
			}
		}

		return "", "Db request error"
	}

	return u.Auth(db, jwtKey)
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))

	if err != nil {
		log.Println("Check password hash error:", err)
		return false
	}

	return true
}

func (u *User) DoLogin(db *sql.DB, jwtKey []byte) (string, string) {
	var login string

	query := "select login from users where login = $1"
	err := db.QueryRow(query, u.Login).Scan(&login)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Db error, user with login " + login + " are not exist")
			return "", "User not exist"
		} else {
			log.Println("Db error:", err)
			return "", "Db request error"
		}
	}

	if !u.CheckPassword(u.Password) {
		return "", "Wrong password"
	}

	return u.Auth(db, jwtKey)
}

func (u *User) Auth(db *sql.DB, jwtKey []byte) (string, string) {
	expirationTime := time.Now().Add(60 * time.Minute)
	claims := &Claims{
		Login: u.Login,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		return "", "Coudnt make token"
	}

	return tokenString, ""
}

func Data(db *sql.DB, login string) (map[string]interface{}, string) {
	var user User
	var rolesBytes []byte

	query := "select email, login, roles from users where login = $1"
	err := db.QueryRow(query, login).Scan(&user.Email, &user.Login, &rolesBytes)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Db error, user with login " + login + " are not exist")
			return nil, "User not exist"
		} else {
			log.Println("Db error:", err)
			return nil, "Db request error"
		}
	}

	if err := json.Unmarshal(rolesBytes, &user.Roles); err != nil {
		log.Println("Parse roles from db error:", err)
		return nil, "Cant parse roles from db"
	}

	return map[string]interface{}{
		"login": user.Login,
		"email": user.Email,
		"roles": user.Roles,
	}, ""
}
