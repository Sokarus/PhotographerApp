import React from 'react';
import {PortfolioPhotosession} from '@type/photosession';
import {Button, Text} from '@shared';
import {PhotoWebpUrl} from '@utils/photo';
import {Transliterate} from '@utils/string';
import useLang from '@hook/Lang';
import './Photosession.scss';

interface PhotosessionProps {
  photosession: PortfolioPhotosession;
}

const Photosession: React.FC<PhotosessionProps> = ({photosession}) => {
  const {lang} = useLang();

  const mainPhoto = React.useCallback(
    () => PhotoWebpUrl(photosession.folderName, photosession.mainPhoto),
    [photosession]
  );
  const getTitle = React.useCallback((): string => {
    return lang != 'en' ? Transliterate(photosession.title, true) : photosession.title;
  }, [lang, useLang]);

  return (
    <Button
      style={'Photo'}
      onClick={() =>
        window.open(`/portfolio/photosession?name=${photosession.folderName}`, '_self')
      }
    >
      <div className={'Photosession'}>
        <img className={'PhotosessionImage'} src={mainPhoto()} />
        <div className={'PhotosessionTitle'}>
          <Text text={getTitle()} size={'small'} color={'white'} />
        </div>
      </div>
    </Button>
  );
};

export default Photosession;
