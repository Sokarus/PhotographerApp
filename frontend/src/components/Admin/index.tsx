import React from 'react';
import {Header} from '@components';
import {ImageButton, Text} from '@shared';
import useAuth from '@hook/Auth';
import CreatePhotosessionModal from './CreatePhotosessionModal';
import './Admin.scss';

const Admin: React.FC = () => {
  const [isCreatePhotosessionModalOpened, setIsCreatePhotosessionModalOpened] =
    React.useState<boolean>(false);
  useAuth(true);

  return (
    <>
      <Header />
      <div className={'AdminWrapper'}>
        <div className={'AdminContent'}>
          <ImageButton
            url={'static/icons/add.svg'}
            alt={'add'}
            onClick={() => setIsCreatePhotosessionModalOpened(true)}
          >
            <Text text={'Создать фотосессию'} />
          </ImageButton>
        </div>
      </div>
      <CreatePhotosessionModal
        isOpened={isCreatePhotosessionModalOpened}
        onClose={() => setIsCreatePhotosessionModalOpened(false)}
      />
    </>
  );
};

export {Admin};
