import React, {ReactNode} from 'react';
import {Button} from '@shared';
import './ImageButton.scss';

interface IImageButton {
  url: string;
  alt: string;
  onClick: (...args: any[]) => any;
  children?: ReactNode;
  spaceBetween?: number;
  style?: 'Default' | 'Photo' | 'White' | 'Black';
}

const ImageButton: React.FC<IImageButton> = ({
  url,
  alt,
  onClick,
  children,
  spaceBetween = 0,
  style = 'Default',
}) => {
  return (
    <div style={{'--space-between': spaceBetween} as any} className={'ImageButtonWrapper'}>
      <Button onClick={onClick} style={style}>
        <img alt={alt} src={url} width={20} height={20} />
        {children || ''}
      </Button>
    </div>
  );
};

export {ImageButton};
