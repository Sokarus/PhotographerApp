import React from 'react';
import {Text, Button, ImageButton} from '@shared';
import {Photo} from '@type/photo';
import {PhotoWebpUrl, IconUrl} from '@utils/photo';
import Actions from './Actions';
import './PhotosEdit.scss';

interface PhotosEditProps {
  folderName: string;
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  needHead: boolean;
  initPhotos: Photo[];
}

const PhotosEdit: React.FC<PhotosEditProps> = ({folderName, photos, setPhotos, needHead, initPhotos}) => {
  const dragPhotoRef = React.useRef<HTMLImageElement | null>(null);

  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('index', index.toString());

    if (dragPhotoRef.current) {
      dragPhotoRef.current.src = PhotoWebpUrl(folderName, photos[index].name);
      event.dataTransfer.setDragImage(dragPhotoRef.current, 50, 50);
    }
  };

  const dropHandler = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    const draggedIndex = event.dataTransfer.getData('index');
    if (draggedIndex === undefined) return;

    const newPhotos = [...photos];
    const [draggedItem] = newPhotos.splice(parseInt(draggedIndex, 10), 1);
    newPhotos.splice(index, 0, draggedItem);

    setPhotos(newPhotos);
  };

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const publishHandler = React.useCallback(
    (photoIndex: number, publish: boolean) => {
      setPhotos(
        photos.map((photo, i) =>
          i === photoIndex
            ? {
                ...photo,
                public: publish,
                main: publish ? photo.main : false,
                head: publish ? photo.head : false,
              }
            : photo
        )
      );
    },
    [folderName, photos]
  );

  const mainHandler = React.useCallback(
    (photoIndex: number, main: boolean) => {
      setPhotos(
        photos.map((photo, i) =>
          i === photoIndex ? {...photo, main: main, public: true} : {...photo, main: false}
        )
      );
    },
    [folderName, photos]
  );

  const headHandler = React.useCallback(
    (photoIndex: number, head: boolean) => {
      setPhotos(
        photos.map((photo, i) =>
          i === photoIndex ? {...photo, head: head, public: true} : {...photo, head: false}
        )
      );
    },
    [folderName, photos]
  );

  React.useEffect(() => {
    if (!needHead) {
      setPhotos(
        photos.map((photo) => {
          return {...photo, head: false};
        })
      );
    }
  }, [needHead]);

  const publishAllHandler = React.useCallback(() => {
    const isPublic = photos.find((photo) => !photo.public);

    setPhotos(
      photos.map((photo) => {
        return {
          ...photo,
          public: !!isPublic,
          main: photo.main,
          head: photo.head,
        };
      })
    );
  }, [photos]);

  return (
    <div className={'PhotosEditWrapper'}>
      <div className={'PhotosEditActions'}>
        <Button onClick={publishAllHandler}>
          <Text text={'Опубликовать все фото'} size={'large'} color={'white'} />
        </Button>
      </div>
      <div className={'PhotosEditItems'}>
        {photos.map((photo, index) => (
          <div
            className={'PhotosEditImageWrapper'}
            key={index}
            draggable
            onDragStart={(event) => dragStartHandler(event, index)}
            onDrop={(event) => dropHandler(event, index)}
            onDragOver={dragOverHandler}
          >
            <div className={'PhotosEditImageNumber'}>
              <Text text={index} />
            </div>
            <img
              className={'PhotosEditImagePreview'}
              src={PhotoWebpUrl(folderName, photo.name)}
              alt={`Uploaded preview ${index}`}
            />
            <Actions
              photo={photo}
              index={index}
              needHead={needHead}
              publishHandler={publishHandler}
              mainHandler={mainHandler}
              headHandler={headHandler}
              initPhotos={initPhotos}
            />
            <img
              ref={dragPhotoRef}
              src={''}
              alt={'drag preview'}
              style={{
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosEdit;
