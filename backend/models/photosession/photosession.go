package photosession

import (
	"database/sql"
	"errors"
	"log"

	"photographer-app/models/photo"
)

type Photosession struct {
	ID         int            `json:"id"`
	Title      string         `json:"title"`
	FolderName string         `json:"folderName"`
	Position   int            `json:"position"`
	Public     bool           `json:"public"`
	Type       string         `json:"type"`
	CreatedAt  string         `json:"createdAt"`
	UpdatedAt  string         `json:"updatedAt"`
	Photos     []*photo.Photo `json:"photos"`
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

func (p *Photosession) Save(db *sql.DB) error {
	query := "update photosessions set (title, position, public, type, updated_at) = ($1, $2, $3, $4, now()) where id = $5"

	_, err := db.Query(query, p.Title, p.Position, p.Public, p.Type, p.ID)

	if err != nil {
		log.Println("Update photosession error:", err)
		return errors.New("db request error")
	}

	return nil
}

func GetMaxPosition(db *sql.DB) (int, error) {
	var position sql.NullInt64
	query := "select max(position) from photosessions"
	err := db.QueryRow(query).Scan(&position)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		} else {
			log.Println("Db get max position error:", err)
			return 0, errors.New("db request error")
		}
	}

	return int(position.Int64), nil
}

func GetIdByFolderName(db *sql.DB, folderName string) int {
	var id sql.NullInt64
	query := "select id from photosessions where folder_name = $1"

	err := db.QueryRow(query, folderName).Scan(&id)

	if err != nil {
		log.Println("Db get id by folder name error:", err)
		return -1
	}
	if !id.Valid {
		return 0
	}

	return int(id.Int64)
}

func GetList(db *sql.DB) ([]Photosession, error) {
	query := "select id, title, folder_name, position, public, type, created_at, updated_at from photosessions"
	rows, err := db.Query(query)

	if err != nil {
		log.Println("db get photosessions list error:")
		return nil, errors.New("db request error")
	}
	defer rows.Close()

	var list []Photosession
	for rows.Next() {
		p := Photosession{}

		if err := rows.Scan(&p.ID, &p.Title, &p.FolderName, &p.Position, &p.Public, &p.Type, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, errors.New("db scan error")
		}

		list = append(list, p)
	}

	return list, nil
}
