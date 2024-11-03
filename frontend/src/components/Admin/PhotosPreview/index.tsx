import React from 'react';
import {Text} from '@shared';
import './PhotosPreview.scss';

interface PhotoObject {
  file: File;
  url: string;
}

interface PhotosPreviewProps {
  photos: PhotoObject[];
  setPhotos: (photos: PhotoObject[]) => void;
}

const PhotosPreview: React.FC<PhotosPreviewProps> = ({photos, setPhotos}) => {
  const dragPhotoRef = React.useRef<HTMLImageElement | null>(null);

  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('index', index.toString());

    if (dragPhotoRef.current) {
      dragPhotoRef.current.src = photos[index]?.url || '';
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

  return (
    <div className={'PhotosPreviewWrapper'}>
      {photos.map((photoObj, index) => (
        <div
          className={'PhotosPreviewImageWrapper'}
          key={index}
          draggable
          onDragStart={(event) => dragStartHandler(event, index)}
          onDrop={(event) => dropHandler(event, index)}
          onDragOver={dragOverHandler}
        >
          <div className={'PhotosPreviewImageNumber'}>
            <Text text={index} />
          </div>
          <img src={photoObj.url} alt={`Uploaded preview ${index}`} />
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

export default PhotosPreview;
