package main

import (
	"log"
	"net/http"
	"os"
	"photographer-app/config"
	"photographer-app/db"
	"photographer-app/models/yandex"
	"photographer-app/routes"
)

func main() {
	config, err := config.LoadConfig()

	if err != nil {
		log.Fatalf("Configuration loading error: %v", err)
		os.Exit(1)
	}

	yandex := yandex.Yandex{
		Url:    config.S3Cloud.Url,
		Bucket: config.S3Cloud.Bucket,
		Region: config.S3Cloud.Region,
	}

	var jwtKey = []byte(config.Auth.JwtKey)
	db := db.GetConnection(config)
	defer db.Close()
	routes := routes.InitRouter(db, jwtKey, &yandex)
	http.ListenAndServe(":8080", routes)
}
