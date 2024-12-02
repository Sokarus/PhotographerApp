import React from 'react';
import {toast} from 'react-toastify';
import {ImageButton, Modal, Button, Text} from '@shared';
import {IconUrl} from '@utils/photo';
import {Photo} from '@type/photo';
import {Delete} from '@api/Photo';
import './Actions.scss';

interface ActionsProps {
  photo: Photo;
  index: number;
  needHead: boolean;
  publishHandler: (...args: any) => any;
  mainHandler: (...args: any) => any;
  headHandler: (...args: any) => any;
  initPhotos: Photo[];
}

const Actions: React.FC<ActionsProps> = ({
  photo,
  index,
  needHead,
  publishHandler,
  mainHandler,
  headHandler,
  initPhotos,
}) => {
  const [isActionsOpen, setIsActionsOpen] = React.useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

  const publishImage = (isPublished: boolean) =>
    isPublished ? IconUrl('published') : IconUrl('unpublished');
  const mainImage = (isMain: boolean) => (isMain ? IconUrl('main') : IconUrl('not_main'));
  const headImage = (isHead: boolean) => (isHead ? IconUrl('head') : IconUrl('not_head'));
  const deleteHandler = React.useCallback(() => {
    setIsDeleteModalOpen(true);
  }, [photo, index, needHead]);
  const deletePhoto = React.useCallback(async () => {
    try {
      await Delete(photo.id);
      toast.success('Фото удалено!');
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [photo, index, needHead]);

  const canDelete = React.useCallback(() => {
    if (!photo || initPhotos?.length < 1) {
      return false;
    }

    const initPhoto = initPhotos.find((initPhoto) => initPhoto.id === photo.id);

    if (!initPhoto) {
      return false;
    }

    return !initPhoto.public && !initPhoto.main && !initPhoto.head;
  }, [photo, index, initPhotos]);

  return (
    <div className={'PhotosEditActionsWrapper'}>
      {isActionsOpen ? (
        <>
          <ImageButton
            url={IconUrl('close')}
            alt={'close'}
            onClick={() => setIsActionsOpen(false)}
          />
          <ImageButton
            url={publishImage(photo.public)}
            alt={'published'}
            onClick={() => publishHandler(index, !photo.public)}
          />
          <ImageButton
            url={mainImage(photo.main)}
            alt={'main'}
            onClick={() => mainHandler(index, !photo.main)}
          />
          {needHead ? (
            <ImageButton
              url={headImage(photo.head)}
              alt={'head'}
              onClick={() => headHandler(index, !photo.head)}
            />
          ) : (
            <></>
          )}
          {canDelete() && (
            <ImageButton url={IconUrl('delete')} alt={'delete'} onClick={() => deleteHandler()} />
          )}
        </>
      ) : (
        <ImageButton
          url={IconUrl('menu_white')}
          alt={'accordeon'}
          onClick={() => setIsActionsOpen(true)}
        />
      )}
      <Modal
        title={`Удалить фото №${photo.position}?`}
        isOpened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onPressEnter={() => {}}
        backgroundBlur={1}
      >
        <div className={'PhotosEditDeleteWrapper'}>
          <Button onClick={deletePhoto} style={'Border'}>
            <Text text={'Удалить'} color={'white'} />
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(false)} style={'Border'}>
            <Text text={'Отмена'} color={'white'} />
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Actions;
