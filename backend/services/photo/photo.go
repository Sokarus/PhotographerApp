package photo

import (
	"database/sql"
	"mime/multipart"
	pModel "photographer-app/models/photo"
)

type PhotoService struct {
	DB *sql.DB
}

func (ps *PhotoService) CreatePhotos(photos []*multipart.FileHeader, photosessionId int) error {
	for index, photo := range photos {
		photoData := pModel.Photo{
			Name:           photo.Filename,
			Position:       index,
			Public:         false,
			PhotosessionId: photosessionId,
		}

		err := photoData.Create(ps.DB)

		if err != nil {
			return err
		}
	}

	return nil
}

func (ps *PhotoService) UpdatePhotos(photos []*pModel.Photo) error {
	for index, photo := range photos {
		photoData := pModel.Photo{
			ID:       photo.ID,
			Position: index,
			Public:   photo.Public,
		}

		err := photoData.Update(ps.DB)

		if err != nil {
			return err
		}
	}

	return nil
}
