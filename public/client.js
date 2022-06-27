'use strict'

const WEBSOCKETSERVER = 'http://localhost:3000';
let localPlayer;
let remotePlayer;
let localPlayerIndex = -1;
let remotePlayerIndex = -1;
let socket;
let endGame = true;

const COLUMNAS = 7;
const FILAS = 6;
const WIDTH = 448;
const HEIGHT = 448;

const playerA = {
    name: 'rojas',
    color: 'red'
}
const playerB = {
    name: "azules",
    color: 'blue'
}

var currentState = {
    players: [{},{}],
    turn: -1,
    tablero: crearTablero()
}

function onStart(){
    let cvs = document.getElementById('canvas'),
    ancho = cvs.width/COLUMNAS,
    alto = cvs.height/COLUMNAS;
    if (currentState.turn == localPlayerIndex && endGame) {
        document.getElementById('msg-turn').innerHTML = 'Es tu turno.';
        cvs.onclick = evt => {
            let f, c;
            f = Math.floor(evt.offsetY / alto);
            c = Math.floor(evt.offsetX / ancho);
            console.log('click', f,c)
            for (let i = COLUMNAS - 1; i > 0; i--) {
                if (currentState.tablero[i - 1][c] == -1) {
                    socket.emit('sendTirada', i, c);
                    let win = checkWin(i - 1, c);
                    if (win) {
                        cvs.onclick = null;
                        endGame = false;
                        document.getElementById('msg-turn').innerHTML = '¡Enhorabuena, has ganado!';
                        socket.emit('endGame', currentState.turn);
                    }
                    break;
                }
            }
        }
    } else {
        cvs.onclick = null;
        if(endGame)
            document.getElementById('msg-turn').innerHTML = 'Turno del rival.';

    }
}

function crearTablero(){
    let matriz = new Array();
    for(let f = 0; f < FILAS; f++){
        matriz[f] = new Array();
        for(let c=0; c < COLUMNAS; c++){
            matriz[f][c] = -1;
        }
    }
    return matriz;
}

