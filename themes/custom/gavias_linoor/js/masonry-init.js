(function (Drupal, once) {
    Drupal.behaviors.masonryGallery = {
      attach: function (context) {
        once('masonryGallery', '.pswp-gallery', context).forEach(function (gallery) {
  
          console.log('✅ All images loaded, initializing Masonry...');
  
          imagesLoaded(gallery, function () {
            var msnry = new Masonry(gallery, {
              itemSelector: 'a',
              columnWidth: '.grid-sizer',
              percentPosition: true,
              gutter: 10
            });
  
            console.log('✅ Masonry initialized:', msnry);
            setTimeout(() => msnry.layout(), 300);
          });
        });
      }
    };
  })(Drupal, once);
  