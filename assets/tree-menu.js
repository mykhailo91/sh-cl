let expiryBuffer =  1800000; //60 * 30 * 1000 millisecond = 30 Minutes
let localStoragePrefix = "menu-tree-data";

let categoriesPrefix = "menu-tree-category";
let sectionsPrefix = "menu-tree-section";
let articlePrefix = "menu-tree-article";

let currentItemClass = "current-item";
let currentItemParentClass = "current-item-parent";
let mainParent =  null;

async function getDataFromUrl(url, dataField){
  let returnData = {};
  let response = await fetch(url);
  let responseJson = await response.json();
  responseJson[dataField].map(dataSingle=>{
    returnData[dataSingle.id] = dataSingle;
  });

  if (responseJson.next_page) {
    let nextPage = await getDataFromUrl(responseJson.next_page,dataField);
    return {...returnData,...nextPage};
  } else {
    return returnData;
  }
}

async function setAllData(locale = 'en-us'){
  let categoriesPromise = getDataFromUrl(`/api/v2/help_center/${locale}/categories`,'categories');
  let sectionsPromise = getDataFromUrl(`/api/v2/help_center/${locale}/sections`,'sections');

  let [categories,sections] = await Promise.all([categoriesPromise,sectionsPromise]).catch(err=>{
    console.error("Error occured in fetching data",err);
  });

  let subSections = {};
  let subSubSections = {};
  let subSubSubSections = {};
  let subSubSubSubSections = {};

  for (let [key, value] of Object.entries(sections)) {
    if(value.parent_section_id){
      subSections[value.id] = value;
      delete sections[key];
    }
  }

  for (let [key, value] of Object.entries(subSections)) {
    if(value.parent_section_id && subSections[value.parent_section_id]){
      subSubSections[value.id] = value;
      delete subSections[key];
    }
  }
  for (let [key, value] of Object.entries(subSubSections)) {
    if(value.parent_section_id && subSubSections[value.parent_section_id]){
      subSubSubSections[value.id] = value;
      delete subSubSections[key];
    }
  }
  for (let [key, value] of Object.entries(subSubSubSections)) {
    if(value.parent_section_id && subSubSubSections[value.parent_section_id]){
      subSubSubSubSections[value.id] = value;
      delete subSubSubSections[key];
    }
  }

  let now = new Date();
  let storageData = {
    categories,
    sections,
    subSections,
    subSubSections,
    subSubSubSections,
    subSubSubSubSections,
    expiry : now.getTime() + expiryBuffer
  }
  localStorage.setItem(`${localStoragePrefix}-${locale}`, JSON.stringify(storageData));
  
  return storageData;
}

// Function for getting URL data and return its type and ID
function getCurrentUrlData(){
  let returnData = {
    type : null,
    id : null
  };
  let pathArray = window.location.pathname.split("/");
  pathArray = pathArray.slice(3);
  
  if(pathArray[0] && pathArray[1]){
    // Get current page ID to mark the active element
    let currentId = document.getElementById('current-id')
    if (currentId) {
      currentId = currentId.dataset.id
    } else {
      currentId = parseInt(pathArray[1].replace(/(^\d+)/i,'$1'))
    }
    returnData.type = pathArray[0];
    returnData.id = currentId;
  }

  return returnData;
}

function getIdFromBreadcrumb() {
  let breadcrumb = document.querySelector('.site-header ol.breadcrumbs')
  if (breadcrumb) {
    let idArr = []
    let breadcrumbItem = breadcrumb.querySelectorAll('li')
    breadcrumbItem.forEach((item) => {
      let anchor = item.querySelector('a')
      if (anchor) {
        let path = anchor.href.split('/')[6]
        if (path) {
          let id = path.split('-')[0]
          idArr.push(id)
        }
      }
    })
    return idArr
  }
}

// Function for getting breadcrumb data and return its type and ID
function getCurrentBreadcrumbData() {
  let breadcrumb = document.querySelector('.site-header ol.breadcrumbs')
  if (breadcrumb) {
    let returnData = {}
    let pathElement = breadcrumb.querySelector('li:last-child')
    let pathUrl = pathElement.querySelector('a').href
    let pathArray = pathUrl.split("/");
    pathArray = pathArray.slice(5)
    
    if (pathArray[0] && pathArray[1]) {
      let pathType = pathArray[0]
      switch (pathType) {
        case "categories":
          pathType = "category"
          break;
        case "sections":
          pathType = "section"
      }
      returnData.type = pathType;
      returnData.id = parseInt(pathArray[1].replace(/(^\d+)/i,'$1'))
    }

    return returnData;
  }
}

