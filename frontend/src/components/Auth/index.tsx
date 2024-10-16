import React, {ReactElement} from 'react';
import {useDispatch} from 'react-redux';
import {setLogin} from '@state/User';
import {UserData} from '@api/User';

interface IAuth {
  children: ReactElement[] | ReactElement;
}

const Auth: React.FC<IAuth> = ({children}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    UserData()
      .then(async (responce) => {
        if (responce.status !== 200) {
          return;
        }

        const data = await responce.json();

        dispatch(setLogin(data.login));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <>{children}</>;
};

export {Auth};
