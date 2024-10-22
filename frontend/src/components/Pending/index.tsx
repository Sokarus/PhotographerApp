import React from 'react';
import './Pending.scss';

interface IPending {
  isPending: boolean;
}

const Pending: React.FC<IPending> = ({isPending}) => {
  return isPending ? (
    <div className={'Pending'}>
      <img className={'PendingImage'} width={50} height={50} src={'static/icons/pending.svg'} />
    </div>
  ) : (
    <></>
  );
};

export {Pending};