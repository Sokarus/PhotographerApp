import React, {ChangeEvent} from 'react';
import './InputText.scss';

interface IInputText {
  text: string;
  type: 'text' | 'email' | 'password'; 
  setText: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<IInputText> = ({text, type, setText}) => {
  return <input type={type} className={'InputTextWrapper'} value={text} onChange={setText} />;
};

export {InputText};
