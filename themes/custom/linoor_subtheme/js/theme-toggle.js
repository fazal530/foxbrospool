(function (Drupal, once) {
  Drupal.behaviors.themeToggle = {
    attach: function (context) {
      const toggles = once('theme-toggle', '.theme-toggle', context);

      toggles.forEach((toggle) => {
        const body = document.body;

        // Load saved theme on attach (once per behavior)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          body.classList.add('dark-mode');
        }

        // Toggle theme on click
        toggle.addEventListener('click', () => {
          body.classList.toggle('dark-mode');
          const mode = body.classList.contains('dark-mode') ? 'dark' : 'light';
          localStorage.setItem('theme', mode);
        });
      });
    },
  };
})(Drupal, once);
