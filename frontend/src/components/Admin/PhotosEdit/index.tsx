import React from 'react';
import {Text, ImageButton} from '@shared';
import {Photo} from '@type/photo';
import {PhotoWebpUrl, IconUrl} from '@utils/photo';
import './PhotosEdit.scss';

interface PhotosEditProps {
  folderName: string;
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  needHead: boolean;
}

const PhotosEdit: React.FC<PhotosEditProps> = ({folderName, photos, setPhotos, needHead}) => {
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

  const publishImage = (isPublished: boolean) =>
    isPublished ? IconUrl('published') : IconUrl('unpublished');

  const mainImage = (isMain: boolean) => (isMain ? IconUrl('main') : IconUrl('not_main'));

  const headImage = (isHead: boolean) => (isHead ? IconUrl('head') : IconUrl('not_head'));

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

  return (
    <div className={'PhotosEditWrapper'}>
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
          <div className={'PhotosEditImagePublish'}>
            <ImageButton
              url={publishImage(photo.public)}
              alt={'published'}
              onClick={() => publishHandler(index, !photo.public)}
            />
          </div>
          <div className={'PhotosEditImageMain'}>
            <ImageButton
              url={mainImage(photo.main)}
              alt={'main'}
              onClick={() => mainHandler(index, !photo.main)}
            />
          </div>
          {needHead ? (
            <div className={'PhotosEditImageHead'}>
              <ImageButton
                url={headImage(photo.head)}
                alt={'head'}
                onClick={() => headHandler(index, !photo.head)}
              />
            </div>
          ) : (
            <></>
          )}
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
  );
};

export default PhotosEdit;
