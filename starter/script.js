'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSlides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scrolling

btnScrollTo.addEventListener('click', function (e) {
  //getting the coordinates of the section--1 div
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // e.target is the button btnScrollTo
  // console.log(e.target.getBoundingClientRect());

  // scrolling coordinate horizontal (x) and vertical (y) from the top of page
  // console.log('Current Scrolling X/Y', window.pageXOffset, window.pageYOffset);

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth', // this property creates smooth animation
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Improved solution-->
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clickedTab = e.target.closest('.operations__tab');
  // console.log(clickedTab);

  // Prevent error when we click on tab container itself
  if (!clickedTab) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate active class for tab
  clickedTab.classList.add('operations__tab--active');

  // Activate tab content
  // console.log(clickedTab.dataset.tab);
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const fadeEffect = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (element) {
      if (element !== link) element.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  fadeEffect(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  fadeEffect(e, 1);
});

// Navigation stick to top
const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// const obsCallback = function (entries, observer) {
//   entries.forEach(function (entry) {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const head = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // viewport
  threshold: 0, // when 0% of the header is in viewport, threshold has been reached
  rootMargin: '-90px', // allows nav bar to intersect precisely with height of section
});
headerObserver.observe(head);

// Revealing Sections

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// select all sections to observe simultaneously
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // add hidden sections programatically
  // section.classList.add('section--hidden');
});

const imgTargets = document.querySelectorAll('img[data-src]');
// const imgTargets2 = document.querySelectorAll('.lazy-img');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace lower quality src with higher quality data-src
  entry.target.src = entry.target.dataset.src;

  // remove the lazy-img (blur) class only when the image has finished loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //load the images 200px before we reach them
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

// Building Slider Component

let curSlide = 0;
// store the number of slides
const maxSlides = allSlides.length;

// Building dots functionality
const createDots = function () {
  //we only want the index of the allSlides
  allSlides.forEach(function (_, i) {
    // insert the dots button into dots container
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide="${i}"></button>`
    );
  });
};

// Show active dots
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

// function for slider action
const goNextSlide = function (slideNum) {
  allSlides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${100 * (i - slideNum)}%)`)
    // e.g. when slideNum == 1 => index 0: -100%, index 1: 0%, index 2: 100%, index 3: 200%
  );
};

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goNextSlide(curSlide);
  activateDot(curSlide);
};

// Previous slide
const previousSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  goNextSlide(curSlide);
  activateDot(curSlide);
};

const init = function () {
  // start the slider at beginning
  goNextSlide(0);
  createDots();
  activateDot(0);
};
init();

// Events
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

// adding left and right keys event action
document.addEventListener('keydown', function (e) {
  // console.log(e);
  if (e.key === 'ArrowLeft') previousSlide();
  else if (e.key === 'ArrowRight') nextSlide();
  // e.key === 'ArrowRight' && nextSlide(); //alternative method using short circuiting
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goNextSlide(slide);
    activateDot(slide);
  }
});
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

const header = document.querySelector('.header');

// this method returns a Node list
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');

// selecting html elements by tag type
// this method returns a HTML Collection
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  'We use cookies to serve you better. By using our services you accept the privacy terms and conditions <button class = "btn btn--close-cookie">I agree</button>';

header.append(message);

// deleting elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// adding styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// message.style.padding = '0.7em';

// retrieving properties of elements
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).color);

// adding 30px to the height of the message div
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

// this is the absolute url
console.log(logo.src);
// this is the relative url
console.log(logo.getAttribute('src'));

logo.setAttribute('company', 'Bankist');

// classes
logo.classList.add('a');
logo.classList.remove('a');
logo.classList.toggle('a');
logo.classList.contains('a');

// traversing the DOM
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));

console.log(h1.childNodes);
console.log(h1.children);

// Going upwards: parent
console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.header').style.backgroundColor = 'orangered';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// to get ALL the siblings
// console.log(h1.parentElement.children);
