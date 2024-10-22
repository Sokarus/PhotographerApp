package user

import (
	"database/sql"
	"encoding/json"
	"errors"
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

func (u *User) Create(db *sql.DB, jwtKey []byte) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)

	if err != nil {
		log.Println("Hash generating from password error:", err)
		return "", errors.New("hash password error")
	}

	u.Password = string(hashedPassword)

	query := "insert into users (login, email, password) values ($1, $2, $3)"
	_, err = db.Exec(query, u.Login, u.Email, u.Password)

	if err != nil {
		log.Println("Insert new user error:", err)
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == "23505" {
				return "", errors.New(pqErr.Constraint)
			}
		}

		return "", errors.New("db request error")
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

func (u *User) DoLogin(db *sql.DB, jwtKey []byte) (string, error) {
	secretPassword := u.Password
	query := "select login, password from users where login = $1"
	err := db.QueryRow(query, u.Login).Scan(&u.Login, &u.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Db error, user with login " + u.Login + " are not exist")
			return "", errors.New("User not exist")
		} else {
			log.Println("Db error:", err)
			return "", errors.New("db request error")
		}
	}

	if !u.CheckPassword(secretPassword) {
		return "", errors.New("wrong password")
	}

	return u.Auth(db, jwtKey)
}

func (u *User) Auth(db *sql.DB, jwtKey []byte) (string, error) {
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
		return "", errors.New("coudnt make token")
	}

	return tokenString, nil
}

func Data(db *sql.DB, login string) (map[string]interface{}, error) {
	var user User
	var rolesBytes []byte

	query := "select email, login, roles from users where login = $1"
	err := db.QueryRow(query, login).Scan(&user.Email, &user.Login, &rolesBytes)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Db error, user with login " + login + " are not exist")
			return nil, errors.New("user not exist")
		} else {
			log.Println("Db error:", err)
			return nil, errors.New("db request error")
		}
	}

	if err := json.Unmarshal(rolesBytes, &user.Roles); err != nil {
		log.Println("Parse roles from db error:", err)
		return nil, errors.New("cant parse roles from db")
	}

	return map[string]interface{}{
		"login": user.Login,
		"email": user.Email,
		"roles": user.Roles,
	}, nil
}
