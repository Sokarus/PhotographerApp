import React from 'react';
import {toast} from 'react-toastify';
import {Modal, InputText, Text, InputImage, Button} from '@shared';
import {BaseModal} from '@type/modal';
import {ColorTheme} from '@constant/style';
import {Create} from '@api/Photosession';
import {Pending} from '@components';
import './CreatePhotosessionModal.scss';

interface ICreatePhotosessionModal extends BaseModal {}

interface PhotoObject {
  file: File;
  url: string;
}

const CreatePhotosessionModal: React.FC<ICreatePhotosessionModal> = ({isOpened, onClose}) => {
  const [title, setTitle] = React.useState<string>('');
  const [photos, setPhotos] = React.useState<PhotoObject[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const dragPhotoRef = React.useRef<HTMLImageElement | null>(null);

  const createHandler = React.useCallback(async () => {
    if (title.length < 3) {
      toast.warning('Название должо быть больше 2-х символов');
      return;
    }
    if (!photos.length) {
      toast.warning('Нужно загрузить хотя бы 1 фото!');
      return;
    }

    try {
      const imagesFiles: File[] = photos.map((photoObject) => photoObject.file);
      setIsPending(true);
      await Create(title, imagesFiles);
      toast.success('Фотосессия успешно создана!');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsPending(false);
      onClose();
    }
  }, [title, photos]);

  const photoUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setPhotos((prevPhotos) => [...(prevPhotos || []), ...newPhotos]);
    }
  };

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
    <>
      <Modal isOpened={isOpened} title={'Создать фотосессию'} onClose={onClose} backgroundBlur={1} fullWindow>
        <div className={'CreatePhotosessionModalWrapper'}>
          <div className={'CreatePhotosessionModalInput'}>
            <Text text={'Название фотосессии'} color={ColorTheme.white} size={'large'} />
            <InputText
              text={title}
              type={'text'}
              color={ColorTheme.white}
              placeholder={'Введите название фотосессии'}
              setText={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
            />
          </div>
          <div className={'CreatePhotosessionModalInput'}>
            <InputImage setImages={photoUploadHandler} />
          </div>
          <div className={'CreatePhotosessionModalPreviewWrapper'}>
            {photos.map((photoObj, index) => (
              <div
                className={'CreatePhotosessionModalPreviewImageWrapper'}
                key={index}
                draggable
                onDragStart={(event) => dragStartHandler(event, index)}
                onDrop={(event) => dropHandler(event, index)}
                onDragOver={dragOverHandler}
              >
                <div className={'CreatePhotosessionModalPreviewImageNumber'}>
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
          <Button onClick={createHandler}>
            <Text text={'Создать'} color={ColorTheme.white} size={'large'} />
          </Button>
        </div>
      </Modal>
      <Pending isPending={isPending} />
    </>
  );
};

export default CreatePhotosessionModal;
