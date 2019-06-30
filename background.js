$(window).on('load', () => {
  $('body').find('div').each((index, element) => {
    console.log(element, index);
    $(element).css({
      transform: 'translate(100px, 100px)'
    });
  })
})