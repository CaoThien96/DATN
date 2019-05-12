export const getPathImage = (name)=>{
  if(name){
    return `${window.location.origin}/avatar/${name}`;
  }
  return `https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png`
}
