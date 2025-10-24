// /public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      // Check if the form is valid based on HTML 'required' attributes
      if (!form.checkValidity()) {
        event.preventDefault(); // Stop the form from submitting
        event.stopPropagation(); // Stop the event from propagating
      }

      // Add the 'was-validated' class to show feedback (red borders, messages)
      form.classList.add('was-validated');
    }, false);
  });
});
