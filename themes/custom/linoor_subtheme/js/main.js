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

(function (Drupal, once) {
  Drupal.behaviors.linoorPoolCatalogSlider = {
    attach: function (context) {
      once('linoor-pool-catalog-slider', '.path-all-pools .pool-card-wrapper .image', context).forEach(function (image) {
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', 'Open pool gallery');

        image.addEventListener('click', function () {
          openPoolSlider(getCardIndex(image.closest('.pool-card-wrapper')));
        });

        image.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPoolSlider(getCardIndex(image.closest('.pool-card-wrapper')));
          }
        });
      });
    }
  };

  var activeIndex = 0;

  function getCards() {
    return Array.prototype.slice.call(document.querySelectorAll('.path-all-pools .pool-card-wrapper'));
  }

  function getCardIndex(card) {
    var cards = getCards();
    var index = cards.indexOf(card);
    return index > -1 ? index : 0;
  }

  function getCardData(card) {
    var title = card.querySelector('.title h3');
    var image = card.querySelector('.image .item-image > img');
    var brand = card.querySelector('.brand');
    var properties = card.querySelector('.properties');
    var link = card.querySelector('.button-action a');

    return {
      title: title ? title.textContent.trim() : 'Pool Model',
      image: image ? image.getAttribute('src') : '',
      alt: image ? image.getAttribute('alt') || '' : '',
      brand: brand ? brand.textContent.trim() : 'Fox Bro\'s Pools',
      properties: properties ? properties.innerHTML : '',
      link: link ? link.getAttribute('href') : ''
    };
  }

  function ensureModal() {
    var modal = document.getElementById('pool-catalog-slider');

    if (modal) {
      return modal;
    }

    modal = document.createElement('div');
    modal.id = 'pool-catalog-slider';
    modal.className = 'pool-catalog-slider';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = [
      '<button class="pool-catalog-slider__close" type="button" aria-label="Close gallery">x</button>',
      '<button class="pool-catalog-slider__arrow pool-catalog-slider__arrow--prev" type="button" aria-label="Previous pool">&#8249;</button>',
      '<div class="pool-catalog-slider__dialog" role="dialog" aria-modal="true" aria-label="Pool model gallery">',
      '<div class="pool-catalog-slider__media"><img alt=""></div>',
      '<aside class="pool-catalog-slider__info">',
      '<div class="pool-catalog-slider__eyebrow">Fox Bro\'s Pools</div>',
      '<h2></h2>',
      '<div class="pool-catalog-slider__meta"></div>',
      '<div class="pool-catalog-slider__divider"></div>',
      '<div class="pool-catalog-slider__body"></div>',
      '<a class="pool-catalog-slider__link" href="#">View Model</a>',
      '</aside>',
      '<div class="pool-catalog-slider__dots" aria-label="Gallery pagination"></div>',
      '</div>',
      '<button class="pool-catalog-slider__arrow pool-catalog-slider__arrow--next" type="button" aria-label="Next pool">&#8250;</button>'
    ].join('');
    document.body.appendChild(modal);

    modal.querySelector('.pool-catalog-slider__close').addEventListener('click', closePoolSlider);
    modal.querySelector('.pool-catalog-slider__arrow--prev').addEventListener('click', function () {
      movePoolSlider(-1);
    });
    modal.querySelector('.pool-catalog-slider__arrow--next').addEventListener('click', function () {
      movePoolSlider(1);
    });
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closePoolSlider();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!modal.classList.contains('is-open')) {
        return;
      }

      if (event.key === 'Escape') {
        closePoolSlider();
      }

      if (event.key === 'ArrowLeft') {
        movePoolSlider(-1);
      }

      if (event.key === 'ArrowRight') {
        movePoolSlider(1);
      }
    });

    return modal;
  }

  function openPoolSlider(index) {
    var cards = getCards();

    if (!cards.length) {
      return;
    }

    activeIndex = index;
    updatePoolSlider();

    var modal = ensureModal();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pool-catalog-slider-open');
    modal.querySelector('.pool-catalog-slider__close').focus();
  }

  function closePoolSlider() {
    var modal = ensureModal();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pool-catalog-slider-open');
  }

  function movePoolSlider(step) {
    var cards = getCards();

    if (!cards.length) {
      return;
    }

    activeIndex = (activeIndex + step + cards.length) % cards.length;
    updatePoolSlider();
  }

  function updatePoolSlider() {
    var cards = getCards();
    var modal = ensureModal();
    var data = getCardData(cards[activeIndex]);
    var image = modal.querySelector('.pool-catalog-slider__media img');
    var heading = modal.querySelector('.pool-catalog-slider__info h2');
    var eyebrow = modal.querySelector('.pool-catalog-slider__eyebrow');
    var meta = modal.querySelector('.pool-catalog-slider__meta');
    var body = modal.querySelector('.pool-catalog-slider__body');
    var link = modal.querySelector('.pool-catalog-slider__link');
    var dots = modal.querySelector('.pool-catalog-slider__dots');

    image.src = data.image;
    image.alt = data.alt || data.title;
    heading.textContent = data.title;
    eyebrow.textContent = data.brand || 'Fox Bro\'s Pools';
    meta.textContent = 'Pool Model';
    body.innerHTML = data.properties;

    if (data.link) {
      link.href = data.link;
      link.style.display = '';
    } else {
      link.style.display = 'none';
    }

    dots.innerHTML = '';
    cards.forEach(function (card, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = index === activeIndex ? 'is-active' : '';
      dot.setAttribute('aria-label', 'Go to pool ' + (index + 1));
      dot.addEventListener('click', function () {
        activeIndex = index;
        updatePoolSlider();
      });
      dots.appendChild(dot);
    });
  }
})(Drupal, once);
