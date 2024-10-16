import React from 'react';
import {Button} from '@shared';

interface IImageButton {
  url: string;
  alt: string;
  onClick: () => void;
}

const ImageButton: React.FC<IImageButton> = ({url, alt, onClick}) => {
  return (
    <div className={'ImageButtonWrapper'}>
      <Button onClick={onClick}>{<img alt={alt} src={url} width={20} height={20} />}</Button>
    </div>
  );
};

export {ImageButton};
