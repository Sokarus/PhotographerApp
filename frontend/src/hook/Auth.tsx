import React from 'react';
import {useDispatch} from 'react-redux';
import {setLogin, setRoles} from '@state/User';
import {UserData} from '@api/User';

const useAuth = (withRedirect: boolean = false) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setLogin(parsedUser.login));
      dispatch(setRoles(parsedUser.roles));
    } else {
      if (withRedirect) {
        window.open('/', '_self');
      } else {
        UserData()
          .then((userData) => {
            dispatch(setLogin(userData.login));
            dispatch(setRoles(userData.roles));
            localStorage.setItem(
              'user',
              JSON.stringify({login: userData.login, roles: userData.roles})
            );
          })
          .catch(() => {});
      }
    }
  }, [dispatch]);

  return;
};

export default useAuth;
