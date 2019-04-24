export const getStartMonth = (y, m) => new Date(y, m, 1,0,0,0);
export const getEndMonth = (y, m) => new Date(y, m + 1, 0,0,0,0);
export const getStartYear = (y)=> new Date(y,0,1,0,0,0);
export const getEndYear = (y)=> new Date(y,12,31,0,0,0);
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
export const getStartDay = (time=new Date())=>{
  const y = time.getFullYear();
  const m = time.getMonth();
  const d = time.getDate();
  return new Date(y,m,d,0,0,1);
}
export const getEndDay = (time=new Date())=>{
  const y = time.getFullYear();
  const m = time.getMonth();
  const d = time.getDate();
  return new Date(y,m,d,23,59,0);
}
