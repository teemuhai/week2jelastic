/**
 * Created by Teemu on 12.4.2017.
 */
"use strict";

//const moment = require('moment');
let message = '';
let userName = '';
let desRoom = '';
const socket = io.connect('http://localhost:3000');
socket.on('message', function (data) {
    console.log('got message from server: ' + data.message);
    document.getElementById('message').innerHTML += `<br>` + data.user + '(' + data.time + ')' + ': ' + data.message;
    document.getElementById('room').innerHTML = data.room;
});
socket.on('connect', () => {
    console.log('socket.io connected!');
});
socket.on('disconnect', () => {
    console.log('socket.io connected!');
});
socket.on('joined' ,(data) => {
   console.log('joined room: ' + data)
});



document.getElementById('userNameInput').addEventListener('input', (evt) =>{
    if(evt.target.value != ''){
        userName = evt.target.value;
        document.getElementById('userLabel').innerHTML = userName;
    }
});

document.getElementById('roomInput').addEventListener('input', (evt) =>{
    if(evt.target.value != ''){
        desRoom = evt.target.value;
        document.getElementById('roomLabel').innerHTML = desRoom;
    }
});

document.getElementById('joinBtn').addEventListener('click', (evt) => {
   if(desRoom != ''){
       socket.emit('join',desRoom);
   }
});

document.getElementById('textInput').addEventListener('input', (evt) =>{
    if(evt.target.value != ''){
        message = evt.target.value;
    }
});

document.getElementById('sendText').addEventListener('click', (evt) => {
   sendMsg(message);
});
function sendMsg(message) {
    console.log('send msg: ' + message);
    let msg = {};
    //msg.app_id = this.appName;
    msg.user = userName || 'guest';
    msg.time = Date.now();
    msg.json = 'json';
    msg.message = message;
    msg.room = desRoom;
    // socket.json.emit('message', msg);
    socket.emit('message', msg);
}
//setTimeout(sendMsg, 1000);