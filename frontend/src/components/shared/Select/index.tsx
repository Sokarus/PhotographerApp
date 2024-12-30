import React, {ChangeEvent} from 'react';
import {Text} from '@shared';
import './Select.scss';

interface SelectProps {
  options: string[];
  setOption: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  current?: string;
}

const Select: React.FC<SelectProps> = ({options, setOption, placeholder, current = ''}) => {
  return (
    <select className={'SelectWrapper'} onChange={setOption}>
      <option value={''}>{placeholder}</option>
      {options?.map((option) => (
        <option value={option} selected={option === current}>
          <Text text={option} />
        </option>
      ))}
    </select>
  );
};

export {Select};
