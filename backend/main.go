package main

import (
	"log"
	"net/http"
	"os"
	"photographer-app/config"
	"photographer-app/db"
	"photographer-app/routes"
)

func main() {
	config, err := config.LoadConfig()

	if err != nil {
		log.Fatalf("Configuration loading error: %v", err)
		os.Exit(1)
	}

	var jwtKey = []byte(config.Auth.JwtKey)
	db := db.GetConnection(config)
	defer db.Close()
	routes := routes.InitRouter(db, jwtKey)
	http.ListenAndServe(":8080", routes)
}
