export const getStartMonth = (y, m) => new Date(y, m, 1);
export const getEndMonth = (y, m) => new Date(y, m + 1, 0);
export const getStartWeek = (y, m, d) => {};
function getDateOfWeek(y,w) {
  const d = (w - 1) * 7; // 1st of January + 7 days for each week

  return new Date(y, 0, d);
}
export const getStartEndWeek = (y, w) => {
  const startWeek = getDateOfWeek(y, w);
  const sunDay = (w - 1) * 7 + 6;
  const endWeek = new Date(new Date(y, 0, sunDay));
  console.log(startWeek,endWeek)
  return {
    startWeek,
    endWeek,
  };
};
