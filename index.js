'use strict'

const port = process.env.PORT || 3000;

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public/'));

const server = app.listen(port, () => {
    console.log(`Conecta 4 en http://localhost:${port}`);
});

const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connect', onConnect);

var connections = [];
var currentState = {
    players: [{},{}],
    turn: 0
}

function onConnect(socket){
    console.log('onConnect');

    connections.push(socket.id);

    console.log(connections);

    if(connections.length > 2){
        console.error('onConnect: demasiados jugadores conectados');
        return;
    }

    sendCounter();

    socket.on('disconnect', onDisconnect);
    socket.emit('start');
    socket.on('sendTirada', sendTirada);
    socket.on('updateCurrentState', serverState => {
        io.sockets.emit('updateCurrentState', serverState);
    });
    socket.on('endGame', turn => {
        (turn == 0) ? turn = 1 : turn = 0;
        io.sockets.emit('endGame', turn);
    })
}

function onDisconnect(reason){

    console.log('onDisconnect', reason);

    const index = connections.indexOf(this.id);
    if(index >= 0){
        connections.splice(index, 1);
        for(let i=0, found = false; i < currentState.players.length && (found); i++){
            if(currentState.players[i].id === this.id){
                found = true;
                currentState.players.id[i] = {};
            }
        }
    }
    connections = [];

}

function sendCounter(){
    io.sockets.emit('getCounter', connections.length);
}

function sendTirada(f, c){
    io.sockets.emit('tirada', f, c);
}