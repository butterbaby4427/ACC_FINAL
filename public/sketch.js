// const { rejects } = require("assert/strict");
// const { text } = require("express");

var timer=5;
var socket;
var rumble = false;
var ready;
var canvas;

var rumbling = false;
var hand;
var hands = ["rock","paper","scissors"];
var scene = 0;
const BUTTON_SIZE = 100;

function preload(){

}
function mouseClicked(){
  for(var i = 0; i < 4; i++){
    if (mouseX > (i+1)*width/4-BUTTON_SIZE/2 && mouseX < (i+1)*width/4+BUTTON_SIZE/2 && mouseY > height/2+200 && mouseY < height/2+200 + BUTTON_SIZE){
      hand = hands[i];
      console.log("hand = "+hand);
    }
  }
}
function setup() {
  
  noStroke();
  textSize(100);
  textAlign(CENTER, CENTER);
  ready = document.getElementById("ready");
  ready.onclick = readyPressed;
  canvas = createCanvas(windowWidth, windowHeight);
  // HMMMM.....
  socket = io.connect('localhost:3001');
  //socket = io.connect('aet.imany.io:3001');
  background(220);

  // handle the broadcast calls coming from the server
  socket.on('connected',connected);

  socket.on('fight',fight);
}

function draw() {
  background(220);
  noStroke();
  textSize(75);
  switch(scene){
    case 0:
      text(timer, width/2, height/2);
      if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        timer --;
      }
      if (timer <= 0) {
        timer = 15;
        scene++;
      }
      break;
    case 1:
      var counter = 0;
      for(var i=width/4;i<width;i=i+width/4){
        rect(i-BUTTON_SIZE/2,height/2+200,BUTTON_SIZE,BUTTON_SIZE);
        push();
        textAlign(CENTER, CENTER);
        textSize(32);
        text(hands[counter],i,height/2+225);
        pop();
        if (hand === hands[counter]){
          push();
          noFill();
          stroke(255,0,0);
          strokeWeight(3);
          rect(i-BUTTON_SIZE/2,height/2+200,BUTTON_SIZE,BUTTON_SIZE);
          pop();
        }
        counter++;
      }
      text("CHOOSE YOUR HAND", width/2, height/2-120);
      text(timer, width/2, height/2);
      if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        timer --;
      }
      if (timer <= 0) {
        timer = 15;
        scene++;
        jankenpon();
      }
  }
}



function connected(){
  socket.emit("connected",rumble);
}

function jankenpon(){
  socket.emit("jankenpon",hand);
}

function readyPressed(){
  console.log(ready.checked);
  rumble = ready.checked;
  socket.emit("checkRumble",rumble);
}

function fight(){
  socket.emit("fighting");
  console.log("fighting");
  canvas.style("display","block");
  scene = 0;
  timer = 3;
  hand = null;
}

function notFight(){
  console.log("fight over");
  canvas.style("display","none");
  socket.emit("fightDone");
}