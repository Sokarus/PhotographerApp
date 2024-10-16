import React from 'react';
import {useDispatch} from 'react-redux';
import {Modal, InputText, Text, Button} from '@shared';
import {setLogin as setLoginState, setRoles} from '@state/User';
import {Registration, UserData} from '@api/User';
import './RegistrationModal.scss';

interface IRegistrationModal {
  isOpened: boolean;
  onClose: () => void;
}

const RegistrationModal: React.FC<IRegistrationModal> = ({isOpened, onClose}) => {
  const dispatch = useDispatch();
  const [login, setLogin] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const registrationHandler = React.useCallback(() => {
    onClose();
    
    Registration(login, email, password)
      .then((responce) => {
        if (responce.status !== 201) {
          return;
        }

        UserData().then(async (responce) => {
          if (responce.status !== 200) {
            return;
          }

          const data = await responce.json();

          dispatch(setLoginState(data.login));
        }).catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
