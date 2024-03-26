export const generateNewId = (arr: Array<any>) => {
  const ids: Array<number> = [];
      for (let item of arr) {
        ids.push(item.id);
      }
      return Math.max.apply(null, ids) + 1;
}