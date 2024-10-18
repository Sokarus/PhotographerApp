import React from 'react';
import './Text.scss';

interface IText {
  text: string | number;
  size?: 'large' | 'medium' | 'small';
}

const Text: React.FC<IText> = ({text, size = 'medium'}) => {
  return (
    <span className={'TextWrapper'} style={{'--font-size': size} as any}>
      {text}
    </span>
  );
};

export {Text};
