module.exports.getStartDay = (time=new Date())=>{
  const y = time.getFullYear();
  const m = time.getMonth();
  const d = time.getDate();
  return new Date(y,m,d,0,0,1);
}
module.exports.getEndDay = (time=new Date())=>{
  const y = time.getFullYear();
  const m = time.getMonth();
  const d = time.getDate();
  return new Date(y,m,d,23,59,0);
}
