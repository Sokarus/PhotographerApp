import React from 'react';
import './Toggle.scss';

interface ToggleProps {
  on: boolean;
  onClick: (...args: any) => any;
}

const Toggle: React.FC<ToggleProps> = ({on, onClick}) => {
  return (
    <label className={'Toggle'}>
      <input type={'checkbox'} checked={on} onClick={onClick} />
      <span className={'Slider'}></span>
    </label>
  );
};

export {Toggle};
