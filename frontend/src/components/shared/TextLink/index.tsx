import React from 'react';
import {Link, Text} from '@shared';
import './TextLink.scss';

interface ITextLink {
  text: string;
  url?: string;
  onClick?: () => void;
  textSize?: 'large' | 'medium' | 'small';
}

const TextLink: React.FC<ITextLink> = ({text, url = '', onClick, textSize = 'medium'}) => {
  return (
    <div className={'TextLinkWrapper'}>
      <Link href={url} onClick={onClick}>
        <Text text={text} size={textSize} />
      </Link>
    </div>
  );
};

export {TextLink};