function drawFicha(f,c,r,cs='red',cf='yellow',lw = 4){
    let ctx = document.getElementById('canvas').getContext('2d'),
    x = c * (WIDTH/COLUMNAS) + ((WIDTH/COLUMNAS)/2),
    y = f * (HEIGHT/COLUMNAS) + ((HEIGHT/COLUMNAS)/2);
    ctx.beginPath();
    ctx.strokeStyle = cs;
    ctx.fillStyle = cf;
    ctx.lineWidth = lw;
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function checkWin(f,c){
    let conts = [1,1,1,1];

    if(f+1 > 0 && f+1 < FILAS && currentState.tablero[f+1][c] == currentState.turn){
        conts[0]++;
        if(f+2 > 0 && f+2 < FILAS && currentState.tablero[f+2][c] == currentState.turn){
            conts[0]++;
            if(f+3 > 0 && f+3 < FILAS && currentState.tablero[f+3][c] == currentState.turn){
                conts[0]++;
                if(f+4 > 0 && f+4 < FILAS && currentState.tablero[f+4][c] == currentState.turn){
                    conts[0]++;
                }
            }
        }
    }
    if(f-1 > 0 && f-1 < COLUMNAS && currentState.tablero[f-1][c] == currentState.turn){
        conts[0]++;
        if(f-2 > 0 && f-2 < COLUMNAS && currentState.tablero[f-2][c] == currentState.turn){
            conts[0]++;
            if(f-3 > 0 && f-3 < COLUMNAS && currentState.tablero[f-3][c] == currentState.turn){
                conts[0]++;
                if(f-4 > 0 && f-4 < COLUMNAS && currentState.tablero[f-4][c] == currentState.turn){
                    conts[0]++;
                }
            }
        }
    }

    if(f+1 > 0 && f+1 < FILAS && c+1 > 0 && c+1 < COLUMNAS && currentState.tablero[f+1][c+1] == currentState.turn){
        conts[1]++;
        if(f+2 > 0 && f+2 < FILAS && c+2 > 0 && c+2 < COLUMNAS && currentState.tablero[f+2][c+2] == currentState.turn){
            conts[1]++;
            if(f+3 > 0 && f+3 < FILAS && c+3 > 0 && c+3 < COLUMNAS && currentState.tablero[f+3][c+3] == currentState.turn){
                conts[1]++;
                if(f+4 > 0 && f+4 < FILAS && c+4 > 0 && c+4 < COLUMNAS && currentState.tablero[f+4][c+4] == currentState.turn){
                    conts[1]++;
                }
            }
        }
    }
    if(f-1 > 0 && f-1 < FILAS && c-1 > 0 && c-1 < COLUMNAS && currentState.tablero[f-1][c-1] == currentState.turn){
        conts[1]++;
        if(f-2 > 0 && f-2 < FILAS && c-2 > 0 && c-2 < COLUMNAS && currentState.tablero[f-2][c-2] == currentState.turn){
            conts[1]++;
            if(f-3 > 0 && f-3 < FILAS && c-3 > 0 && c-3 < COLUMNAS && currentState.tablero[f-3][c-3] == currentState.turn){
                conts[1]++;
                if(f-4 > 0 && f-4 < FILAS && c-4 > 0 && c-4 < COLUMNAS && currentState.tablero[f-4][c-4] == currentState.turn){
                    conts[1]++;
                }
            }
        }
    }

    if(c+1 > 0 && c+1 < COLUMNAS && currentState.tablero[f][c+1] == currentState.turn){
        conts[2]++;
        if(c+2 > 0 && c+2 < COLUMNAS && currentState.tablero[f][c+2] == currentState.turn){
            conts[2]++;
            if(c+3 > 0 && c+3 < COLUMNAS && currentState.tablero[f][c+3] == currentState.turn){
                conts[2]++;
                if(c+4 > 0 && c+4 < COLUMNAS && currentState.tablero[f][c+4] == currentState.turn){
                    conts[2]++;
                }
            }
        }
    }
    if(c-1 > 0 && c-1 < COLUMNAS && currentState.tablero[f][c-1] == currentState.turn){
        conts[2]++;
        if(c-2 > 0 && c-2 < COLUMNAS && currentState.tablero[f][c-2] == currentState.turn){
            conts[2]++;
            if(c-3 > 0 && c-3 < COLUMNAS && currentState.tablero[f][c-3] == currentState.turn){
                conts[2]++;
                if(c-4 > 0 && c-4 < COLUMNAS && currentState.tablero[f][c-4] == currentState.turn){
                    conts[2]++;
                }
            }
        }
    }

    if(f+1 > 0 && f+1 < FILAS && c-1 > 0 && c-1 < COLUMNAS && currentState.tablero[f+1][c-1] == currentState.turn){
        conts[3]++;
        if(f+2 > 0 && f+2 < FILAS && c-2 > 0 && c-2 < COLUMNAS && currentState.tablero[f+2][c-2] == currentState.turn){
            conts[3]++;
            if(f+3 > 0 && f+3 < FILAS && c-3 > 0 && c-3 < COLUMNAS && currentState.tablero[f+3][c-3] == currentState.turn){
                conts[3]++;
                if(f+4 > 0 && f+4 < FILAS && c-4 > 0 && c-4 < COLUMNAS && currentState.tablero[f+4][c-4] == currentState.turn){
                    conts[3]++;
                }
            }
        }
    }
    if(f-1 > 0 && f-1 < FILAS && c+1 > 0 && c+1 < COLUMNAS && currentState.tablero[f-1][c+1] == currentState.turn){
        conts[3]++;
        if(f-2 > 0 && f-2 < FILAS && c+2 > 0 && c+2 < COLUMNAS && currentState.tablero[f-2][c+2] == currentState.turn){
            conts[3]++;
            if(f-3 > 0 && f-3 < FILAS && c+3 > 0 && c+3 < COLUMNAS && currentState.tablero[f-3][c+3] == currentState.turn){
                conts[3]++;
                if(f-4 > 0 && f-4 < FILAS && c+4 > 0 && c+4 < COLUMNAS && currentState.tablero[f-4][c+4] == currentState.turn){
                    conts[3]++;
                }
            }
        }
    }

    let win = false;
    conts.forEach((e,i) => {
        if(e >= 4){
            win = true;
        }
    });
    return win;
}

function initServerConnection(){
    socket = io.connect(WEBSOCKETSERVER);
    socket.on('getCounter', setPlayers);
    socket.on('updateCurrentState', serverState => {
        currentState = serverState;
    });
    socket.on('start', onStart);
    socket.on('tirada', tirarFicha);
    socket.on('endGame', finish);
}

function setPlayers(serverCounter) {
    switch (serverCounter) {
        case 1: // Es la primera llamada
            registerPlayer(playerA, playerB, 0, 1);
            console.log('Esperando rival...');
            break;
        case 2: // Es la segunda llamada
            if(currentState.players[0].id != socket.id){
                registerPlayer(playerB, playerA, 1, 0);
            }  
            // Ambos jugadores
            console.log('Comenzamos el juego');
            currentState.turn = 0;
            onStart();
            delete currentState.players[0].id;
            delete currentState.players[1].id;
            socket.emit('updateCurrentState', currentState);
            break;
    }
}

function registerPlayer(local, remote, localIndex, remoteIndex) {
    localPlayer = local;
    remotePlayer = remote;
    localPlayerIndex = localIndex;
    remotePlayerIndex = remoteIndex;

    localPlayer.id = socket.id;

    currentState.players[localIndex] = localPlayer;
    currentState.players[remoteIndex] = remotePlayer;
}

function tirarFicha(f,c){
    console.log('Tiarda recibida pos: ', f, c);
    currentState.tablero[f-1][c] = currentState.turn;
    drawFicha(f, c, 26, 'black', currentState.players[currentState.turn].color);
    currentState.turn =  (currentState.turn == 0) ? currentState.turn = 1 : currentState.turn = 0;
    onStart();
    socket.emit('updateCurrentState', currentState);
}

function finish(turn){
    endGame = false;
    onStart();
    if(turn == localPlayerIndex)
        document.getElementById('msg-turn').innerHTML = 'Lo siento. ¡Has perdido!';
}

initServerConnection();