const timeFormat = (time: string): string => {
  if (time !== "none") {
    const endTime = new Date(time);
    return `${
      endTime.getDate() > 9 ? endTime.getDate() : "0" + endTime.getDate()
    }.${
      +endTime.getMonth() + 1 > 9
        ? +endTime.getMonth() + 1
        : "0" + (+endTime.getMonth() + 1)
    }.${endTime.getFullYear()}`;
  }
  return "none";
};

export default timeFormat;