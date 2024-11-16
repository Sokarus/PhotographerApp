import React from 'react';

interface InputDateProps {
  date: string;
  setDate: (...args: any) => any;
  minDate: string;
  maxDate: string;
}

const InputDate: React.FC<InputDateProps> = ({date, setDate, minDate, maxDate}) => {
  return (
    <input
      type={'date'}
      value={date}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(event.target.value)}
      min={minDate}
      max={maxDate}
    />
  );
};

export {InputDate};
