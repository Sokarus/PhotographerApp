import React from 'react';
import './Pending.scss';
import { IconUrl } from '@utils/photo';

const Pending: React.FC = () => {
  return (
    <div className={'Pending'}>
      <img
        className={'PendingImage'}
        width={50}
        height={50}
        src={IconUrl('pending')}
      />
    </div>
  );
};

export {Pending};
