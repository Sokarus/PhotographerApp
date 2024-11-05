import React from 'react';
import {Link, Text} from '@shared';
import './TextLink.scss';

interface ITextLink {
  text: string;
  url?: string;
  onClick?: () => void;
  textSize?: 'large' | 'medium' | 'small';
  color?: 'black' | 'white';
}

const TextLink: React.FC<ITextLink> = ({
  text,
  url = '',
  onClick,
  textSize = 'medium',
  color = 'black',
}) => {
  return (
    <div className={'TextLinkWrapper'}>
      <Link href={url} onClick={onClick}>
        <Text text={text} size={textSize} color={color} />
      </Link>
    </div>
  );
};

export {TextLink};
