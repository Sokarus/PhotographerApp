import React from 'react';
import {toast} from 'react-toastify';
import {Photo} from 'react-photo-album';
import {Photosession as PhotosessionType} from '@type/photosession';
import {Get} from '@api/Photosession';
import {Gallery, PhotoView} from '@shared';
import {PhotoWebpUrl} from '@utils/photo';
import {FormatDate} from '@utils/date';
import {Header, Pending} from '@components';
import {Photo as PhotoType} from '@type/photo';
import HeadPhoto from './HeadPhoto';
import Actions from './Actions';
import './Photosession.scss';

const Photosession: React.FC = () => {
  const [photosession, setPhotosession] = React.useState<PhotosessionType>();
  const [loadedPhotos, setLoadedPhotos] = React.useState<Photo[]>([]);
  const [photoView, setPhotoView] = React.useState<PhotoType>();
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
      return new Promise<{
        width: number;
        height: number;
        url: string;
        position: number;
        name: string;
      }>((resolve, reject) => {
        const img = new Image();
        const url = PhotoWebpUrl(photosession.folderName, photo.name);
        img.onload = () =>
          resolve({
            width: img.width,
            height: img.height,
            url,
            position: photo.position,
            name: photo.name,
          });
        img.onerror = reject;
        img.src = url;
      });
    });

    await Promise.all(photosPromises).then((photosData) => {
      photosData.sort((a, b) => a.position - b.position);

      setLoadedPhotos(
        photosData.map((photoData) => {
          return {
            src: photoData.url,
            width: photoData.width,
            height: photoData.height,
            title: photoData.name,
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

      setPhotoView(photo);
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

      setPhotoView(photo);
      setCurrentPhotoIndex(currentPhotoIndex + step);
    },
    [photosession, currentPhotoIndex]
  );

  const findHeadPhoto = React.useCallback(() => {
    return photosession?.photos?.find((photo) => photo.head);
  }, [photosession]);
  const headPhoto = findHeadPhoto();

  if (!photosession) {
    return <></>;
  }

  if (loadedPhotos?.length <= 0) {
    return (
      <>
        <Header color={'white'} />
        <Pending isPending={true} />
      </>
    );
  }

  return (
    <>
      {photoView ? (
        <PhotoView
          photo={photoView}
          onClose={() => setPhotoView(undefined)}
          onLeftClick={() => onPhotoViewChangeHandler('left')}
          onRightClick={() => onPhotoViewChangeHandler('right')}
          folderName={photosession.folderName}
          needActions={type === 'client'}
        />
      ) : (
        <></>
      )}
      <Header color={'white'} />
      {type === 'client' && headPhoto ? (
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
          <Gallery
            photoFolder={photosession.folderName}
            photos={loadedPhotos}
            onClick={choosePhotoHandler}
            needActions={type === 'client'}
          />
        </div>
      </div>
    </>
  );
};

export {Photosession};
