import React from 'react';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {Modal, InputText, Text, Button} from '@shared';
import {setLogin as setLoginState, setRoles} from '@state/User';
import {Registration, UserData} from '@api/User';
import {BaseModal} from '@type/modal';
import {ValidateLogin, ValidateEmail, ValidatePassword} from '@utils/validator';
import './RegistrationModal.scss';

interface IRegistrationModal extends BaseModal {}

const RegistrationModal: React.FC<IRegistrationModal> = ({isOpened, onClose}) => {
  const dispatch = useDispatch();
  const [login, setLogin] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const validateRegistration = React.useCallback(() => {
    if (!ValidateLogin(login)) {
      toast.error('Слишком короткий логин!');
      return false;
    }
    if (!ValidatePassword(password)) {
      toast.error('Пароль не соответствует требованиям!');
      return false;
    }
    if (!ValidateEmail(email)) {
      toast.error('Невалидный email!');
      return false;
    }

    return true;
  }, [login, password]);

  const registrationHandler = React.useCallback(async () => {
    if (!validateRegistration()) {
      return;
    }

    try {
      toast.success(await Registration(login, email, password));
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
  }, [login, email, password]);

  return (
    <Modal isOpened={isOpened} title={'Зарегистрироваться'} onClose={onClose}>
      <div className={'RegistrationModalWrapper'}>
        <div className={'RegistrationModalInput'}>
          <Text text={'Логин'} />
          <InputText
            text={login}
            type={'text'}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLogin(event.currentTarget.value)
            }
          />
        </div>
        <div className={'RegistrationModalInput'}>
          <Text text={'Email'} />
          <InputText
            text={email}
            type={'email'}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(event.currentTarget.value)
            }
          />
        </div>
        <div className={'RegistrationModalInput'}>
          <Text text={'Пароль'} />
          <InputText
            text={password}
            type={'password'}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.currentTarget.value)
            }
          />
        </div>
        <Button onClick={registrationHandler}>
          <Text text={'Зарегистрироваться'} />
        </Button>
      </div>
    </Modal>
  );
};

export default RegistrationModal;
