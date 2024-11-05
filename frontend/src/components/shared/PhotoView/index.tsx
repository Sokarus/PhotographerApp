import React from 'react';
import {Text, ImageButton} from '@shared';
import './PhotoView.scss';

interface PhotoViewProps {
  url: string;
  onClose: (...args: any) => any;
  onLeftClick: (...args: any) => any;
  onRightClick: (...args: any) => any;
}

const PhotoView: React.FC<PhotoViewProps> = ({url, onClose, onLeftClick, onRightClick}) => {
  return url ? (
    <div className={'PhotoView'}>
      <div className={'PhotoViewClose'}>
        <ImageButton
          url={'https://storage.yandexcloud.net/kocherovaphoto/icons/close.svg'}
          alt={'close'}
          onClick={onClose}
        />
      </div>
      <div className={'PhotoViewLeft'} onClick={onLeftClick}>
        <div className={'PhotoViewLeftLight'} />
      </div>
      <div className={'PhotoViewRight'} onClick={onRightClick}>
        <div className={'PhotoViewRightLight'} />
      </div>
      <img className={'PhotoViewImage'} src={url} onClick={onClose} />
    </div>
  ) : (
    <></>
  );
};

export {PhotoView};
