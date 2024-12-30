package photosessionType

import (
	"database/sql"
	"errors"
	"log"
)

type PhotosessionType struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Mnemonic    string `json:"mnemonic"`
	PhotoName   string `json:"photoName"`
	Description string `json:"description"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

func (pt *PhotosessionType) Create(db *sql.DB) error {
	var id int
	query := "insert into photosession_types (title, mnemonic, photo_name, description) values ($1, $2, $3, $4) returning id"
	err := db.QueryRow(query, pt.Title, pt.Mnemonic, pt.PhotoName, pt.Description).Scan(&id)

	if err != nil {
		log.Println("Insert new photosession type error:", err)
		return errors.New("db request error")
	}

	return nil
}

func GetIdByMnemonic(db *sql.DB, mnemonic string) int {
	var id sql.NullInt64
	query := "select id from photosession_types where mnemonic = $1"

	err := db.QueryRow(query, mnemonic).Scan(&id)

	if err != nil {
		log.Println("Db get id by mnemonic error:", err)
		return -1
	}
	if !id.Valid {
		return 0
	}

	return int(id.Int64)
}
