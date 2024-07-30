const mysql = require('mysql2');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat_app'
});

connection.connect();

wss.on('connection', (ws) => {
  connection.query('SELECT * FROM messages ORDER BY timestamp ASC', (err, results) => {
    if (err) throw err;
    ws.send(JSON.stringify({ type: 'init', messages: results }));
  });

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    const { text, timestamp, reply_to,userId } = parsedMessage;

    // Convert timestamp to MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
    const formattedTimestamp = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');

    connection.query('INSERT INTO messages (text, timestamp, reply_to) VALUES (?, ?, ?)', [text, formattedTimestamp, reply_to],(err, results) => {
      if (err) throw err;
      const newMessage = { id: results.insertId, text, timestamp: formattedTimestamp, reply_to};
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
    });
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
