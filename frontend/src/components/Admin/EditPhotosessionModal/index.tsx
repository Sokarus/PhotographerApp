import React from 'react';
import {toast} from 'react-toastify';
import {BaseModal} from '@type/modal';
import {Photosession} from '@type/photosession';
import {Modal, Select, Button, Text, Toggle} from '@shared';
import {PhotosessionsList} from '@api/Photosession';
import {Photo} from '@type/photo';
import {ColorTheme} from '@constant/style';
import {Save} from '@api/Photosession';
import {Pending} from '@components';
import PhotosEdit from '../PhotosEdit';
import './EditPhotosessionModal.scss';

interface EditPhotosessionNodalParams extends BaseModal {}

const EditPhotosessionModal: React.FC<EditPhotosessionNodalParams> = ({isOpened, onClose}) => {
  const [list, setList] = React.useState<Photosession[]>([]);
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [currentPhotosession, setCurrentPhotosession] = React.useState<Photosession>();
  const [isPublish, setIsPublish] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    setIsPending(true);
    PhotosessionsList()
      .then((list) => {
        setList(list);
      })
      .catch((error) => {
        toast.error((error as Error).message);
      })
      .finally(() => {
        setIsPending(false);
      });
  }, [isOpened]);

  const titles = React.useCallback(() => list?.map((photosession) => photosession.title), [list]);
  const choosePhotosessionHandler = React.useCallback(
    (title: string) => {
      const currentPhotosession = list.find((photosession) => photosession.title === title);

      if (!currentPhotosession) {
        setCurrentPhotosession(undefined);
        setPhotos([]);
        return;
      }

      setCurrentPhotosession(currentPhotosession);
      setPhotos(currentPhotosession.photos);
      setIsPublish(currentPhotosession.public);
    },
    [list]
  );

  const saveHandler = React.useCallback(async () => {
    if (!currentPhotosession) {
      return;
    }

    currentPhotosession.photos = photos;
    currentPhotosession.public = isPublish;

    try {
      await Save(currentPhotosession);
      toast.success('Фотосессия успешно сохранена!');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPhotos([]);
      setIsPublish(false);
      onClose();
    }
  }, [photos]);

  const setPhotoPublish = React.useCallback(
    (photoIndex: number, publish: boolean) => {
      if (!currentPhotosession) {
        return;
      }

      currentPhotosession.photos[photoIndex].public = publish;
    },
    [currentPhotosession]
  );

  return (
    <>
      <Modal
        title={'Редактировать фотосессию'}
        isOpened={isOpened}
        onClose={onClose}
        backgroundBlur={1}
        fullWindow
      >
        <div className={'EditPhotosessionModalWrapper'}>
          <Select
            options={titles()}
            setOption={(event) => choosePhotosessionHandler(event.target.value)}
            current={currentPhotosession?.title}
          />
          {!!photos.length ? (
            <>
              <div className={'EditPhotosessionModalPublishToggle'}>
                <Text text={'Опубликовать'} color={ColorTheme.white} />
                <Toggle on={isPublish} onClick={() => setIsPublish(!isPublish)} />
              </div>
              <PhotosEdit
                folderName={currentPhotosession?.folderName || ''}
                photos={photos}
                setPhotos={setPhotos}
                setPublishHandler={setPhotoPublish}
              />
              <Button onClick={saveHandler}>
                <Text text={'Сохранить'} color={ColorTheme.white} size={'large'} />
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </Modal>
      <Pending isPending={isPending} />
    </>
  );
};

export default EditPhotosessionModal;
