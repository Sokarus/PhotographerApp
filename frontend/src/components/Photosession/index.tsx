import React from 'react';
import {toast} from 'react-toastify';
import {Photo} from 'react-photo-album';
import {Photosession as PhotosessionType} from '@type/photosession';
import {Get} from '@api/Photosession';
import {Gallery, PhotoView} from '@shared';
import {PhotoWebpUrl, PhotoOriginalUrl} from '@utils/photo';
import {FormatDate} from '@utils/date';
import {Header} from 'components/Header';
import HeadPhoto from './HeadPhoto';
import Actions from './Actions';
import './Photosession.scss';

const Photosession: React.FC = () => {
  const [photosession, setPhotosession] = React.useState<PhotosessionType>();
  const [loadedPhotos, setLoadedPhotos] = React.useState<Photo[]>([]);
  const [photoViewUrl, setPhotoViewUrl] = React.useState<string>('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState<number>(0);
  const queryParameters = new URLSearchParams(window.location.search);
  const name = queryParameters.get('name');
  const type = window.location.pathname.split('/')?.[1];

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
    if (!photosession || !photosession.photos) {
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

      const photo = photosession.photos?.[photoEvent.index];

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

      const photo = photosession.photos?.[currentPhotoIndex + step];

      if (!photo) {
        return;
      }

      setPhotoViewUrl(PhotoOriginalUrl(photosession.folderName, photo.name));
      setCurrentPhotoIndex(currentPhotoIndex + step);
    },
    [photosession, currentPhotoIndex]
  );

  const findHeadPhoto = React.useCallback(() => {
    return photosession?.photos?.find((photo) => photo.head);
  }, [photosession]);
  const headPhoto = findHeadPhoto();

  return (
    <>
      <PhotoView
        url={photoViewUrl}
        onClose={() => setPhotoViewUrl('')}
        onLeftClick={() => onPhotoViewChangeHandler('left')}
        onRightClick={() => onPhotoViewChangeHandler('right')}
      />
      <Header color={'white'} />
      {photosession && type === 'client' && headPhoto ? (
        <>
          <HeadPhoto
            photo={headPhoto}
            folderName={photosession.folderName}
            title={photosession.title}
            date={FormatDate(photosession.date)}
          />
          <Actions photos={photosession.photos} folderName={photosession.folderName} />
        </>
      ) : (
        <></>
      )}
      <div className={'PhotosessionWrapper'}>
        <div className={'PhotosessionContent'}>
          <Gallery photos={loadedPhotos} onClick={choosePhotoHandler} />
        </div>
      </div>
    </>
  );
};

export {Photosession};
