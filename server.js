console.log("My server is running");

var express = require('express');
var app = express();
var users = [];
var matches = [];
var finishedMatches = [];
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

var Datastore = require('nedb');
var db = new Datastore({filename: "projects.json", autoload: true});
app.set("view engine", "ejs");

// app.get('/', function(req, res) {

// });

// app.get('/banana', function(req, res) {
//     // var dataWrapper;
//     db.find({}, function(err, docs) {
//         // console.log(docs);
//         // dataWrapper = {data: docs};
//         // console.log(dataWrapper);
//         res.render("projects.ejs",{person: docs});
//     });
// });

// app.get('/templatetest', function(req, res) {
//     var hello = {person: [{"name":"Virtual Physicality","description":"Using PoseNet--a machine learning model that reads camera data and guesses where there are key points denoting the position of human body parts--I created a sketch that would read camera data from the user, and use the position of their head and hands to interact with a 3D environment being rendered in real time. I plugged position data from the users’ body so that the 3D camera would translate their head movements to emulate actual 3D movement within the environment. This mimics the way we interact with actual objects in real life, and invites the user to take part in and explore the interaction. In doing so, this allows the user to explore a relationship they usually only share with physical objects, and share it with a virtual environment. Try it <a href='https://editor.p5js.org/butterbaby4427/full/nQAHyB9L5'>here","date":"January, 2020"},{"name":"Motion Graphics","description":"Beginning the summer of 2020, I started putting aside some free time to design and render motion graphics animations in Blender on my laptop. To hone the software skills I’ve developed at school, I’ve been learning 3D design and shading by creating short animations inspired by nature, mathematics, and code. see more <a href='https://www.instagram.com/angelotiu/'>here</a>","date":"January, 2020"}]};
//     res.render('projects.ejs', hello);
// });

function newConnection(socket){
    users.push(new user(socket,false));
    socket.emit('connected');
    console.log("new connection! " + socket.id);

    socket.on('connected', checkRumble);
    socket.on('checkRumble', checkRumble);
    socket.on("fighting", disableRumble);
    socket.on("fightDone", enableRumble);
    socket.on("jankenpon", jankenpon);

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
    function jankenpon(data){
        var found = false;
        for(var i = 0; i<users.length; i++){
            if (users[i].socket.id === data.enemyID){
                tempPlayer = users[i].socket;
            }
        }
        found = false;
        for(var i = 0; i < finishedMatches.length; i++){
            if (finishedMatches[i].player1 === tempPlayer){
                found = true;
                finishedMatches[i].player2 = socket;
                finishedMatches[i].player2hand = data.hand;
                io.to(finishedMatches[i].player1.id).emit("result",jankenponLogic(finishedMatches[i].player1hand,finishedMatches[i].player2hand));
                io.to(finishedMatches[i].player2.id).emit("result",jankenponLogic(finishedMatches[i].player2hand,finishedMatches[i].player1hand));
            } 
        }
        if (found === false){
            finishedMatches.push(new match(socket,null,data.hand));
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
        io.to(matches[i].player1.id).emit("fight",matches[i].player2.id);
        io.to(matches[i].player2.id).emit("fight",matches[i].player1.id);
    }
}

function jankenponLogic(hand1,hand2){
    var returnValue = "DRAW";
    switch(hand1){
        case "rock":
            switch(hand2){
                case "rock":
                    returnValue = "DRAW";
                    break;
                case "scissors":
                    returnValue = "WINNER";
                    break;
                case "paper":
                    returnValue = "LOSER";
                    break;
            }
            break;
        case "scissors":
            switch(hand2){
                case "rock":
                    returnValue = "LOSER";
                    break;
                case "scissors":
                    returnValue = "DRAW";
                    break;
                case "paper":
                    returnValue = "WINNER";
                    break;
            }
            break;
        case "paper":
            switch(hand2){
                case "rock":
                    returnValue = "WINNER";
                    break;
                case "scissors":
                    returnValue = "LOSER";
                    break;
                case "paper":
                    returnValue = "DRAW";
                    break;
            }
            break;
    }
    return returnValue;
}

class user{
    constructor(socket,rumble){
        this.socket = socket;
        this.rumble = rumble;
    }
}

class match{
    constructor(player1,player2,player1hand = ""){
        this.player1=player1;
        this.player1hand = player1hand;
        this.player2=player2;
        this.player2hand = "";
    }
}