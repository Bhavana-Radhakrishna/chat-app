import React, { useEffect, useRef, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setMessages } from './features/messages/messagesSlice';
import ChatMessage from './ChatMessage';
import backgroundImage from './images/dark-bg.jpeg';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);
  const ws = useRef(null);
  const userId = window.location.port;
  console.log(userId, "userId");
  console.log(messages, "meeee");

  useEffect(() => {

    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        console.log(data.messages, "hii");
        dispatch(setMessages(data.messages));
      } else {
        dispatch(addMessage(data));
      }
    };

    return () => {
      ws.current.close();
    };
  }, [dispatch]);

  const sendMessage = () => {
    const message = {
      text: input,
      timestamp: new Date().toISOString(),
      reply_to: replyTo ? replyTo.id : null,
    };
    console.log(message);
    ws.current.send(JSON.stringify(message));
    setInput('');
    setReplyTo(null);
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const getParentMessage = (id) => {
    if (id !== null) {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === id) {
          return messages[i];
        }
      }
    }
    return null;
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center', height: '100vh', padding: '20px' }}>
      <div className="chat-wrapper">
        <div className="messages-container">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onReply={handleReply} parentMessage={getParentMessage(msg.reply_to)} />
          ))}
        </div>
        {replyTo && (
          <div className="reply-info">
            <div className='reply-exit'>

              Replying to: {replyTo.text}
              <button className="exit-reply" onClick={() => setReplyTo(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

          </div>
        )}
        <div className="input-container">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
          />
          <button onClick={sendMessage} className="send-button" disabled={input.trim().length === 0}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
