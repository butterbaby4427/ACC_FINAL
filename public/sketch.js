
var socket;
var rumble = false;
var ready;

function preload(){

}

function setup() {
  ready = document.createElement("INPUT");
  ready.setAttribute("type", "radio");
  ready.onclick = readyPressed;
  createCanvas(windowWidth, windowHeight-25);
  // HMMMM.....
  socket = io.connect('http://157.230.83.178:3000');
  background(220);

  // handle the broadcast calls coming from the server
  socket.on('connected',connected);
}

function draw() {
}

function connected(){
  socket.emit("connected",rumble);
}

readyPressed(){
  rumble = ready.value;
  socket.emit("checkRumble",rumble);
}
