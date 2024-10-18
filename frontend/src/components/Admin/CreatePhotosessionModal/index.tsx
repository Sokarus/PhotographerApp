import React from 'react';
import {Modal, InputText, Text, Button, InputImage} from '@shared';
import {BaseModal} from '@type/modal';
import './CreatePhotosessionModal.scss';

interface ICreatePhotosessionModal extends BaseModal {}

interface ImageObject {
  file: File;
  url: string;
}

const CreatePhotosessionModal: React.FC<ICreatePhotosessionModal> = ({isOpened, onClose}) => {
  const [title, setTitle] = React.useState<string>('');
  const [images, setImages] = React.useState<ImageObject[]>();
  const dragImageRef = React.useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...(prevImages || []), ...newImages]);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('index', index.toString());

    if (dragImageRef.current) {
      dragImageRef.current.src = images?.[index].url || '';
      event.dataTransfer.setDragImage(dragImageRef.current, 50, 50);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    const draggedIndex = event.dataTransfer.getData('index');
    if (draggedIndex === undefined) return;

    const newImages = [...(images || [])];
    const [draggedItem] = newImages.splice(parseInt(draggedIndex, 10), 1);
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Modal isOpened={isOpened} title={'Создать фотосессию'} onClose={onClose}>
      <div className={'CreatePhotosessionModalWrapper'}>
        <div className={'CreatePhotosessionModalInput'}>
          <Text text={'Название фотосессии'} />
          <InputText
            text={title}
            type={'text'}
            setText={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
          />
        </div>
        <div className={'CreatePhotosessionModalInput'}>
          <Text text={'Загрузить фото'} />
          <InputImage setImages={handleImageUpload} />
        </div>
        <div className={'CreatePhotosessionModalPreviewWrapper'}>
          {images?.map((imageObj, index) => (
            <div
              className={'CreatePhotosessionModalPreviewImageWrapper'}
              key={index}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDrop={(event) => handleDrop(event, index)}
              onDragOver={handleDragOver}
            >
              <div className={'CreatePhotosessionModalPreviewImageNumber'}>
                <Text text={index} />
              </div>
              <img src={imageObj.url} alt={`Uploaded preview ${index}`} />
              <img
                ref={dragImageRef}
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
    </Modal>
  );
};

export default CreatePhotosessionModal;
