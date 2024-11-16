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
	PhotosessionId int    `json:"photosessionId"`
	CreatedAt      string `json:"createdAt"`
	UpdatedAt      string `json:"updatedAt"`
	Main           bool   `json:"main"`
}

func (p *Photo) Create(db *sql.DB) error {
	query := `insert into photos (name, position, public, photosession_id)
		values ($1, $2, $3, $4)`
	_, err := db.Exec(query, p.Name, p.Position, p.Public, p.PhotosessionId)

	if err != nil {
		log.Println("Insert new photo error:", err)
		return errors.New("db request error")
	}

	return nil
}

func (p *Photo) Update(db *sql.DB) error {
	query := `
		update photos
		set (position, public, main, updated_at) = ($1, $2, $3, now())
		where id = $4`
	_, err := db.Exec(query, p.Position, p.Public, p.Main, p.ID)

	if err != nil {
		log.Println("Update photo error:", err)
		return errors.New("db request error")
	}

	return nil
}

func GetListByPhotosessionId(db *sql.DB, photosessionId int, public bool) ([]*Photo, error) {
	query := `
		select id, name, position, public, photosession_id, created_at, updated_at, main
		from photos
		where photosession_id = $1
		and public = $2
		order by position asc`
	rows, err := db.Query(query, photosessionId, public)

	if err != nil {
		log.Println("Db get photos by photosession id error:", err)
		return nil, errors.New("db request error")
	}
	defer rows.Close()

	var list []*Photo
	for rows.Next() {
		p := Photo{}

		if err := rows.Scan(&p.ID, &p.Name, &p.Position, &p.Public, &p.PhotosessionId, &p.CreatedAt, &p.UpdatedAt, &p.Main); err != nil {
			log.Println("Db scan photos by photosession id error:", err)
			return nil, errors.New("db scan error")
		}

		list = append(list, &p)
	}

	return list, nil
}

func GetMainPhoto(db *sql.DB, photosessionId int) (string, error) {
	var name sql.NullString
	query := `
		select name
		from photos
		where photosession_id = $1
		order by main desc, position asc
		limit 1`
	err := db.QueryRow(query, photosessionId).Scan(&name)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		} else {
			log.Println("Db get main photo error:", err)
			return "", errors.New("db request error")
		}
	}

	return string(name.String), nil
}