function setActiveLi(urlData, locale) {
  let prefix = null;
  let idArr = getIdFromBreadcrumb()
  console.log(idArr)
  idArr.forEach((id, index) => {
    let element = document.getElementById(`menu-tree-section-${id}`)
    if (index == 0) {
      element = document.getElementById(`menu-tree-category-${id}`)
    }
    if (element) {
      element.classList.add(currentItemParentClass)
    }
  })
  // // set prefix from URL
  // if(urlData.type == 'categories'){
  //   prefix = categoriesPrefix;
  // } else if(urlData.type == 'sections'){
  //   prefix = sectionsPrefix;
  // } else if (urlData.type == 'articles'){
  //   prefix = articlePrefix;
  // }

  // if(prefix){
  //   let currentItem = document.getElementById(`${prefix}-link-${urlData.id}`);
  //   // Check if current item are fetched from API or not
  //   if(currentItem){
  //     // If present, add current-item class to element
  //     currentItem.classList.add(currentItemClass);
  //     let currentItemParent;
  //     while(currentItemParent = currentItem.parentNode.closest("li")){
  //       currentItem = currentItemParent
  //       currentItem.classList.add(currentItemParentClass);
  //     }
  //   }

  //   if (prefix == articlePrefix || prefix == sectionsPrefix) {
  //     let breadcrumbData = getCurrentBreadcrumbData()
  //     // Get current sidebar parent list from breadcrumb
  //     let currentSidebar = document.getElementById(`menu-tree-${breadcrumbData.type}-link-${breadcrumbData.id}`)
  //     if (currentSidebar) {
  //       let currentSidebarParent;
  //       while (currentSidebarParent = currentSidebar.parentNode.closest("li")) {
  //         currentSidebar = currentSidebarParent
  //         // // Fetch article if current item or article parent not present
  //         // if (!currentItem) {

  //         //   if (!currentSidebar.classList.contains('menu-tree-category')) {
  //         //     fetchArticleOnClick(currentSidebar, locale)
  //         //   }
  //         // } else if (currentSidebar.querySelector('.menu-tree-article') == null) {
  //         //   if (!currentSidebar.classList.contains('menu-tree-category')) {
  //         //     fetchArticleOnClick(currentSidebar, locale)
  //         //   }
  //         // }
          
  //         currentSidebar.classList.add(currentItemParentClass)
  //         console.log(currentSidebar.querySelector('a'))
  //         currentSidebar.querySelector("a").dispatchEvent(new Event('click'))
  //       }
  //     }
  //   }
  // }
}

function getMenuTreeData(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
  const item = JSON.parse(itemStr)
  
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return item
}

function createListElement(parent, prefix, data, isCollapsible){
  let parentNode = document.getElementById(parent);
  if(parentNode){
    let parentUl = parentNode.getElementsByTagName("ul")[0];
    if(!parentUl){
      parentUl = document.createElement("ul");
      if((prefix == sectionsPrefix) && data.parent_section_id){
        parentUl.className = `${articlePrefix}-parent`;
      } else {
        parentUl.className = `${prefix}-parent`;
      }

      if (isCollapsible) {
        parentUl.classList.add('collapse')
      }

      if(data.parent_section_id) {
        parentUl.id = `${prefix}-collapse-${data.parent_section_id}`;
      } else if (data.category_id) {
        parentUl.id = `${prefix}-collapse-${data.category_id}`;
      } else if (prefix == articlePrefix) {
        parentUl.id = `${sectionsPrefix}-collapse-${data.section_id}`
      } else {
        parentUl.id = `${prefix}-collapse-${data.section_id}`;
      }
      parentNode.appendChild(parentUl);
    }

    let elementLi = document.createElement("li");
    elementLi.id = `${prefix}-${data.id}`;
    elementLi.className = prefix;
    parentUl.appendChild(elementLi);
    
    let elementLink = document.createElement("a");
    elementLink.id = `${prefix}-link-${data.id}`;
    elementLink.dataset.id = data.id;
    elementLink.className = `${prefix}-link`;
    
    let elementSpan = document.createElement('span')

    if(prefix == categoriesPrefix) {
      elementLink.dataset.target = `#${sectionsPrefix}-collapse-${data.id}`;
      elementLink.dataset.toggle = 'collapse'
      elementSpan.innerHTML = data.name
      elementLink.appendChild(elementSpan)
    } else if (prefix == sectionsPrefix) {
      elementLink.href = data.html_url;
      elementLink.dataset.target = `#${sectionsPrefix}-collapse-${data.id}`;
      elementLink.dataset.toggle = 'collapse'
      elementSpan.innerHTML = data.name
      elementLink.appendChild(elementSpan)
    } else if (prefix == sectionsPrefix) {
      elementLink.href = data.html_url;
      elementLink.innerHTML = data.name;
      // if (data.user_type == "staff") {
      //   let svgElement = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" focusable="false" viewBox="0 0 16 16" class="icon-lock" title="{{t 'internal'}}">
      //                       <rect width="12" height="6" x="2" y="7" fill="currentColor" rx="1" ry="1"/>
      //                       <path fill="none" stroke="currentColor" d="M4.5 7.5V4a3.5 3.5 0 017 0v3.5"/>
      //                     </svg>`
      //   elementLink.innerHTML = `${data.name} ${svgElement}`
      // }
    } else {
      elementLink.dataset.target = `#${data.id}`;
    }
    
    elementLink.ariaExpanded = false;
    elementLi.appendChild(elementLink);
  }
}

