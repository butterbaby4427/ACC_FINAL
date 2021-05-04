
var socket;
var rumble = false;
var ready;
var canvas;
var rumbling = false;

function preload(){

}

function setup() {
  ready = document.getElementById("ready");
  ready.onclick = readyPressed;
  canvas = createCanvas(windowWidth, windowHeight);
  // HMMMM.....
  socket = io.connect('localhost:3001');
  background(220);

  // handle the broadcast calls coming from the server
  socket.on('connected',connected);

  socket.on('fight',fight);
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

function fight(){
  console.log("fighting");
  canvas.style("display","block");
}
