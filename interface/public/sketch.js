let mic, fft;
let ii = 0;

function setup() {
  createCanvas(window.innerWidth, 400);
  noFill();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background('#333333');

  let spectrum = fft.analyze();

  stroke('#DEDEDE');
  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(map(i, 0, spectrum.length, 0, width), map(spectrum[i], 0, 255, height, 0));
  }
  endShape();
}

function touchStarted() {
  if (getAudioContext().state !== 'running')
    getAudioContext().resume();
}

window.addEventListener('resize', function() {
    resizeCanvas(window.innerWidth, 400);
});

window.addEventListener('close', function() {
  mic.stop();
})
