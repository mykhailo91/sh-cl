async function loadVideo(ids) {
  let idsArr = ids.split(',')
  let container = document.querySelector('.site-video-items')

  for (let id of idsArr) {
    try {
      let data = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
        });
  
      let videoBlock = createElementFromTemplate(id, data);
  
      container.appendChild(videoBlock);
    } catch (error) {
      console.error(`Error fetching ID ${id}:`, error);
      continue;
    }
  }

  // Gets the video src from the data-src on each button
  var $videoSrc;  
  $('.site-video-item').click(function() {
      $videoSrc = $(this).data( "src" );
      // //console.log($videoSrc)
  });

  // when the modal is opened autoplay it  
  $('#video-modal').on('shown.bs.modal', function (e) {
      
  // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
  $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
  })
    
  // stop playing the youtube video when I close the modal
  $('#video-modal').on('hide.bs.modal', function (e) {
      // a poor man's stop video
      $("#video").attr('src',$videoSrc); 
  }) 
}
  
function createElementFromTemplate(id, item) {
    const template = document.querySelector('#video-block')
    const videoBlock = template.content.cloneNode(true)
  
    videoBlock.querySelector('.site-video-item').dataset.src = `https://www.youtube.com/embed/${id}`
    videoBlock.querySelector('.site-video-item').style.order = "-1"
    videoBlock.querySelector('.site-video-title').innerText = item.title
    videoBlock.querySelector('.site-video-icon').style.backgroundImage = `url(${item.thumbnail_url})`
  
    return videoBlock
}
// async function pageResize() {
//   $(window).resize(function(){ 
//     location.reload();
//   })
// }

async function carouselVideo() {
  let width = $(window).width();
  //console.log(width)
  if(width <= 1024 && width >=769) {
    let leftButton = document.querySelector("[data-action='slideLeft']");
    let rightButton = document.querySelector("[data-action='slideRight']");
    let carouselItem = document.getElementsByClassName('carousel-item');
    let divLength = Math.ceil(carouselItem.length / 3);
    //console.log(divLength)
    let l = 0;
    rightButton.addEventListener("click", function() {
      l++
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength - 1) *940	
          i.style.left = `${0 - Transform}px`
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*940;
          i.style.left = `${0 - Transform}px`
        }
      }
    })
    leftButton.addEventListener("click", function() {
      l--; 
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength-1)*940
          i.style.left = `${0 - Transform}px`
        }
      }else if(l == 0 || l < 0){
        l = 0;
        for(var i of carouselItem)
        {
          i.style.left = "0px"
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*940;	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
  } else if(width <= 768 && width >=426) {
    let leftButton = document.querySelector("[data-action='slideLeft']");
    let rightButton = document.querySelector("[data-action='slideRight']");
    let carouselItem = document.getElementsByClassName('carousel-item');
    let divLength = Math.ceil(carouselItem.length / 2);
    //console.log(divLength)
    let l = 0;
    rightButton.addEventListener("click", function() {
      l++
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength - 1) *696	
          i.style.left = `${0 - Transform}px`
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*696;
          i.style.left = `${0 - Transform}px`
        }
      }
    })
    leftButton.addEventListener("click", function() {
      l--; 
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength-1)*696
          i.style.left = `${0 - Transform}px`
        }
      }else if(l == 0 || l < 0){
        l = 0;
        for(var i of carouselItem)
        {
          i.style.left = "0px"
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*696;	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
  } else if(width <=425 && width >=376) {
    let leftButton = document.querySelector("[data-action='slideLeft']");
    let rightButton = document.querySelector("[data-action='slideRight']");
    let carouselItem = document.getElementsByClassName('carousel-item');
    let divLength = Math.ceil(carouselItem.length / 1);
    //console.log(divLength)
    let l = 0;
    rightButton.addEventListener("click", function() {
      l++
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength - 1) *365	
          i.style.left = `${0 - Transform}px`
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*365;
          i.style.left = `${0 - Transform}px`
        }
      }
    })
    leftButton.addEventListener("click", function() {
      l--; 
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength-1)*365
          i.style.left = `${0 - Transform}px`
        }
      }else if(l == 0 || l < 0){
        l = 0;
        for(var i of carouselItem)
        {
          i.style.left = "0px"
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*365;	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
  } else if(width <=375 && width >=326) {
    let leftButton = document.querySelector("[data-action='slideLeft']");
    let rightButton = document.querySelector("[data-action='slideRight']");
    let carouselItem = document.getElementsByClassName('carousel-item');
    let divLength = Math.ceil(carouselItem.length / 1);
    //console.log(divLength)
    let l = 0;
    rightButton.addEventListener("click", function() {
      l++
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength - 1) *315	
          i.style.left = `${0 - Transform}px`
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*315;
          i.style.left = `${0 - Transform}px`
        }
      }
    })
    leftButton.addEventListener("click", function() {
      l--; 
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength-1)*315
          i.style.left = `${0 - Transform}px`
        }
      }else if(l == 0 || l < 0){
        l = 0;
        for(var i of carouselItem)
        {
          i.style.left = "0px"
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*315;	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
  } else if(width <=325) {
    let leftButton = document.querySelector("[data-action='slideLeft']");
    let rightButton = document.querySelector("[data-action='slideRight']");
    let carouselItem = document.getElementsByClassName('carousel-item');
    let divLength = Math.ceil(carouselItem.length / 1);
    //console.log(divLength)
    let l = 0;
    rightButton.addEventListener("click", function() {
      l++
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength - 1) *265	
          i.style.left = `${0 - Transform}px`
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*265;
          i.style.left = `${0 - Transform}px`
        }
      }
    })
    leftButton.addEventListener("click", function() {
      l--; 
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          Transform = (divLength-1)*265
          i.style.left = `${0 - Transform}px`
        }
      }else if(l == 0 || l < 0){
        l = 0;
        for(var i of carouselItem)
        {
          i.style.left = "0px"
        }
      }else {
        for(var i of carouselItem)
        {
          Transform = l*265;	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
  }else {
    let leftButton = document.querySelector("[data-action='slideLeft']");
    let rightButton = document.querySelector("[data-action='slideRight']");
    let carouselItem = document.getElementsByClassName('carousel-item');
    let divLength = Math.ceil(carouselItem.length / 4);
    //console.log(divLength)
    let l = 0;
    rightButton.addEventListener("click", function() {
      l++
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          // //console.log($(window).width())
          Transform = (divLength - 1) *1110		
          ////console.log(Transform)	
          i.style.left = `${0 - Transform}px`
        }
      }else {
        for(var i of carouselItem)
        {
          ////console.log($(window).width())
          Transform = l*1110;
          ////console.log(Transform)	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
    leftButton.addEventListener("click", function() {
      l--; 
      //console.log(l)
      if(l == divLength || l > divLength){
        l = divLength - 1;
        for(var i of carouselItem)
        {
          ////console.log($(window).width())
          Transform = (divLength-1)*1110
          ////console.log(Transform)	
          i.style.left = `${0 - Transform}px`
        }
      }else if(l == 0 || l < 0){
        l = 0;
        for(var i of carouselItem)
        {
          ////console.log($(window).width())
          ////console.log("0")	
          i.style.left = "0px"
        }
      }else {
        for(var i of carouselItem)
        {
          ////console.log($(window).width())
          Transform = l*1110;
          ////console.log(Transform)	
          i.style.left = `${0 - Transform}px`
        }
      }
    })
  }
}
