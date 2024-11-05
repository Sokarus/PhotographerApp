import React, {ReactNode} from 'react';
import './Button.scss';

interface IButton {
  onClick: () => void;
  children: ReactNode;
  style?: 'default' | 'photo';
}

const Button: React.FC<IButton> = ({onClick, children, style = 'default'}) => {
  return (
    <button className={style === 'photo' ? 'ButtonPhoto' : 'ButtonDefault'} onClick={onClick}>
      {children}
    </button>
  );
};

export {Button};
