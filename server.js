/**
 * Created by Teemu on 12.4.2017.
 */
'use strict';
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', function(socket) {
        const socketid = socket.id;
        console.log('a user connected with session id '+socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message', (jsonMsg) =>{
            console.log('received message from client: '+JSON.stringify(jsonMsg));
            io.sockets.in(jsonMsg.room).emit('message', jsonMsg);
        });
        socket.on('join', (room) => {
            socket.join(room);
            socket.emit('joined', room);
        });
    }
);
server.listen(3000, function() {
    console.log('Server started (3000)');
});