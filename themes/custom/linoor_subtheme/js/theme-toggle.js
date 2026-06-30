(function (Drupal, once) {
  Drupal.behaviors.customTheme = {
    attach: function (context) {

      // Theme Toggle
      once('theme-toggle', '.theme-toggle', context).forEach((toggle) => {
        const body = document.body;

        // Load saved theme
        if (localStorage.getItem('theme') === 'dark') {
          body.classList.add('dark-mode');
        }

        toggle.addEventListener('click', () => {
          body.classList.toggle('dark-mode');

          const mode = body.classList.contains('dark-mode')
            ? 'dark'
            : 'light';

          localStorage.setItem('theme', mode);
        });
      });

      // Accordion
     once('accordion', '.accordion-question', context).forEach((question) => {

  question.addEventListener('click', () => {
    const currentAccordion = question.closest('.accordion-wrapper');
    const currentAnswer = currentAccordion.querySelector('.accordion-answer');

    // Close all other accordions
    document.querySelectorAll('.accordion-wrapper.active').forEach((accordion) => {
      if (accordion !== currentAccordion) {
        accordion.classList.remove('active');
        accordion.querySelector('.accordion-answer').style.maxHeight = null;
      }
    });

    // Toggle current accordion
    currentAccordion.classList.toggle('active');

    if (currentAccordion.classList.contains('active')) {
      currentAnswer.style.maxHeight = (currentAnswer.scrollHeight + 20) + 'px';
    } else {
      currentAnswer.style.maxHeight = null;
    }
  });

});
    }
  };
})(Drupal, once);