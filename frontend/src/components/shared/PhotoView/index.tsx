import React from 'react';
import {ImageButton} from '@shared';
import {IconUrl, PhotoOriginalUrl} from '@utils/photo';
import {Photo} from '@type/photo';
import {DownloadButton} from '@shared';
import './PhotoView.scss';

interface PhotoViewProps {
  photo: Photo;
  onClose: (...args: any) => any;
  onLeftClick: (...args: any) => any;
  onRightClick: (...args: any) => any;
  folderName: string;
  needActions: boolean;
}

const PhotoView: React.FC<PhotoViewProps> = ({
  photo,
  onClose,
  onLeftClick,
  onRightClick,
  folderName,
  needActions = false,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState<boolean>(false);
  const [orientation, setOrientation] = React.useState<string>('Vertical');

  React.useEffect(() => {
    if (!photo) {
      return;
    }

    setImageLoaded(false);

    const img = new Image();
    img.src = PhotoOriginalUrl(folderName, photo.name);

    img.onload = async () => {
      setImageLoaded(true);
      
      if (img.width > img.height) {
        setOrientation('Horizontal')
      }
    };
  }, [photo, folderName, needActions]);

  return (
    <div className={'PhotoView'}>
      <div className={'PhotoViewClose'}>
        <ImageButton url={IconUrl('close')} alt={'close'} onClick={onClose} />
      </div>
      <div className={'PhotoViewLeft'} onClick={onLeftClick}>
        <div className={'PhotoViewLeftLight'} />
      </div>
      <div className={'PhotoViewRight'} onClick={onRightClick}>
        <div className={'PhotoViewRightLight'} />
      </div>
      {imageLoaded ? (
        <div className={'PhotoViewBox'}>
          {needActions ? (
            <DownloadButton
              isModalOpen={isDownloadModalOpen}
              setIsModalOpen={() => setIsDownloadModalOpen(!isDownloadModalOpen)}
              photoFolder={folderName}
              photoName={photo.name}
            />
          ) : (
            <></>
          )}
          <img
            className={`PhotoViewBoxImage${orientation}`}
            src={PhotoOriginalUrl(folderName, photo.name)}
            onClick={onClose}
          />
        </div>
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
  );
};

export {PhotoView};
