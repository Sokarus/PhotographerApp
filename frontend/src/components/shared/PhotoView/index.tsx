import React from 'react';
import {ImageButton} from '@shared';
import {IconUrl} from '@utils/photo';
import './PhotoView.scss';

interface PhotoViewProps {
  url: string;
  onClose: (...args: any) => any;
  onLeftClick: (...args: any) => any;
  onRightClick: (...args: any) => any;
}

const PhotoView: React.FC<PhotoViewProps> = ({url, onClose, onLeftClick, onRightClick}) => {
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!url) {
      return;
    }

    setImageLoaded(false);

    const img = new Image();
    img.src = url;

    img.onload = async () => {
      setImageLoaded(true);
    };
  }, [url]);

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
      {imageLoaded ? (
        <img className={'PhotoViewImage'} src={url} onClick={onClose} />
      ) : (
        <div className={'PhotoViewPending'}>
          <img
            className={'PhotoViewPendingImage'}
            width={50}
            height={50}
            src={IconUrl('pending_white')}
          />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export {PhotoView};
