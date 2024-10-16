const Registration = (login: string, email: string, password: string) => {
  return fetch('oapi/user/registration', {
    method: 'POST',
    body: JSON.stringify({login, email, password}),
  });
};

const Login = (login: string, password: string) => {
  return fetch('oapi/user/login', {
    method: 'POST',
    body: JSON.stringify({login, password}),
  });
};

const UserData = () => {
  return fetch('api/user/data', {
    method: 'GET',
    credentials: 'include',
  });
};

export {Registration, Login, UserData};
