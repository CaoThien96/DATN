import React from 'react';
import Divider from 'antd/es/divider';
import Comment from './Comment';

export default ({ objectDetail, currentUser, handleAddReply }) => {
  const { comments } = objectDetail;
  return (
    <div>
      {comments &&
        comments.map((el, key) => (
          <div key={key}>
            <Comment
              iid={el._id}
              onHandleReply={handleAddReply}
              comment={el}
              currentUser={currentUser}
            />
            <Divider />
          </div>
        ))}
    </div>
  );
};
