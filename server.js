console.log("My server is running");

var express = require('express');
var app = express();
var users = [];

// create our server
var port = process.env.PORT || 3000;
var server = app.listen(port);

// have my application use files in the public folder
app.use(express.static('public'));
var socket = require('socket.io');

// create a variable that keeps track of inputs and outputs
var io = socket(server);
io.sockets.on('connection', newConnection);
io.sockets.on('disconnect', newDisconnection);

function newConnection(socket){
    users.push(new user(socket,false));
    socket.emit('connected');
    console.log("new connection! " + socket.id);

    socket.on('connected', checkRumble);
    socket.on('checkRumble', checkRumble)

    function checkRumble(rumble){
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
}

function newDisconnection(socket){
    console.log("socket disconnected: "+socket.id);
    for(var i = 0; i<users.length; i++){
        if (socket === users[i].socket){
            users.splice(i,1);
        }
    }
}

class user(){
    constructor(socket,rumble){
        this.socket = socket;
        this.rumble = rumble;
    }
}