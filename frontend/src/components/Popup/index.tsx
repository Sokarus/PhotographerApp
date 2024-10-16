import React from 'react';
import {Text} from '@shared';
import './Popup.scss';

interface IPopup {
  text: string;
  type: 'info' | 'warning' | 'error';
}

const Popup: React.FC<IPopup> = ({text, type}) => {
  return (
    <div className={'PopupWrapper'}>
      <Text text={text} />
    </div>
  );
};

export {Popup};
