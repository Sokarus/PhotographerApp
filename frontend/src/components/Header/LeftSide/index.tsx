import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {TextLink} from '@shared';
import {RootState} from '@state/index';
import {LeftSideItems} from '@constant/header';
import './LeftSide.scss';

interface ColorProps {
  color: 'black' | 'white';
}

const LeftSide: React.FC<ColorProps> = ({color}) => {
  const {t} = useTranslation();
  const {roles} = useSelector((state: RootState) => state.user);

  return (
    <div className={'LeftSideWrapper'}>
      {LeftSideItems?.map((item) => {
        if (item.url === '/admin' && !roles.includes('admin')) {
          return null;
        }

        return <TextLink text={t(item.text)} url={item.url} textSize={'small'} color={color} />;
      })}
    </div>
  );
};

export default LeftSide;
