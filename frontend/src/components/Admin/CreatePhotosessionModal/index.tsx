import React from 'react';
import {toast} from 'react-toastify';
import {v4 as uuidv4} from 'uuid';
import {Modal, InputText, Text, InputImage, Button} from '@shared';
import {BaseModal} from '@type/modal';
import {ColorTheme} from '@constant/style';
import {Create} from '@api/Photosession';
import {Pending} from '@components';
import {PhotoObject} from '@type/photo';
import {GetPhotoExtention} from '@utils/photo';
import PhotosPreview from '../PhotosPreview';
import './CreatePhotosessionModal.scss';

interface ICreatePhotosessionModal extends BaseModal {}

const CreatePhotosessionModal: React.FC<ICreatePhotosessionModal> = ({isOpened, onClose}) => {
  const [title, setTitle] = React.useState<string>('');
  const [photos, setPhotos] = React.useState<PhotoObject[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const reset = React.useCallback(() => {
    setIsPending(false);
    setPhotos([]);
    setTitle('');
    onClose();
  }, []);

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
      await Create(title, imagesFiles).then(() => {
        toast.success('Фотосессия успешно создана!');
        reset();
      });
    } catch (error) {
      toast.error((error as Error).message);
      reset();
    }
  }, [title, photos, onClose]);

  const photoUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => {
        const newPhotoName = uuidv4() + '.' + GetPhotoExtention(file.name);
        const renamedFile = new File([file], newPhotoName, {
          type: file.type,
        });

        return {
          file: renamedFile,
          url: URL.createObjectURL(file),
        };
      });
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
        onPressEnter={createHandler}
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
      {isPending && <Pending />}
    </>
  );
};

export default CreatePhotosessionModal;
