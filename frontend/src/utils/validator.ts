const ValidateLogin = (login: string): boolean => {
  return login?.length >= 3;
};

const ValidateEmail = (email: string): boolean => {
  return !!email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const ValidatePassword = (password: string): boolean => {
  return !!password.match(
    // required 1 capitel letter
    // required 1 lowercase letter
    // required 1 digit
    // required length 6
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/
  );
};

export {ValidateLogin, ValidateEmail, ValidatePassword};
