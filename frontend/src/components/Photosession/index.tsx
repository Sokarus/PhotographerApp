import React from 'react';
import {toast} from 'react-toastify';
import {Photo} from 'react-photo-album';
import {Header} from '@components';
import {Photosession as PhotosessionType} from '@type/photosession';
import {Get} from '@api/Photosession';
import {Gallery, PhotoView} from '@shared';
import {PhotoWebpUrl, PhotoOriginalUrl} from '@utils/photo';
import './Photosession.scss';

const Photosession: React.FC = () => {
  const [photosession, setPhotosession] = React.useState<PhotosessionType>();
  const [loadedPhotos, setLoadedPhotos] = React.useState<Photo[]>([]);
  const [photoViewUrl, setPhotoViewUrl] = React.useState<string>('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState<number>(0);
  const queryParameters = new URLSearchParams(window.location.search);
  const name = queryParameters.get('name');

  React.useEffect(() => {
    if (!name) {
      return;
    }

    Get(name)
      .then((portfolioPhotosession) => setPhotosession(portfolioPhotosession))
      .catch((error) => {
        toast.error((error as Error).message);
      });
  }, [name]);

  const loadPhotos = React.useCallback(async () => {
    if (!photosession) {
      return [];
    }

    const photosPromises = photosession.photos?.map((photo) => {
      return new Promise<{width: number; height: number; url: string; position: number}>(
        (resolve, reject) => {
          const img = new Image();
          const url = PhotoWebpUrl(photosession.folderName, photo.name);
          img.onload = () =>
            resolve({width: img.width, height: img.height, url, position: photo.position});
          img.onerror = reject;
          img.src = url;
        }
      );
    });

    await Promise.all(photosPromises).then((photosData) => {
      photosData.sort((a, b) => a.position - b.position);

      setLoadedPhotos(
        photosData.map((photoData) => {
          return {
            src: photoData.url,
            width: photoData.width,
            height: photoData.height,
          };
        })
      );
    });
  }, [photosession]);

  React.useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const choosePhotoHandler = React.useCallback(
    (photoEvent: any) => {
      if (!photosession) {
        return;
      }

      const photo = photosession.photos?.find((photo) => photo.position === photoEvent.index);

      if (!photo) {
        return;
      }

      setPhotoViewUrl(PhotoOriginalUrl(photosession.folderName, photo.name));
      setCurrentPhotoIndex(photoEvent.index);
    },
    [photosession]
  );

  const onPhotoViewChangeHandler = React.useCallback(
    (side: string) => {
      const step = side === 'left' ? -1 : 1;

      if (!photosession) {
        return;
      }

      const photo = photosession.photos?.find(
        (photo) => photo.position === currentPhotoIndex + step
      );

      if (!photo) {
        return;
      }

      setPhotoViewUrl(PhotoOriginalUrl(photosession.folderName, photo.name));
      setCurrentPhotoIndex(currentPhotoIndex + step);
    },
    [photosession, currentPhotoIndex]
  );

  return (
    <>
      <Header color={'white'} />
      <PhotoView
        url={photoViewUrl}
        onClose={() => setPhotoViewUrl('')}
        onLeftClick={() => onPhotoViewChangeHandler('left')}
        onRightClick={() => onPhotoViewChangeHandler('right')}
      />
      <div className={'PhotosessionWrapper'}>
        <div className={'PhotosessionContent'}>
          <Gallery photos={loadedPhotos} onClick={choosePhotoHandler} />
        </div>
      </div>
    </>
  );
};

export {Photosession};
