jQuery(document).ready(function ($) {
  $('.review-carosel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,  // a little slower to enjoy the animation
    smartSpeed: 1000,       // smooth animation speed
    animateOut: 'fadeOut',  // default outgoing animation
    animateIn: 'zoomIn',    // default incoming animation
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  });
});
