import React from 'react';
import {toast} from 'react-toastify';
import {Header} from '@components';
import {PortfolioPhotosession} from '@type/photosession';
import {Portfolio as GetPortfolio} from '@api/Photosession';
import Photosessions from './Photosessions';
import './Portfolio.scss';

const Portfolio: React.FC = () => {
  const [photosessions, setPhotosessions] = React.useState<PortfolioPhotosession[]>([]);
  const queryParameters = new URLSearchParams(window.location.search);
  const name = queryParameters.get('name');

  React.useEffect(() => {
    GetPortfolio()
      .then((portfolioPhotosessions) => setPhotosessions(portfolioPhotosessions))
      .catch((error) => {
        toast.error((error as Error).message);
      });
  }, []);

  return (
    <>
      <Header color={'white'} />
      <div className={'PortfolioWrapper'}>
        <div className={'PortfolioContent'}>
          <Photosessions photosessions={photosessions} />
        </div>
      </div>
    </>
  );
};

export {Portfolio};
