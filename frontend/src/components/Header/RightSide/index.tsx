import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {TextLink, Text} from '@shared';
import {RootState} from '@state/index';
import {Logout} from '@api/User';
import {setLogin, setRoles} from '@state/User';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import './RightSide.scss';

interface RightSide {
  color: 'black' | 'white';
}

const RightSide: React.FC<RightSide> = ({color}) => {
  const dispatch = useDispatch();
  const [isLoginModalOpened, setIsLoginModalOpened] = React.useState<boolean>(false);
  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = React.useState<boolean>(false);
  const {login} = useSelector((state: RootState) => state.user);

  const logoutHandler = React.useCallback(async () => {
    try {
      await Logout();
      localStorage.setItem('user', '');
      dispatch(setLogin(''));
      dispatch(setRoles([]));
      window.open('/', '_self');
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [dispatch]);

  return (
    <div className={'RightSideWrapper'}>
      {!login ? (
        <>
          <TextLink
            text={'Войти'}
            onClick={() => setIsLoginModalOpened(true)}
            textSize={'large'}
            color={color}
          />
          <TextLink
            text={'Регистрация'}
            onClick={() => setIsRegistrationModalOpened(true)}
            textSize={'large'}
            color={color}
          />
          <LoginModal isOpened={isLoginModalOpened} onClose={() => setIsLoginModalOpened(false)} />
          <RegistrationModal
            isOpened={isRegistrationModalOpened}
            onClose={() => setIsRegistrationModalOpened(false)}
          />
        </>
      ) : (
        <div className={'RightSideGreeting'}>
          <Text text={`Приветствую, ${login}`} size={'large'} color={color} />
          <TextLink text={'Выход'} onClick={logoutHandler} textSize={'large'} color={color} />
        </div>
      )}
    </div>
  );
};

export default RightSide;
