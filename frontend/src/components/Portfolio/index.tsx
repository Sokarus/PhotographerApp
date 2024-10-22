import React from 'react';
import {toast} from 'react-toastify';
import {Header} from '@components';
import {Photosession} from '@type/photosession';
import {PhotosessionsList} from '@api/Photosession';
import './Portfolio.scss';

// TODO remove this
const mockData = [
  {
    countPhotos: 5,
    mainPhoto: '',
    title: 'Первая фотосессия',
  },
  {
    countPhotos: 10,
    mainPhoto: '',
    title: 'Вторая фотосессия',
  },
  {
    countPhotos: 50,
    mainPhoto: '',
    title: 'Третяя фотосессия',
  },
] as Photosession[];

const Portfolio: React.FC = () => {
  const [photosessions, setPhotosessions] = React.useState<Photosession[]>([]);

  React.useEffect(() => {
    PhotosessionsList()
      .then((photosessionsList) => setPhotosessions(photosessionsList))
      .catch((error) => {
        toast.error((error as Error).message);
      });
  }, []);

  return (
    <>
      <Header />
      <div className={'PortfolioWrapper'}>
        <div className={'PortfolioContent'}>{'Work in progressasdas'}</div>
      </div>
    </>
  );
};

export {Portfolio};
