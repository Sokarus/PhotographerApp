import React, {ChangeEvent} from 'react';
import {Text} from '@shared';
import './Select.scss';

interface SelectProps {
  options: string[];
  setOption: (event: ChangeEvent<HTMLSelectElement>) => void;
  current?: string;
}

const Select: React.FC<SelectProps> = ({options, setOption, current = ''}) => {
  return (
    <select className={'SelectWrapper'} onChange={setOption}>
      <option value={''}>{''}</option>
      {options?.map((option) => (
        <option value={option} selected={option === current}>
          <Text text={option} />
        </option>
      ))}
    </select>
  );
};

export {Select};
