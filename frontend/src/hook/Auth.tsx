import React from 'react';
import {useDispatch} from 'react-redux';
import {setLogin, setRoles} from '@state/User';
import {UserData} from '@api/User';
import {TimeHasPassed} from '@utils/date';

const useAuth = (withRedirect: boolean = false) => {
  const dispatch = useDispatch();

  const CheckAuth = React.useCallback(() => {
    if (withRedirect) {
      window.open('/', '_self');
    } else {
      UserData()
        .then((userData) => {
          dispatch(setLogin(userData.login));
          dispatch(setRoles(userData.roles));
        })
        .catch(() => {});
    }
  }, [dispatch, withRedirect]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (TimeHasPassed(parsedUser.date, 1)) {
        localStorage.setItem('user', '');
        CheckAuth();
      } else {
        dispatch(setLogin(parsedUser.login));
        dispatch(setRoles(parsedUser.roles));
      }
    } else {
      CheckAuth();
    }
  }, [dispatch]);

  return;
};

export default useAuth;
