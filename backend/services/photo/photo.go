package photo

import (
	"database/sql"
	"mime/multipart"
	pModel "photographer-app/models/photo"
	"photographer-app/models/yandex"
	"strings"
)

type PhotoService struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
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
			Main:     photo.Main,
			Head:     photo.Head,
		}

		err := photoData.Update(ps.DB)

		if err != nil {
			return err
		}
	}

	return nil
}

func (ps *PhotoService) Delete(photo *pModel.Photo) error {
	photoName, err := photo.GetNameById(ps.DB)
	if err != nil {
		return err
	}

	photo.Name = photoName
	folderName, err := photo.GetFolderNameById(ps.DB)
	photoCompressedName := getCompressedPhotoName(photo.Name)

	if err != nil {
		return err
	}

	photoPath := []string{"photosession/" + folderName + "/" + photo.Name,
		"photosession/" + folderName + "/" + photoCompressedName}

	err = photo.Delete(ps.DB)

	if err != nil {
		return err
	}

	ps.Yandex.DeletePhotos(ps.Yandex.Bucket, photoPath)

	return nil
}

func getCompressedPhotoName(photoName string) string {
	resultSlice := strings.Split(photoName, ".")
	processedResultSlice := append(resultSlice[:len(resultSlice)-1], resultSlice[len(resultSlice):]...)
	result := ""
	for index, processedString := range processedResultSlice {
		if index == 0 {
			result = result + processedString
		} else {
			result = result + "." + processedString
		}

	}

	return result + "_compressed.webp"
}
