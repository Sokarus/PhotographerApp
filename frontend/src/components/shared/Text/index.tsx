import React from 'react';
import {TextColorMap} from '@constant/style';
import './Text.scss';

interface IText {
  text: string | number;
  size?: 'large' | 'medium' | 'small';
  color?: 'black' | 'white';
}

const Text: React.FC<IText> = ({text, size = 'medium', color = 'black'}) => {
  return (
    <span
      className={'TextWrapper'}
      style={{'--font-size': size, '--color': TextColorMap[color]} as any}
    >
      {text}
    </span>
  );
};

export {Text};