async function getUserSegment(id) {
  let userSegment = await fetch(`/api/v2/help_center/user_segments/${id}`)
  let response = await userSegment.json()
  return response.user_segment
}

// Helper function to create article element on section click
function createArticleElement(parent, data) {
  let prefix = "menu-tree-article"
  let currentItem = getCurrentUrlData()
  let currentId = currentItem.id
  let parentNode = document.getElementById(parent)
  let parentUl = parentNode.getElementsByTagName("ul")[0];
  if (!parentUl) {
    parentUl = document.createElement('ul');
  }
  parentUl.className = `${prefix}-parent collapse in`
  parentUl.id = `${sectionsPrefix}-collapse-${data.section_id}`
  parentNode.appendChild(parentUl)

  let elementLi = document.createElement("li");
  elementLi.id = `${prefix}-${data.id}`;
  elementLi.className = prefix;
  if (data.id == currentId) {
    elementLi.classList.add(currentItemParentClass)
  }
  parentUl.appendChild(elementLi);
  
  let elementLink = document.createElement("a");
  elementLink.id = `${prefix}-link-${data.id}`;
  elementLink.dataset.id = `${prefix}-${data.id}`;
  elementLink.className = `${prefix}-link`;
  if (data.id == currentId) {
    elementLink.classList.add(currentItemClass)
  }
  elementLink.href = data.html_url;
  elementLink.innerHTML = data.name;
  if (data.user_type == "staff") {
    let svgElement = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" focusable="false" viewBox="0 0 16 16" class="icon-lock" title="{{t 'internal'}}">
                        <rect width="12" height="6" x="2" y="7" fill="currentColor" rx="1" ry="1"/>
                        <path fill="none" stroke="currentColor" d="M4.5 7.5V4a3.5 3.5 0 017 0v3.5"/>
                      </svg>`
    elementLink.innerHTML = `${data.name} ${svgElement}`
  }

  elementLink.dataset.target = `#${data.id}`;
  elementLink.ariaExpanded = false;
  elementLi.appendChild(elementLink);
}

// Function for fetching article on section click
async function fetchArticleOnClick(element, locale) {
  $(element).addClass('is-loading')

  let sectionElement = $(element)

  let sectionId =
    $(element)
      .find('a')
      .attr('data-id')

  let parent = $(element).attr('id')
  let url = `/api/v2/help_center/${locale}/sections/${sectionId}/articles?per_page=100`
  let articleData = await getDataFromUrl(url, 'articles')

  let [articlesPromise] = await Promise.all([articleData])
    .then($(sectionElement).removeClass('is-loading'))
    .catch(err=>{
      console.error("Error occured in fetching data",err);
  });

  if (Object.keys(articlesPromise).length != 0) { 
    $(element).find('a').eq(0).attr('aria-expanded', true)
    
    for (let [key, value] of Object.entries(articlesPromise)) {
      if (HelpCenter.user.role !== 'end_user') {
        if (value.user_segment_id !== null) {
          let userSegmentId = value.user_segment_id
          let userSegment = await getUserSegment(userSegmentId)
          if (userSegment.user_type == 'staff') {
            value.user_type = "staff"
          }
        }
      }
      createArticleElement(parent, value)
    }
  }

  // Get old localstorage data
  let oldStorage = getMenuTreeData(`${localStoragePrefix}-${locale}`)

  // Assign new promise with old data to new array
  let articles = Object.assign(articlesPromise, oldStorage["articles"])

  let storageData = {
    ...oldStorage,
    articles
  }
  localStorage.setItem(`${localStoragePrefix}-${locale}`, JSON.stringify(storageData))
}

async function makeTree(sidebar, locale = "en-us") {
  let menuTree = document.getElementById(sidebar);
  
  if(menuTree){
    let menuTreeData = getMenuTreeData(`${localStoragePrefix}-${locale}`);
    
    if(!menuTreeData){
      menuTreeData = await setAllData(locale);
    }

    let categoriesLength = Object.keys(menuTreeData.categories).length
    
    if (categoriesLength > 1) {
      for (let [key, value] of Object.entries(menuTreeData.categories)) {
        createListElement(sidebar,categoriesPrefix,value);
      }
      for (let [key, value] of Object.entries(menuTreeData.sections)) {
        createListElement(`${categoriesPrefix}-${value.category_id}`, sectionsPrefix, value, true);
      }
      for (let [key, value] of Object.entries(menuTreeData.subSections)) {
        createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
        if (value.parent_section_id == 360005950939 || value.parent_section_id == 4405250954258) {
          for (let [key2, value2] of Object.entries(menuTreeData.subSubSections)) {
            if (value2.parent_section_id == value.id) {
              createListElement(`${sectionsPrefix}-${value2.parent_section_id}`,sectionsPrefix,value2, true);
            }
          }
        }
      }
      // for (let [key, value] of Object.entries(menuTreeData.subSubSections)) {
      //   createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      // }
      // for (let [key, value] of Object.entries(menuTreeData.subSubSubSections)) {
      //   createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      // }
      // for (let [key, value] of Object.entries(menuTreeData.subSubSubSubSections)) {
      //   createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      // }
    } else if (categoriesLength == 1) {
      for (let [key, value] of Object.entries(menuTreeData.sections)) {
        createListElement(sidebar,sectionsPrefix,value)
      }
      for (let [key, value] of Object.entries(menuTreeData.subSections)) {
        createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      }
      for (let [key, value] of Object.entries(menuTreeData.subSubSections)) {
        createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      }
      for (let [key, value] of Object.entries(menuTreeData.subSubSubSections)) {
        createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      }
      for (let [key, value] of Object.entries(menuTreeData.subSubSubSubSections)) {
        createListElement(`${sectionsPrefix}-${value.parent_section_id}`,sectionsPrefix,value, true);
      }
    }

    // if (menuTreeData.articles) {
    //   for (let [key, value] of Object.entries(menuTreeData.articles)) {
    //     createListElement(`${sectionsPrefix}-${value.section_id}`,articlePrefix,value, true);
    //   }
    // }
    
    // Get current page data from URL in case no breadcrumb present (eg: homepage)
    getIdFromBreadcrumb()
    let urlData = getCurrentBreadcrumbData();
    // Then set the active list based on urlData
    console.log(urlData)
    if(urlData.type){
      setActiveLi(urlData, locale);
    }

    // let element = document.getElementsByClassName('menu-tree-section')
    // for (i = 0; i < element.length; i++) {
    //   if ($(element[i]).attr('aria-expanded', 'false')) {
    //     if (!$(element[i]).hasClass('current-item-parent')) {
    //       if ($(element[i]).find('.menu-tree-article').eq(0).length == 0) {
    //         element[i].addEventListener('click', function(e) {
    //           fetchArticleOnClick(this, locale)
    //         }, {once: true})
    //       }
    //     }
    //   } else { return null }
    // }
  }
}

function sidebarScroll() {
  let element = document.getElementsByClassName('current-item');
  if(element.length > 0) {
    let sidebar = document.getElementsByClassName('sidebar-wrapper')
    let headerOffset = 300;
    let elementOffset = element[0].getBoundingClientRect().top;
    let offsetPosition = elementOffset - headerOffset
    sidebar[0].scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    })
  }
}