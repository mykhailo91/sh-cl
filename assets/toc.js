function tableOfContent(headingSelector) {
  var articleBody = document.querySelector('.article-body');
  var tableOfContents = document.getElementById('table-of-content');

  // Get article content headings
  var headings = Array.prototype.slice.call(articleBody.querySelectorAll(headingSelector));
  // Add an ID to each heading if they don't already have one
  Array.prototype.forEach.call(headings, function(heading, index) {
    heading.id = heading.id.replace(/[^A-Z0-9]+/ig, "_") || heading.outerText.replace(/[^A-Z0-9]+/ig, "_") + index;
  });

  // Only include headings with an ID
  headings = headings.filter(function(heading) {
    return heading.id
  });

  // Render the list
  var html = headings.map(function(heading) {
    return (
      '<li id = "' + heading.outerText + '">' + 
        '<a href="#' + heading.id + '">' +
          heading.childNodes[0].textContent +
        '</a>' + 
      '</li>'
    );
  }).join('');

  tableOfContents.insertAdjacentHTML('afterbegin', html);
  
  // Hide TOC when empty
  if(tableOfContents.innerHTML.trim().length == 0) {
    $('.quick-block').hide();
  }

  $('a[href^="#"]').click(function( event ) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - 100 }, 500);
  });
}