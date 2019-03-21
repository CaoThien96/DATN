import React from 'react'
import renderHTML from 'react-render-html';
const PreviewHtml = (props)=>{
  console.log(props)
  return (
    <div>{renderHTML(props.children)}</div>
  )
}
export default PreviewHtml
