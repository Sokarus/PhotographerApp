package photosession

import (
	"database/sql"
	"errors"
	"log"
	"mime/multipart"
	"photographer-app/models/photo"
	psModel "photographer-app/models/photosession"
	"photographer-app/models/yandex"
	"sync"
)

type PhotosessionService struct {
	DB     *sql.DB
	Yandex *yandex.Yandex
}

func (ps *PhotosessionService) UploadPhotosToYandex(photos, photosConverted []*multipart.FileHeader, path string) error {
	var wg sync.WaitGroup
	var uploadErr error
	var mu sync.Mutex

	upload := func(photo *multipart.FileHeader, subPath string) {
		defer wg.Done()

		err := ps.Yandex.UploadPhoto(photo, subPath)
		if err != nil {
			log.Println("Upload image to Yandex error:", err)
			mu.Lock()
			if uploadErr == nil {
				uploadErr = err
			}
			mu.Unlock()
		}
	}

	for _, photo := range photos {
		wg.Add(1)
		go upload(photo, "photosession/"+path+"/")
	}
	for _, photo := range photosConverted {
		wg.Add(1)
		go upload(photo, "photosession/"+path+"/")
	}

	wg.Wait()

	if uploadErr != nil {
		return errors.New("upload image to Yandex error")
	}

	return nil
}

func (ps *PhotosessionService) CheckUnique(folderName string) bool {
	id := psModel.GetIdByFolderName(ps.DB, folderName)

	return id > 0 || id == -1
}

func (ps *PhotosessionService) MaxPosition(db *sql.DB) (int, error) {
	return psModel.GetMaxPosition(ps.DB)
}

func (ps *PhotosessionService) CreatePhotosession(title, folderName string, maxPosition int) (int, error) {
	photosession := psModel.Photosession{
		Title:      title,
		FolderName: folderName,
		Position:   maxPosition + 1,
		Public:     false,
		Type:       "portfolio",
	}

	photosessionId, err := photosession.Create(ps.DB)

	if err != nil {
		return 0, errors.New("create photosession error")
	}

	return photosessionId, nil
}

func (ps *PhotosessionService) List() ([]psModel.Photosession, error) {
	pList, err := psModel.GetList(ps.DB)

	if err != nil {
		return nil, err
	}

	for index, p := range pList {
		photos, err := photo.GetListByPhotosessionId(ps.DB, p.ID)

		if err != nil {
			return nil, err
		}

		pList[index].Photos = photos
	}

	return pList, nil
}

func (ps *PhotosessionService) Portfolio() ([]psModel.PortfolioPhotosession, error) {
	portfolioPhotosessions, err := psModel.GetPortfolio(ps.DB)

	if err != nil {
		return nil, err
	}

	for index, p := range portfolioPhotosessions {
		mainPhoto, err := photo.GetMainPhoto(ps.DB, p.ID)

		if err != nil {
			return nil, err
		}

		portfolioPhotosessions[index].MainPhoto = mainPhoto
	}

	return portfolioPhotosessions, nil
}

func (ps *PhotosessionService) UpdatePhotosession(photosession *psModel.Photosession) error {
	return photosession.Save(ps.DB)
}

func (ps *PhotosessionService) GetPhotosession(folderName string) (*psModel.Photosession, error) {
	photosession, err := psModel.GetByFolderName(ps.DB, folderName)

	if err != nil {
		return nil, err
	}

	photos, err := photo.GetListByPhotosessionId(ps.DB, photosession.ID)

	if err != nil {
		return nil, err
	}

	photosession.Photos = photos

	return &photosession, nil
}
