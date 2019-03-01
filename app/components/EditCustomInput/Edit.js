import React, { Component } from 'react';
import Button from 'antd/es/button/button';

const Edit = (props)=>{
  const {status,onEdit,onSave} = props
  return !status ? (
    <div>
      <Button onClick={onEdit}>Edit</Button>
    </div>
  ) : (
    <div>
      <Button onClick={onSave} >Save</Button>
      <Button onClick={onEdit}>Cancel</Button>
    </div>
  );
}

export default Edit;
