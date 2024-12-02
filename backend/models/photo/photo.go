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
	Head           bool   `json:"head"`
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
		set (position, public, main, updated_at, head) = ($1, $2, $3, now(), $4)
		where id = $5`
	_, err := db.Exec(query, p.Position, p.Public, p.Main, p.Head, p.ID)

	if err != nil {
		log.Println("Update photo error:", err)
		return errors.New("db request error")
	}

	return nil
}

func (p *Photo) Delete(db *sql.DB) error {
	query := `
		delete from photos
		where id = $1
	`
	_, err := db.Exec(query, p.ID)

	if err != nil {
		log.Println("Delete photo error:", err)
		return errors.New("db request error")
	}

	return nil
}

func GetListByPhotosessionId(db *sql.DB, photosessionId int, public bool) ([]*Photo, error) {
	var query string
	var rows *sql.Rows
	var err error

	if public {
		query = `
			select id, name, position, public, photosession_id, created_at, updated_at, main, head
			from photos
			where photosession_id = $1
			and public = true
			order by position asc`
		rows, err = db.Query(query, photosessionId)
	} else {
		query = `
			select id, name, position, public, photosession_id, created_at, updated_at, main, head
			from photos
			where photosession_id = $1
			order by position asc`
		rows, err = db.Query(query, photosessionId)
	}

	if err != nil {
		log.Println("Db get photos by photosession id error:", err)
		return nil, errors.New("db request error")
	}
	defer rows.Close()

	var list []*Photo
	for rows.Next() {
		p := Photo{}

		if err := rows.Scan(&p.ID, &p.Name, &p.Position, &p.Public, &p.PhotosessionId, &p.CreatedAt, &p.UpdatedAt, &p.Main, &p.Head); err != nil {
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

func (p *Photo) GetFolderNameById(db *sql.DB) (string, error) {
	var folderName sql.NullString
	query := `
		select distinct folder_name
		from photosessions ps
		inner join photos p on p.photosession_id = ps.id
		where p.id = $1
	`
	err := db.QueryRow(query, p.ID).Scan(&folderName)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		} else {
			log.Println("Db get folder name by photo id error:", err)
			return "", errors.New("db request error")
		}
	}

	return folderName.String, nil
}

func (p *Photo) GetNameById(db *sql.DB) (string, error) {
	var name sql.NullString
	query := `
		select name
		from photos
		where id = $1
	`
	err := db.QueryRow(query, p.ID).Scan(&name)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		} else {
			log.Println("Db get name by photo id error:", err)
			return "", errors.New("db request error")
		}
	}

	return name.String, nil
}
