console.log("My server is running");

var express = require('express');
var app = express();
var users = [];
var matches = [];
var tempPlayer;

// create our server
var port = process.env.PORT || 3001;
var server = app.listen(port);

// have my application use files in the public folder
app.use(express.static('public'));
var socket = require('socket.io');

setInterval(matchMake,1000*10);

// create a variable that keeps track of inputs and outputs
var io = socket(server);
io.sockets.on('connection', newConnection);
io.sockets.on('disconnect', newDisconnection);

function newConnection(socket){
    users.push(new user(socket,false));
    socket.emit('connected');
    console.log("new connection! " + socket.id);

    socket.on('connected', checkRumble);
    socket.on('checkRumble', checkRumble);
    socket.on("fighting", disableRumble);
    socket.on("fightDone", enableRumble);

    function checkRumble(rumble){
        // THIS CHECKS OUT, MOVE ON
        if (rumble === true){
            for(var i = 0; i<users.length; i++){
                if (socket === users[i].socket){
                    users[i].rumble = true;
                }
            }
        } else{
            for(var i = 0; i<users.length; i++){
                if (socket === users[i].socket){
                    users[i].rumble = false;
                }
            }
        }
    }
    function disableRumble(){
        console.log("rumble disabled");
        for(var i = 0; i<users.length; i++){
            if (socket === users[i].socket){
                users[i].rumble = false;
            }
        }
    }
    function enableRumble(){
        for(var i = 0; i<users.length; i++){
            if (socket === users[i].socket){
                users[i].rumble = true;
            }
        }
    }
}

function newDisconnection(socket){
    console.log("socket disconnected: "+socket.id);
    for(var i = 0; i<users.length; i++){
        if (socket === users[i].socket){
            users.splice(i,1);
        }
    }
}

function matchMake(){ //THIS CHECKS OUT -- MOVE ON
    matches = [];
    tempPlayer = null;
    for(var i = 0; i < users.length; i++){
        if (users[i].rumble===true){
            if(tempPlayer === null){
                tempPlayer = users[i].socket;
            } else {
                matches.push(new match(tempPlayer,users[i].socket));
                tempPlayer = null;
            }
        }
    }
    for (var i = 0; i<matches.length; i++){
        io.to(matches[i].player1.id).emit("fight");
        io.to(matches[i].player2.id).emit("fight");
    }
}

class user{
    constructor(socket,rumble){
        this.socket = socket;
        this.rumble = rumble;
    }
}

class match{
    constructor(player1,player2){
        this.player1=player1;
        this.player2=player2;
    }
}