$(function() {
  
  if (sessionStorage.getItem('popup') === 'closed') {
    $('.info-header').removeClass('show');
  } else {
    $('.info-header').addClass('show');
  }
})
$(document).ready(function () {
  
  $('#banner-close').click(function() {
    $('.info-header').removeClass('show');
    setTimeout(function() {
      $('.info-header').css({ "display" : "none" })
    }, 300)
    sessionStorage.setItem('popup', 'closed')
  })
})