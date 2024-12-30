import React from 'react';
import {Header} from '@components';
import {ImageButton, Text} from '@shared';
import useAuth from '@hook/Auth';
import {IconUrl} from '@utils/photo';
import CreatePhotosessionModal from './CreatePhotosessionModal';
import EditPhotosessionModal from './EditPhotosessionModal';
import CreatePhotosessionTypeModal from './CreatePhotosessionTypeModal';
import './Admin.scss';

const Admin: React.FC = () => {
  const [isCreatePhotosessionModalOpened, setIsCreatePhotosessionModalOpened] =
    React.useState<boolean>(false);
  const [isEditPhotosessionModalOpened, setIsEditPhotosessionModalOpened] =
    React.useState<boolean>(false);
  const [isCreatePhotosessionTypeOpened, setIsCreatePhotosessionTypeOpened] =
    React.useState<boolean>(false);
  useAuth(true);

  return (
    <>
      <Header />
      <div className={'AdminWrapper'}>
        <div className={'AdminContent'}>
          <div className={'AdminContentSection'}>
            <Text text={'Фотосессии'} size={'large'} />
            <ImageButton
              url={IconUrl('add')}
              alt={'add'}
              onClick={() => setIsCreatePhotosessionModalOpened(true)}
              spaceBetween={10}
            >
              <Text text={'Создать фотосессию'} />
            </ImageButton>
            <ImageButton
              url={IconUrl('edit')}
              alt={'edit'}
              onClick={() => setIsEditPhotosessionModalOpened(true)}
              spaceBetween={10}
            >
              <Text text={'Редактировать фотосессию'} />
            </ImageButton>
          </div>
          <div className={'AdminContentSection'}>
            <Text text={'Виды съемок'} size={'large'} />
            <ImageButton
              url={IconUrl('add')}
              alt={'add'}
              onClick={() => setIsCreatePhotosessionTypeOpened(true)}
              spaceBetween={10}
            >
              <Text text={'Создать вид съемки'} />
            </ImageButton>
          </div>
        </div>
      </div>
      <CreatePhotosessionModal
        isOpened={isCreatePhotosessionModalOpened}
        onClose={() => setIsCreatePhotosessionModalOpened(false)}
      />
      <EditPhotosessionModal
        isOpened={isEditPhotosessionModalOpened}
        onClose={() => setIsEditPhotosessionModalOpened(false)}
      />
      <CreatePhotosessionTypeModal
        isOpened={isCreatePhotosessionTypeOpened}
        onClose={() => setIsCreatePhotosessionTypeOpened(false)}
      />
    </>
  );
};

export {Admin};
