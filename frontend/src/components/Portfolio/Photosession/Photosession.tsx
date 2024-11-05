import React from 'react';
import {PortfolioPhotosession} from '@type/photosession';
import {Button, Text} from '@shared';
import {PhotoWebpUrl} from '@utils/photo';
import './Photosession.scss';

interface PhotosessionProps {
  photosession: PortfolioPhotosession;
}

const Photosession: React.FC<PhotosessionProps> = ({photosession}) => {
  const mainPhoto = React.useCallback(
    () => PhotoWebpUrl(photosession.folderName, photosession.mainPhoto),
    [photosession]
  );

  return (
    <Button
      style={'photo'}
      onClick={() => window.open(`/photosession?name=${photosession.folderName}`, '_self')}
    >
      <div className={'Photosession'}>
        <img className={'PhotosessionImage'} src={mainPhoto()} />
        <div className={'PhotosessionTitle'}>
          <Text text={photosession.title} size={'small'} color={'white'} />
        </div>
      </div>
    </Button>
  );
};

export default Photosession;
