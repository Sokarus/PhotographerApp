import React from 'react';
import {toast} from 'react-toastify';
import {Modal, InputText, Text, InputImage, Button, TextArea} from '@shared';
import {BaseModal} from '@type/modal';
import {ColorTheme} from '@constant/style';
import {Create} from '@api/PhotosessionType';
import {Pending} from '@components';
import './CreatePhotosessionTypeModal.scss';

interface ICreatePhotosessionTypeModal extends BaseModal {}

const CreatePhotosessionTypeModal: React.FC<ICreatePhotosessionTypeModal> = ({
  isOpened,
  onClose,
}) => {
  const [title, setTitle] = React.useState<string>('');
  const [mainPhoto, setMainPhoto] = React.useState<File>();
  const [description, setDescription] = React.useState<string>('');
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const reset = React.useCallback(() => {
    setIsPending(false);
    setMainPhoto(undefined);
    setTitle('');
    onClose();
  }, []);

  const createHandler = React.useCallback(async () => {
    if (title.length < 3) {
      toast.warning('Название должо быть больше 3-и символов');
      return;
    }
    if (!mainPhoto) {
      toast.warning('Нужно загрузить фото!');
      return;
    }
    if (description.length < 10) {
      toast.warning('[Описание] Введите хотя бы 10 символов!');
      return;
    }

    try {
      setIsPending(true);
      await Create(title, mainPhoto, description).then(() => {
        toast.success('Тип съемки успешно создан!');
        reset();
      });
    } catch (error) {
      toast.error((error as Error).message);
      reset();
    }
  }, [title, mainPhoto, description, onClose]);

  const photoUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files?.[0]) {
      setMainPhoto(files[0]);
    }
  };

  return (
    <>
      <Modal
        isOpened={isOpened}
        title={'Создать тип съемки'}
        onClose={onClose}
        backgroundBlur={1}
        fullWindow
      >
        <div className={'CreatePhotosessionTypeModalWrapper'}>
          <div className={'CreatePhotosessionTypeModalInput'}>
            <Text text={'Название'} color={ColorTheme.white} size={'large'} />
            <div className={'CreatePhotosessionTypeModalInputSection'}>
              <InputText
                text={title}
                type={'text'}
                color={ColorTheme.white}
                placeholder={'Введите название...'}
                setText={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(event.target.value)
                }
              />
            </div>
          </div>
          <div className={'CreatePhotosessionTypeModalInput'}>
            <InputImage setImages={photoUploadHandler} multiple={false} />
          </div>
          {mainPhoto && (
            <img
              className={'CreatePhotosessionTypeModalPhoto'}
              src={URL.createObjectURL(mainPhoto)}
            />
          )}
          <div className={'CreatePhotosessionTypeModalInput'}>
            <Text text={'Описание'} color={ColorTheme.white} size={'large'} />
            <TextArea
              value={description}
              setValue={setDescription}
              placeholder={'Введите описание вида съемки...'}
            />
          </div>
          <Button onClick={createHandler}>
            <Text text={'Создать'} color={ColorTheme.white} size={'large'} />
          </Button>
        </div>
      </Modal>
      {isPending && <Pending />}
    </>
  );
};

export default CreatePhotosessionTypeModal;
