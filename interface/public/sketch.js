let mic, fft;
let isSampleRangeInEdit = false;
let hotsampleRanges = [
  {
    min: 1,
    max: 10
  },
  {
    min: 30, 
    max: 50
  },
  {
    min: 80,
    max: 110
  },
  {
    min: 150,
    max: 200
  }
]
let socket = io( 'http://localhost:5051' );

function setup() {
  var canvas = createCanvas(window.innerWidth, 400);
  canvas.parent('p5__sketch');
  noFill();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background('#333333');

  // spectrum
  let spectrum = fft.analyze();
  stroke('#DEDEDE');
  noFill();
  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(map(i, 0, spectrum.length, 0, width), map(spectrum[i], 0, 255, height, 0));
  }
  endShape();

  // handles
  for (i = 0; i < hotsampleRanges.length; i++) {
    ellipse(map(hotsampleRanges[i].min, 0, spectrum.length, 0, width), height-4, 8, 8);
    ellipse(map(hotsampleRanges[i].max, 0, spectrum.length, 0, width), height-4, 8, 8);
  }

  // areas
  noStroke();
  for (i = 0; i < hotsampleRanges.length; i++) {
    fill(map(i, 0, hotsampleRanges.length, 100, 200), 180, map(i, 0, hotsampleRanges.length, 240, 60), 120);
    rect(map(hotsampleRanges[i].min, 0, spectrum.length, 0, width), 0, map(hotsampleRanges[i].max - hotsampleRanges[i].min, 0, spectrum.length, 0, width), height);
  }

  // range update
  if (isSampleRangeInEdit) {
    let closest = -1;
    let _dist = 20;
    for (i = 0; i < hotsampleRanges.length; i++) {
      if (_dist > dist(mouseX, mouseY, map(hotsampleRanges[i].min, 0, spectrum.length, 0, width), height)){
        _dist = dist(mouseX, mouseY, map(hotsampleRanges[i].min, 0, spectrum.length, 0, width), height);
        closest = i*2;
      }
      if (_dist > dist(mouseX, mouseY, map(hotsampleRanges[i].max, 0, spectrum.length, 0, width), height)){
        _dist = dist(mouseX, mouseY, map(hotsampleRanges[i].max, 0, spectrum.length, 0, width), height);
        closest = i*2 + 1;
      }
    }
    if (~closest) {
      let isMaxClosest = closest % 2;
      if (isMaxClosest) {
        hotsampleRanges[(closest - 1)/2].max = Math.round(map(mouseX, 0, width, 0, spectrum.length));
      } else {
        hotsampleRanges[closest/2].min = Math.round(map(mouseX, 0, width, 0, spectrum.length));
      }
    }
  }

  // value update
  let data = [0, 0, 0, 0];
  for (i = 0; i < hotsampleRanges.length; i++) {
    let avg = 0;
    for (ii = hotsampleRanges[i].min; ii <  hotsampleRanges[i].max; ii++) {
      avg += spectrum[ii] / (hotsampleRanges[i].max - hotsampleRanges[i].min);
    }
    if (avg > 0) {
      avg = avg.toFixed(2);
    } else {
      avg = 0;
    }
    data[i] = avg;
    $('#channel--' + i).find('span.value').html(avg);
  }
  socket.emit('data.update.interface', data);
}

setTimeout(() => {
  $('#p5__sketch')
    .on('mousedown', function() {
      isSampleRangeInEdit = true;
    })
    .on('mouseup', function() {
      isSampleRangeInEdit = false;
    });
});

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
