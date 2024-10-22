import React, {ReactNode} from 'react';
import {Button} from '@shared';

interface IImageButton {
  url: string;
  alt: string;
  onClick: () => void;
  children?: ReactNode;
}

const ImageButton: React.FC<IImageButton> = ({url, alt, onClick, children}) => {
  return (
    <div className={'ImageButtonWrapper'}>
      <Button onClick={onClick}>
        <img alt={alt} src={url} width={20} height={20} />
        {children || ''}
      </Button>
    </div>
  );
};

export {ImageButton};
