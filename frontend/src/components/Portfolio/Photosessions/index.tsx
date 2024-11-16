import React from 'react';
import {PortfolioPhotosession} from '@type/photosession';
import Photosession from '../Photosession';
import './Photosessions.scss';

interface PhotosessionsProps {
  photosessions: PortfolioPhotosession[];
}

const Photosessions: React.FC<PhotosessionsProps> = ({photosessions}) => {
  return (
    <div className={'PhotosessionsWrapper'}>
      {photosessions?.map((photosession) => (
        <Photosession photosession={photosession} />
      ))}
    </div>
  );
};

export default Photosessions;
