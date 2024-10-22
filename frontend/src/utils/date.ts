const TimeHasPassed = (dateTime: string, time: number) => {
  const now = new Date();
  const comparison = new Date(dateTime);

  const diffInMs = now.getTime() - comparison.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours >= time;
};

export {TimeHasPassed};
