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

(function (Drupal, once) {
  Drupal.behaviors.linoorBookingModal = {
    attach: function (context) {
      once('linoor-booking-modal', '#slide-15-layer-3 > a', context).forEach(function (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();

          var modal = document.getElementById('linoor-booking-modal');
          var iframe = document.getElementById('linoor-booking-modal-frame');

          if (!modal) {
            modal = document.createElement('div');
            modal.id = 'linoor-booking-modal';
            modal.className = 'linoor-booking-modal';
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = [
              '<div class="linoor-booking-modal__dialog" role="dialog" aria-modal="true" aria-label="Book Online">',
              '<button class="linoor-booking-modal__close" type="button" aria-label="Close">&times;</button>',
              '<iframe id="linoor-booking-modal-frame" class="linoor-booking-modal__frame" title="Book Online"></iframe>',
              '</div>'
            ].join('');
            document.body.appendChild(modal);
            iframe = document.getElementById('linoor-booking-modal-frame');

            modal.addEventListener('click', function (modalEvent) {
              if (
                modalEvent.target === modal ||
                modalEvent.target.classList.contains('linoor-booking-modal__close')
              ) {
                closeModal(modal);
              }
            });

            document.addEventListener('keydown', function (keyEvent) {
              if (keyEvent.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal(modal);
              }
            });
          }

          iframe.src = getBookingUrl(button);
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden', 'false');
          document.body.classList.add('linoor-booking-modal-open');
          modal.querySelector('.linoor-booking-modal__close').focus();
        });
      });
    }
  };

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('linoor-booking-modal-open');
  }

  function getBookingUrl(button) {
    var href = button.getAttribute('href');

    if (!href || href === '#' || href.indexOf('javascript:') === 0) {
      return '/contact-us';
    }

    return href;
  }
})(Drupal, once);
