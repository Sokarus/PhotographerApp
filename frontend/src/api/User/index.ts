import {Role} from '@type/user';

const Registration = async (login: string, email: string, password: string): Promise<string> => {
  return fetch('oapi/user/registration', {
    method: 'POST',
    body: JSON.stringify({login, email, password}),
  }).then(async (response) => {
    if (response.status === 201) {
      return 'Регистрация прошла успешно!';
    }

    const errorData = await response.json();

    throw new Error(errorData.message);
  });
};

const Login = async (login: string, password: string): Promise<boolean> => {
  return fetch('oapi/user/login', {
    method: 'POST',
    body: JSON.stringify({login, password}),
  }).then(async (response) => {
    if (response.status === 200) {
      return true;
    }

    const errorData = await response.json();

    throw new Error(errorData.message);
  });
};

interface IUserData {
  login: string;
  roles: Role[];
}

const UserData = async (): Promise<IUserData> => {
  return fetch('api/user/data', {
    method: 'GET',
    credentials: 'include',
  }).then(async (response) => {
    if (response.status === 200) {
      const userData = await response.json();

      return {
        login: userData.login,
        roles: userData.roles,
      };
    }

    if (response.status === 401) {
      throw new Error('Ошибка авторизации!');
    }

    throw new Error('Ошибка получения данных пользователя.');
  });
};

export {Registration, Login, UserData};
