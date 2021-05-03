// client code
// frontend

var socket;

// var buttonSmall, buttonLarge, buttonNormal;
var emoji;
var hue = 100;
var slider;
var wavySize;
var counter = 0;

function preload(){
  emoji = loadImage('images/DEEP_FRIED_CRY.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight-25);

  // this connects the front end code to the socket communications
  socket = io.connect('http://157.230.83.178:3000');
  
  background(220);

  // handle the broadcast calls coming from the server
  socket.on('yourHue',changeHue);
  socket.on('circle', newCircleDrawing);
  socket.on('emoji', newEmojiDrawing);

  circleSize = 25;
  // buttonSmall = select('#smaller');
  // buttonLarge = select('#larger');
  // buttonNormal = select('#normal');

  // buttonSmall.mousePressed( makeSmaller );
  // buttonLarge.mousePressed( makeLarger );
  // buttonNormal.mousePressed( makeNormal );

  colorMode(HSB);
  noStroke();
  angleMode(DEGREES);
  slider = createSlider(0,360,0); //BRUSH SIZE SLIDER
}

function newCircleDrawing(data){
    if (data.counter % 2 == 0){
      fill(data.hue, 100, 100);
    }else{
      fill((data.hue-20)%100,100,100);
    }
  ellipse(data.x, data.y, data.size, data.size);
}

function newEmojiDrawing(data){
    image(emoji, data.x, data.y, 80, 80);
}

function draw() {
}

// will activate whenever you click and drag
function mouseDragged(){
  wavySize = (map(slider.value(),0,360,15,50))*sin(counter*10)+25;
  if (counter % 2 == 0){
    fill(hue, 100, 100);
  }else{
    fill((hue-20)%100,100,100);
  }

  ellipse(mouseX, mouseY, wavySize, wavySize);

  // data is what sockets will send to other clients
  // object literal notation
  var data = {
    x: mouseX,
    y: mouseY,
    size: wavySize,
    hue: hue,
    counter: counter
  };

  socket.emit('circle', data);
  counter++;
}

function mouseClicked(){
  image(emoji, mouseX-40, mouseY-40, 80, 80);

  var data = {
    x: mouseX-40,
    y: mouseY-40,
  };

  socket.emit('emoji', data);
}

function changeHue(data){
  hue = data;
}
