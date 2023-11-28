export const setTime = (time: string | number, maxTime?: number) => {
  if (+time > (maxTime || 40)) {
    return (maxTime || 40);
  } else if (+time > 1) {
    return (time = +time);
  } else {
    return +time;
  }
};

export const validateTime = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    e.keyCode === 46 ||
    e.keyCode === 8 ||
    e.keyCode === 9 ||
    e.keyCode === 27 ||
    // Разрешаем: home, end, влево, вправо
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    return;
  } else if (e.keyCode < 48 || e.keyCode > 57) {
    e.preventDefault();
  }
};

