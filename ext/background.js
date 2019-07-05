$(window).on('load', () => {
  let socket = io( 'http://localhost:5051' );
  socket.on('data.update.extension', function(msg) {
    console.log(msg, 'msg');
  })
  // $('body').find('div').each((index, element) => {
    // console.log(element, index);
    // $(element).css({
      // transform: 'translate(100px, 100px)'
    // });
  // })
})