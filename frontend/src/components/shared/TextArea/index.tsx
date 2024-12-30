import React from 'react';
import './TextArea.scss';

interface TextAreaProps {
  value: string;
  setValue: (...args: any) => any;
  placeholder: string;
}

const TextArea: React.FC<TextAreaProps> = ({value, setValue, placeholder}) => {
  return (
    <textarea
      className={'TextAreaWrapper'}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
    />
  );
};

export {TextArea};
