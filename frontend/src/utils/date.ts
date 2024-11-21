const TimeHasPassed = (dateTime: string, time: number) => {
  const now = new Date();
  const comparison = new Date(dateTime);

  const diffInMs = now.getTime() - comparison.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours >= time;
};

const CurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const GetDateAfterDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const GetDateBeforeDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const FormatDate = (dateToFormat: string) => {
  const date = new Date(dateToFormat);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export {TimeHasPassed, CurrentDate, GetDateAfterDays, GetDateBeforeDays, FormatDate};
