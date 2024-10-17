import React, {ReactElement} from 'react';
import useAuth from '@hook/Auth';

interface IAuth {
  children: ReactElement[] | ReactElement;
}

const Auth: React.FC<IAuth> = ({children}) => {
  useAuth();

  return <>{children}</>;
};

export {Auth};
