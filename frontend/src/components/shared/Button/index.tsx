import React, {ReactNode} from 'react';
import './Button.scss';

interface IButton {
  onClick: () => void;
  children: ReactNode;
}

const Button: React.FC<IButton> = ({onClick, children}) => {
  return (
    <button className={'ButtonWrapper'} onClick={onClick}>
      {children}
    </button>
  );
};

export {Button};
