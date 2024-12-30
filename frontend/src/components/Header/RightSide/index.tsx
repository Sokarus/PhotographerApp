import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {TextLink, Text} from '@shared';
import {RootState} from '@state/index';
import {Logout} from '@api/User';
import {setLogin, setRoles} from '@state/User';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import './RightSide.scss';
import Language from '../Language';

interface RightSide {
  color: 'black' | 'white';
}

const RightSide: React.FC<RightSide> = ({color}) => {
  const {t} = useTranslation();
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
      {localStorage.getItem('needAuth') &&
        (!login ? (
          <>
            <TextLink
              text={t('войти')}
              onClick={() => setIsLoginModalOpened(true)}
              textSize={'small'}
              color={color}
            />
            <TextLink
              text={t('регистрация')}
              onClick={() => setIsRegistrationModalOpened(true)}
              textSize={'small'}
              color={color}
            />
            <LoginModal
              isOpened={isLoginModalOpened}
              onClose={() => setIsLoginModalOpened(false)}
            />
            <RegistrationModal
              isOpened={isRegistrationModalOpened}
              onClose={() => setIsRegistrationModalOpened(false)}
            />
          </>
        ) : (
          <div className={'RightSideGreeting'}>
            <Text text={`Приветствую, ${login}`} size={'small'} color={color} />
            <TextLink text={'Выход'} onClick={logoutHandler} textSize={'small'} color={color} />
          </div>
        ))}
      <Language />
    </div>
  );
};

export default RightSide;
