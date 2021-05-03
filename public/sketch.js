
var socket;
var rumble = false;
var ready;

function preload(){

}

function setup() {
  ready = document.getElementById("ready");
  ready.onclick = readyPressed;
  //createCanvas(windowWidth, windowHeight-25);
  // HMMMM.....
  socket = io.connect('localhost:3001');
  //background(220);

  // handle the broadcast calls coming from the server
  socket.on('connected',connected);
}

function draw() {
}

function connected(){
  socket.emit("connected",rumble);
}

function readyPressed(){
  console.log(ready.checked);
  rumble = ready.checked;
  socket.emit("checkRumble",rumble);
}
