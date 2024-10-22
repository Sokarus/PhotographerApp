package photosession

import (
	"database/sql"
	"errors"
	"log"
)

type Photosession struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	FolderName string `json:"folder_name"`
	Position   int    `json:"position"`
	Public     bool   `json:"public"`
	Type       string `json:"type"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

func (p *Photosession) Create(db *sql.DB) (int, error) {
	var id int
	query := "insert into photosessions (title, folder_name, position, public, type) values ($1, $2, $3, $4, $5) returning id"
	err := db.QueryRow(query, p.Title, p.FolderName, p.Position, p.Public, p.Type).Scan(&id)

	if err != nil {
		log.Println("Insert new photosession error:", err)
		return 0, errors.New("db request error")
	}

	return id, nil
}

func MaxPosition(db *sql.DB) (int, error) {
	var position sql.NullInt64
	query := "select max(position) from photosessions"
	err := db.QueryRow(query).Scan(&position)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		} else {
			log.Println("Db error:", err)
			return 0, errors.New("db request error")
		}
	}

	return int(position.Int64), nil
}

func CheckUnique(db *sql.DB, folderName string) bool {
	var id sql.NullInt64
	query := "select id from photosessions where folder_name = $1"
	db.QueryRow(query, folderName).Scan(&id)

	return !id.Valid
}
