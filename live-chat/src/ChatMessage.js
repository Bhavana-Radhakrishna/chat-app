import React from 'react';
import { useSwipeable } from 'react-swipeable';

const ChatMessage = ({ message, onReply, parentMessage }) => {
  const handlers = useSwipeable({
    onSwipedRight: () => onReply(message),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className={`chat-message-container`}>
    <div
      className="p-4 mb-2  shadow-md rounded-lg cursor-pointer chat-message"
      {...handlers}
    >
      {message.reply_to && (
        <div className="mt-2 p-1 border-l border-blue-300 rounded-lg bg-blue-50  parent-message">
          <span>{parentMessage.text}</span>
        </div>
      )}
      <div className="flex-end  justify-between items-center message-text">
        <span>{message.text}</span>
        <span className="text-sm  time-color ps-3">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
     </div>
  );
};

export default ChatMessage;
