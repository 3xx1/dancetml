$(window).on('load', () => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
  $('body').find('div').each((index, element) => {
    // console.log(element, index);
    $(element).css({
      // transform: 'translate(100px, 100px)'
    });
  })
})

var handleSuccess = function(stream) {
  var context = new AudioContext();
  var source = context.createMediaStreamSource(stream);
  var processor = context.createScriptProcessor(1024, 1, 1);

  source.connect(processor);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    // Do something with the data, i.e Convert this to WAV
    // console.log(e.inputBuffer);
  };
};