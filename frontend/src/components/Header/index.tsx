import React from 'react';
import RightSide from './RightSide';
import LeftSide from './LeftSide';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <div className={'HeaderWrapper'}>
      <LeftSide />
      <RightSide />
    </div>
  );
};

export {Header};
