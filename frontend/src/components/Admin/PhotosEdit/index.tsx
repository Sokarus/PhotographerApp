import React from 'react';
import {Text, ImageButton} from '@shared';
import {Photo} from '@type/photo';
import {PhotoWebpUrl} from '@utils/photo';
import {Url} from '@constant/yandex';
import './PhotosEdit.scss';

interface PhotosEditProps {
  folderName: string;
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  setPublishHandler: (photoIndex: number, publish: boolean) => void;
}

const PhotosEdit: React.FC<PhotosEditProps> = ({
  folderName,
  photos,
  setPhotos,
  setPublishHandler,
}) => {
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
    isPublished ? `${Url}icons/published.svg` : `${Url}icons/unpublished.svg`;

  const publishHandler = React.useCallback(
    (photoIndex: number, publish: boolean) => {
      setPublishHandler(photoIndex, publish);
      photos[photoIndex].public = publish;
      setPhotos(photos.map((photo, i) => (i === photoIndex ? {...photo, public: publish} : photo)));
    },
    [folderName, photos]
  );

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
          <img className={'PhotosEditImagePreview'} src={PhotoWebpUrl(folderName, photo.name)} alt={`Uploaded preview ${index}`} />
          <div className={'PhotosEditImagePublish'}>
            <ImageButton
              url={publishImage(photo.public)}
              alt={'published'}
              onClick={() => publishHandler(index, !photo.public)}
            />
          </div>
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
