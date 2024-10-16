package db

import (
	"database/sql"
	"fmt"
	"log"
	"photographer-app/config"
	"sync"

	_ "github.com/lib/pq"
)

var (
	db   *sql.DB
	once sync.Once
)

func GetConnection(config *config.Config) *sql.DB {
	once.Do(func() {
		var err error
		connectionData := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
			config.Database.Host, config.Database.Port, config.Database.User, config.Database.Password, config.Database.DbName, config.Database.SslMode)

		db, err = sql.Open("postgres", connectionData)
		if err != nil {
			log.Fatal("Ошибка подключения к базе данных:", err)
		}
	})

	return db
}
