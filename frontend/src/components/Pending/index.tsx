import React from 'react';
import './Pending.scss';
import { IconUrl } from '@utils/photo';

interface IPending {
  isPending: boolean;
}

const Pending: React.FC<IPending> = ({isPending}) => {
  return isPending ? (
    <div className={'Pending'}>
      <img
        className={'PendingImage'}
        width={50}
        height={50}
        src={IconUrl('pending')}
      />
    </div>
  ) : (
    <></>
  );
};

export {Pending};
