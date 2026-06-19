document.addEventListener('DOMContentLoaded', () => {
  import('/libraries/photoswipe/dist/photoswipe-lightbox.esm.js')
    .then(({ default: PhotoSwipeLightbox }) => {
      document.querySelectorAll('.pswp-gallery').forEach(gallery => {
        const lightbox = new PhotoSwipeLightbox({
          gallery: gallery,   // pass element directly
          children: 'a',
          pswpModule: () => import('/libraries/photoswipe/dist/photoswipe.esm.js'),
        });
        lightbox.init();
      });
    })
    .catch(err => console.error('PhotoSwipe failed to load:', err));
});
