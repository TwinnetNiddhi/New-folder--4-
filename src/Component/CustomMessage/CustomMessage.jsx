import { message } from 'antd';
import React from 'react';
import '../../Component/CustomMessage/CustomMessage.css'

const CustomMessage = (type, content) => {
  const getMessageClass = (messageType) => {
    return messageType === 'success' ? 'success-message' : 'error-message';
  };

  message[type]({
    content: (
      <span className={getMessageClass(type)}>
        {content}
      </span>
    ),
  });
};

export default CustomMessage;
