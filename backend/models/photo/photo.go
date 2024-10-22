package photo

import (
	"database/sql"
	"errors"
	"log"
)

type Photo struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Position       int    `json:"position"`
	Public         bool   `json:"public"`
	PhotosessionId int    `json:"photosession_id"`
	CreatedAt      string `json:"created_at"`
	UpdatedAt      string `json:"updated_at"`
}

func (p *Photo) Create(db *sql.DB) error {
	query := "insert into photos (name, position, public, photosession_id) values ($1, $2, $3, $4)"
	_, err := db.Exec(query, p.Name, p.Position, p.Public, p.PhotosessionId)

	if err != nil {
		log.Println("Insert new photo error:", err)
		return errors.New("db request error")
	}

	return nil
}
