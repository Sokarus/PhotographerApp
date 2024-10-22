import React, {ChangeEvent} from 'react';
import {TextColorMap} from '@constant/style';
import './InputText.scss';

interface IInputText {
  text: string;
  type: 'text' | 'email' | 'password';
  color?: 'black' | 'white';
  placeholder?: string;
  setText: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<IInputText> = ({
  text,
  type,
  color = 'black',
  placeholder = '',
  setText,
}) => {
  return (
    <input
      type={type}
      style={{'--color': TextColorMap[color]} as any}
      className={'InputTextWrapper'}
      value={text}
      onChange={setText}
      placeholder={placeholder}
    />
  );
};

export {InputText};
