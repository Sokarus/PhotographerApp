import React from 'react';
import {useSelector} from 'react-redux';
import {TextLink} from '@shared';
import {RootState} from '@state/index';
import './LeftSide.scss';

interface ColorProps {
  color: 'black' | 'white';
}

const LeftSide: React.FC<ColorProps> = ({color}) => {
  const {roles} = useSelector((state: RootState) => state.user);

  return (
    <div className={'LeftSideWrapper'}>
      <TextLink text={'Главная'} url={'/'} textSize={'large'} color={color} />
      <TextLink text={'Портфолио'} url={'/portfolio'} textSize={'large'} color={color} />
      <TextLink text={'Цены'} url={'/price'} textSize={'large'} color={color} />
      <TextLink text={'Оставить заявку'} url={'/ticket'} textSize={'large'} color={color} />
      <TextLink text={'Обо мне'} url={'/about'} textSize={'large'} color={color} />
      {roles.includes('admin') ? (
        <TextLink text={'Администрирование'} url={'/admin'} textSize={'large'} color={color} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default LeftSide;
