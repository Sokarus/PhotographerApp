package main

import (
	"net/http"
	"photographer-app/routes"
)

func main() {
	routes := routes.InitRouter()
	http.ListenAndServe(":8080", routes)
}
