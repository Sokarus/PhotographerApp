import React from 'react';
import {Text} from '@shared';
import {Photo} from '@type/photo';
import {PhotoOriginalUrl} from '@utils/photo';
import {Transliterate} from '@utils/string';
import useLang from '@hook/Lang';
import './HeadPhoto.scss';

interface HeadPhotoProps {
  photo: Photo;
  folderName: string;
  title: string;
  date: string;
}

const HeadPhoto: React.FC<HeadPhotoProps> = ({photo, folderName, title, date}) => {
  const {lang} = useLang();
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const photoUrl = PhotoOriginalUrl(folderName, photo.name);

  React.useEffect(() => {
    const img = new Image();
    img.src = photoUrl;

    img.onload = async () => {
      setImageLoaded(true);
    };
  }, [photoUrl]);

  const getTitle = React.useCallback((): string => {
    return lang != 'en' ? Transliterate(title, true) : title;
  }, [lang, useLang]);

  return !imageLoaded ? (
    <></>
  ) : (
    <div
      style={
        {
          '--background-image': imageLoaded ? `url('${photoUrl}')` : 'none',
        } as any
      }
      className={`HeadPhotoWrapper ${imageLoaded ? 'ImageLoaded' : ''}`}
    >
      <div className={'HeadPhotoTitle'}>
        <Text text={getTitle()} size={'large'} color={'white'} />
        <Text text={date} size={'small'} color={'white'} />
      </div>
    </div>
  );
};

export default HeadPhoto;
