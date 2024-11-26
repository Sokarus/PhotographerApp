import React, {ReactNode} from 'react';
import './Button.scss';

interface IButton {
  onClick: (...args: any) => any;
  children: ReactNode;
  style?: 'Default' | 'Photo' | 'White' | 'Black';
}

const Button: React.FC<IButton> = ({onClick, children, style = 'Default'}) => {
  return (
    <button className={`Button${style}`} onClick={onClick}>
      {children}
    </button>
  );
};

export {Button};
