let online = true;

// define sample files
const files = [
  "pack-1/0 - A.wav", "pack-1/1 - D.wav", "pack-1/2 - E.wav", "pack-1/3 - F Sharp.wav", "pack-1/4 - G.wav", "pack-1/5 - A.wav", "pack-1/6 - B.wav",
  "pack-1/6 - B.wav",
];
let sounds = Array(files.length);


// P5.js sound analyzer
// visualization uses this
let fft;
// visualization parameters
let spectrum, energy, size;


// playing with keyboard
document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  if(online == true){
    switch (keyName) {
      case 'a':
        socket.emit("send-data", {"sample": 0} );
        break;
      case 's':
        socket.emit("send-data", {"sample": 1} );
        break;
      case 'd':
        socket.emit("send-data", {"sample": 2} );
        break;
      case 'f':
        socket.emit("send-data", {"sample": 3} );
        break;
      case 'g':
        socket.emit("send-data", {"sample": 4} );
        break;
      case 'h':
        socket.emit("send-data", {"sample": 5} );
        break;
      case 'j':
        socket.emit("send-data", {"sample": 6} );
        break;
    }
    
  } else {
    // if connection to server is not established, we just play sounds locally
    switch (keyName) {
      case 'a':
           playSample(0);
          break;
      case 's':
           playSample(1);
          break;
      case 'd':
           playSample(2);
          break;
      case 'f':
           playSample(3);
          break;
      case 'g':
           playSample(4);
          break;
      case 'h':
            playSample(5);
          break;
      case 'j':
            playSample(6);
          break;
    }
  }
});

// playing with touch

const keys = document.querySelectorAll(".key");

keys.forEach((key, idx) => {
  key.addEventListener('click', () => {
    socket.emit("send-data", {"sample": idx} );
  });
});



function recieveData(data){
  playSample(data.sample);
}


// play sample file
function playSample(s){
  sounds[s].play();
}


// preload music sample files and add them to sounds array
function preloadSampleFiles() {
  soundFormats('mp3', 'ogg');
  for (let i = 0; i < files.length; ++i){
    sounds[i] = loadSound("./samples/" + files[i]);
  }
}



function setup() {
  createCanvas(windowWidth, windowHeight*0.8)

  // https://p5js.org/reference/#/p5.FFT
  fft = new p5.FFT();
  fft.smooth();

  preloadSampleFiles();
}



// visualization
function draw() {
  blendMode(BLEND);
  background(10,5,20);
  blendMode(LIGHTEST);
  noFill();

  spectrum = fft.analyze();
  energy = fft.getEnergy(100, 255);
  size = map(energy, 0, 255, energy*0.2, windowHeight*0.8);

  stroke('hsla(0, 80%, 100%, 0.5)');
  strokeWeight(size*0.05);
  circle(windowWidth*0.5, windowHeight*0.4, size);
}


// helper functions
// allows browser to play sounds
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
// handles browser resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight*0.8, false);
}