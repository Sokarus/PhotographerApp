import React from 'react';
import {toast} from 'react-toastify';
import {BaseModal} from '@type/modal';
import {Photosession} from '@type/photosession';
import {Modal, Select, Button, Text, Toggle, InputText, ImageButton, InputDate} from '@shared';
import {PhotosessionsList} from '@api/Photosession';
import {Photo} from '@type/photo';
import {ColorTheme} from '@constant/style';
import {Save} from '@api/Photosession';
import {Pending} from '@components';
import {IconUrl} from '@utils/photo';
import {CurrentDate, GetDateBeforeDays, FormatDate} from '@utils/date';
import PhotosEdit from '../PhotosEdit';
import './EditPhotosessionModal.scss';

interface EditPhotosessionNodalParams extends BaseModal {}

const EditPhotosessionModal: React.FC<EditPhotosessionNodalParams> = ({isOpened, onClose}) => {
  const [list, setList] = React.useState<Photosession[]>([]);
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [currentPhotosession, setCurrentPhotosession] = React.useState<Photosession>();
  const [isPublish, setIsPublish] = React.useState<boolean>(false);
  const [isClient, setIsClient] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('');

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
      setPhotos([...currentPhotosession.photos] || []);
      setIsPublish(currentPhotosession.public);
      setIsClient(currentPhotosession.type === 'client');
      setTitle(currentPhotosession.title);
      setDate(FormatDate(currentPhotosession.date));
    },
    [list]
  );

  const saveHandler = React.useCallback(async () => {
    if (!currentPhotosession) {
      return;
    }

    currentPhotosession.photos = photos;
    currentPhotosession.public = isPublish;
    currentPhotosession.type = isClient ? 'client' : 'portfolio';
    currentPhotosession.title = title;
    currentPhotosession.date = date;

    if (currentPhotosession.type === 'client') {
      if (!currentPhotosession.date || currentPhotosession.date === '1970-01-01') {
        toast.error('Нужно выбрать дату!');
        return;
      }

      if (!photos.filter((photo) => photo.head)) {
        toast.error('Нужно выбрать титульное фото!');
        return;
      }
      if (!photos.filter((photo) => photo.main)) {
        toast.error('Нужно выбрать вертикальное фото для портфолио и телефона!');
        return;
      }
    }

    try {
      await Save(currentPhotosession);
      toast.success('Фотосессия успешно сохранена!');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPhotos([]);
      setIsPublish(false);
      setIsClient(false);
      setTitle('');
      setCurrentPhotosession(undefined);
      setDate('');
      onClose();
    }
  }, [photos, currentPhotosession, isPublish, isClient, title, onClose, date]);

  const copyClientLinkHandler = React.useCallback(() => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.hostname}/client/photosession?name=${currentPhotosession?.folderName}`
    );
    toast.success('Ссылка на фотосессию скопирована!');
  }, [currentPhotosession]);

  React.useEffect(() => {
    if (!isClient) {
      setDate('');
    }
  }, [isClient, setDate]);

  return (
    <>
      <Modal
        title={'Редактировать фотосессию'}
        isOpened={isOpened}
        onClose={onClose}
        backgroundBlur={1}
        fullWindow
        onPressEnter={saveHandler}
      >
        <div className={'EditPhotosessionModalWrapper'}>
          <Select
            options={titles()}
            setOption={(event) => choosePhotosessionHandler(event.target.value)}
            current={currentPhotosession?.title}
          />
          {!!photos.length ? (
            <>
              <div className={'EditPhotosessionModalInput'}>
                <Text text={'Название фотосессии'} color={ColorTheme.white} size={'large'} />
                <InputText
                  text={title}
                  type={'text'}
                  color={ColorTheme.white}
                  placeholder={currentPhotosession?.title}
                  setText={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(event.target.value)
                  }
                />
              </div>
              <div className={'EditPhotosessionModalToggle'}>
                <Text text={'Опубликовать'} color={ColorTheme.white} />
                <Toggle on={isPublish} onClick={() => setIsPublish(!isPublish)} />
              </div>
              <div className={'EditPhotosessionModalToggle'}>
                <Text text={'Клиентская'} color={ColorTheme.white} />
                <Toggle on={isClient} onClick={() => setIsClient(!isClient)} />
              </div>
              {isClient ? (
                <>
                  <div className={'EditPhotosessionModalClientLink'}>
                    <Text
                      text={`${window.location.protocol}//${window.location.hostname}/client/photosession?name=${currentPhotosession?.folderName}`}
                      color={ColorTheme.white}
                    />
                    <ImageButton
                      url={IconUrl('copy')}
                      alt={'copy'}
                      onClick={copyClientLinkHandler}
                    />
                  </div>
                  <InputDate
                    date={date}
                    setDate={setDate}
                    minDate={GetDateBeforeDays(30)}
                    maxDate={CurrentDate()}
                  />
                </>
              ) : (
                <></>
              )}
              <PhotosEdit
                folderName={currentPhotosession?.folderName || ''}
                photos={photos}
                setPhotos={setPhotos}
                needHead={isClient}
                initPhotos={currentPhotosession?.photos || []}
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
      {isPending && <Pending />}
    </>
  );
};

export default EditPhotosessionModal;
