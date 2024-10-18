import React from 'react';
import {useSelector} from 'react-redux';
import {TextLink} from '@shared';
import {RootState} from '@state/index';
import './LeftSide.scss';

const LeftSide: React.FC = () => {
  const {roles} = useSelector((state: RootState) => state.user);

  return (
    <div className={'LeftSideWrapper'}>
      <TextLink text={'Портфолио'} url={'/portfolio'} textSize={'large'} />
      <TextLink text={'Цены'} url={'/price'} textSize={'large'} />
      <TextLink text={'Оставить заявку'} url={'/ticket'} textSize={'large'} />
      <TextLink text={'Обо мне'} url={'/about'} textSize={'large'} />
      {roles.includes('admin') ? (
        <TextLink text={'Администрирование'} url={'/admin'} textSize={'large'} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default LeftSide;
