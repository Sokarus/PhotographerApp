import React from 'react';
import {Text} from '@shared';
import { Photo } from '@type/photo';
import {PhotoWebpUrl, PhotoOriginalUrl} from '@utils/photo';
import './HeadPhoto.scss';

interface HeadPhotoProps {
  photo: Photo;
  folderName: string;
  title: string;
  date: string;
}

const HeadPhoto: React.FC<HeadPhotoProps> = ({photo, folderName, title, date}) => {
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const photoUrl = PhotoWebpUrl(folderName, photo.name);

  React.useEffect(() => {
    const img = new Image();
    img.src = photoUrl;

    img.onload = async () => {
      setImageLoaded(true);
    };
  }, [photoUrl]);

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
        <Text text={title} size={'large'} color={'white'} />
        <Text text={date} size={'small'} color={'white'} />
      </div>
    </div>
  );
};

export default HeadPhoto;
