// ARTICLE  TAB
// Using Bootstrap Custom

$(function() {
  let tabsLink = document.querySelectorAll('.tabs-link')
  $('.tabs-link:first-child').tab('show').addClass('is-active');

  $(tabsLink).on('click', function(e) {
    e.preventDefault;
    $(this).tab('show')
    $(tabsLink).removeClass('is-active');
    $(this).addClass('is-active');
  })
}) 
  
// ARTICLE ACCORDION

$(function() {
  let acc = document.getElementsByClassName("accordion");

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
    // if (acc[i].tagName == 'BUTTON') {
    //   acc[i].addEventListener("click", function() {
    //     this.classList.toggle("active")
    //     let parent = this.parentElement
    //     let panel = parent.nextElementSibling
    //     if (panel.style.maxHeight) {
    //       panel.style.maxHeight = null;
    //     } else {
    //       panel.style.maxHeight = panel.scrollHeight + "px";
    //     } 
    //   })
    // } else {
    //   acc[i].addEventListener("click", function() {
    //     this.classList.toggle("active");
    //     var panel = this.nextElementSibling;
    //     if (panel.style.maxHeight) {
    //       panel.style.maxHeight = null;
    //     } else {
    //       panel.style.maxHeight = panel.scrollHeight + "px";
    //     } 
    //   });
    // }
  }
})

// Lightbox

$(function() {
  let $target = $('.article-body img');
  let $lightbox = $('#lightbox')
  let $content = $('.lightbox-content')

  if (solafidConfig.lightbox === 'true') {
    $target.on('click', function() {
      $lightbox.css({'display' : 'block'})
      let $src = $(this).attr('src')
      let $alt = $(this).attr('alt')
      $content.attr('src', $src)
      $content.attr('alt', $alt)
      $('body').addClass('modal-open')
    })

    let $close = $('.close')
    $close.on('click', function() {
      $lightbox.css({'display' : 'none'})
      $('body').removeClass('modal-open')
    })
  } else {
    $target.css({'cursor' : 'default'})
  }
})