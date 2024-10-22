import React from 'react';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {Modal, InputText, Text, Button} from '@shared';
import {setLogin as setLoginState, setRoles} from '@state/User';
import {Login, UserData} from '@api/User';
import {BaseModal} from '@type/modal';
import {ValidateLogin, ValidatePassword} from '@utils/validator';
import {ColorTheme} from '@constant/style';
import './LoginModal.scss';

interface ILoginModal extends BaseModal {}

const LoginModal: React.FC<ILoginModal> = ({isOpened, onClose}) => {
  const dispatch = useDispatch();
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const validateAuth = React.useCallback(() => {
    if (!ValidateLogin(login)) {
      toast.error('Слишком короткий логин!');
      return false;
    }
    if (!ValidatePassword(password)) {
      toast.error('Пароль не соответствует требованиям!');
      return false;
    }

    return true;
  }, [login, password]);

  const loginHandler = React.useCallback(async () => {
    if (!validateAuth()) {
      return;
    }

    try {
      await Login(login, password);
      onClose();
      try {
        const userData = await UserData();
        dispatch(setLoginState(userData.login));
        dispatch(setRoles(userData.roles));
      } catch (error) {
        toast.error((error as Error).message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [login, password]);

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      <div className={'LoginModalWrapper'}>
        <div className={'LoginModalInput'}>
          <Text text={'Логин'} color={ColorTheme.white} size={'large'} />
          <InputText
            text={login}
            type={'text'}
            placeholder={'Ваш логин'}
            color={ColorTheme.white}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLogin(event.currentTarget.value)
            }
          />
        </div>
        <div className={'LoginModalInput'}>
          <Text text={'Пароль'} color={ColorTheme.white} size={'large'} />
          <InputText
            text={password}
            type={'password'}
            placeholder={'Ваш пароль'}
            color={ColorTheme.white}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.currentTarget.value)
            }
          />
        </div>
        <Button onClick={loginHandler}>
          <Text text={'Войти'} color={ColorTheme.white} size={'large'} />
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;
