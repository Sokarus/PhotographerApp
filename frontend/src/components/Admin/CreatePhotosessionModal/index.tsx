import React from 'react';
import {toast} from 'react-toastify';
import {Modal, InputText, Text, InputImage, Button} from '@shared';
import {BaseModal} from '@type/modal';
import {ColorTheme} from '@constant/style';
import {Create} from '@api/Photosession';
import {Pending} from '@components';
import {PhotoObject} from '@type/photo';
import PhotosPreview from '../PhotosPreview';
import './CreatePhotosessionModal.scss';

interface ICreatePhotosessionModal extends BaseModal {}

const CreatePhotosessionModal: React.FC<ICreatePhotosessionModal> = ({isOpened, onClose}) => {
  const [title, setTitle] = React.useState<string>('');
  const [photos, setPhotos] = React.useState<PhotoObject[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);

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
      setPhotos([]);
      setTitle('');
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

  return (
    <>
      <Modal
        isOpened={isOpened}
        title={'Создать фотосессию'}
        onClose={onClose}
        backgroundBlur={1}
        fullWindow
      >
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
          <PhotosPreview photos={photos} setPhotos={setPhotos} />
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
