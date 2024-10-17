import React from 'react';
import {useSelector} from 'react-redux';
import {TextLink} from '@shared';
import {RootState} from '@state/index';
import './LeftSide.scss';

const LeftSide: React.FC = () => {
  const {roles} = useSelector((state: RootState) => state.user);

  return (
    <div className={'LeftSideWrapper'}>
      <TextLink text={'Портфолио'} url={'/portfolio'} />
      <TextLink text={'Цены'} url={'/price'} />
      <TextLink text={'Оставить заявку'} url={'/ticket'} />
      <TextLink text={'Обо мне'} url={'/about'} />
      {roles.includes('admin') ? <TextLink text={'Администрирование'} url={'/admin'} /> : <></>}
    </div>
  );
};

export default LeftSide;
