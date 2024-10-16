import React from 'react';
import {useSelector} from 'react-redux';
import {TextLink, Text} from '@shared';
import {RootState} from '@state/index';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import './RightSide.scss';

const RightSide: React.FC = () => {
  const [isLoginModalOpened, setIsLoginModalOpened] = React.useState<boolean>(false);
  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = React.useState<boolean>(false);
  const {login} = useSelector((state: RootState) => state.user);

  return (
    <div className={'RightSideWrapper'}>
      {!login ? (
        <>
          <TextLink text={'Войти'} onClick={() => setIsLoginModalOpened(true)} />
          <TextLink text={'Регистрация'} onClick={() => setIsRegistrationModalOpened(true)} />
          <LoginModal isOpened={isLoginModalOpened} onClose={() => setIsLoginModalOpened(false)} />
          <RegistrationModal
            isOpened={isRegistrationModalOpened}
            onClose={() => setIsRegistrationModalOpened(false)}
          />
        </>
      ) : (
        <div className={'RightSideGreeting'}>
          <Text text={`Приветствую, ${login}`} />
        </div>
      )}
    </div>
  );
};

export default RightSide;
