import React from 'react';
import {useDispatch} from 'react-redux';
import {Modal, InputText, Text, Button} from '@shared';
import {setLogin as setLoginState, setRoles} from '@state/User';
import {Login, UserData} from '@api/User';
import './LoginModal.scss';

interface ILoginModal {
  isOpened: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<ILoginModal> = ({isOpened, onClose}) => {
  const dispatch = useDispatch();
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const loginHandler = React.useCallback(() => {
    Login(login, password)
      .then((responce) => {
        if (responce.status !== 200) {
          return;
        }

        UserData()
          .then(async (responce) => {
            if (responce.status !== 200) {
              return;
            }

            const data = await responce.json();

            dispatch(setLoginState(data.login));
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [login, password]);

  return (
    <Modal isOpened={isOpened} title={'Войти'} onClose={onClose}>
      <div className={'LoginModalWrapper'}>
        <div className={'LoginModalInput'}>
          <Text text={'Логин'} />
          <InputText
            text={login}
            type={'text'}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLogin(event.currentTarget.value)
            }
          />
        </div>
        <div className={'LoginModalInput'}>
          <Text text={'Пароль'} />
          <InputText
            text={password}
            type={'password'}
            setText={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.currentTarget.value)
            }
          />
        </div>
        <Button onClick={loginHandler}>
          <Text text={'Войти'} />
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;
