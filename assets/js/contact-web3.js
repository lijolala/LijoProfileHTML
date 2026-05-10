/**
 * Web3Forms AJAX handler for the contact form.
 * Works with the existing .php-email-form CSS classes (loading, error-message, sent-message).
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.php-email-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var loading  = form.querySelector('.loading');
      var errorBox = form.querySelector('.error-message');
      var sentBox  = form.querySelector('.sent-message');
      var btn      = form.querySelector('button[type="submit"]');

      // Reset state
      loading.style.display  = 'block';
      errorBox.style.display = 'none';
      sentBox.style.display  = 'none';
      btn.disabled = true;

      try {
        var response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form)
        });

        var json = await response.json();

        loading.style.display = 'none';

        if (json.success) {
          sentBox.style.display = 'block';
          form.reset();
        } else {
          errorBox.textContent = json.message || 'Something went wrong. Please try again.';
          errorBox.style.display = 'block';
        }
      } catch (err) {
        loading.style.display  = 'none';
        errorBox.textContent   = 'Network error. Please check your connection and try again.';
        errorBox.style.display = 'block';
      }

      btn.disabled = false;
    });
  });
})();
