import React from 'react';
import {Link, Text} from '@shared';
import './TextLink.scss';

interface ITextLink {
  text: string;
  url?: string;
  onClick?: () => void;
}

const TextLink: React.FC<ITextLink> = ({text, url = '', onClick}) => {
  return (
    <div className={'TextLinkWrapper'}>
      <Link href={url} onClick={onClick}>
        <Text text={text} />
      </Link>
    </div>
  );
};

export {TextLink};
