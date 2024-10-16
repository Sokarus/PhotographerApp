import React, {ReactElement} from 'react';
import './Button.scss';

interface IButton {
  onClick: () => void;
  children: ReactElement[] | ReactElement;
}

const Button: React.FC<IButton> = ({onClick, children}) => {
  return (
    <button className={'ButtonWrapper'} onClick={onClick}>
      {children}
    </button>
  );
};

export {Button};
