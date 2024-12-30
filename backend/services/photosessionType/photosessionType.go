package photosessionType

import (
	"database/sql"
	"errors"
	"mime/multipart"
	pstModel "photographer-app/models/photosessionType"
	"photographer-app/models/yandex"
)

type PhotosessionTypeService struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
}

func (pst *PhotosessionTypeService) UploadPhotoToYandex(photo *multipart.FileHeader) error {
	err := pst.Yandex.UploadPhoto(photo, "photosession-type/")

	if err != nil {
		return errors.New("upload image to Yandex error")
	}

	return nil
}

func (pst *PhotosessionTypeService) CreatePhotosessionType(title, mnemonic, photoName, description string) error {
	photosessionType := pstModel.PhotosessionType{
		Title:       title,
		Mnemonic:    mnemonic,
		PhotoName:   photoName,
		Description: description,
	}

	err := photosessionType.Create(pst.DB)

	if err != nil {
		return errors.New("create photosession type error")
	}

	return nil
}

func (pst *PhotosessionTypeService) CheckUnique(mnemonic string) bool {
	id := pstModel.GetIdByMnemonic(pst.DB, mnemonic)

	return id > 0 || id == -1
}
