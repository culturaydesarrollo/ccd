(function() {
  "use strict"; // Start of use strict

  var mainNav = document.querySelector('#mainNav');

  if (mainNav) {

    var navbarCollapse = mainNav.querySelector('.navbar-collapse');
    
    if (navbarCollapse) {
      
      var collapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false
      });
      
      var navbarItems = navbarCollapse.querySelectorAll('a');
      
      // Closes responsive menu when a scroll trigger link is clicked
      for (var item of navbarItems) {
        item.addEventListener('click', function (event) {
          collapse.hide();
        });
      }
    }

    // Collapse Navbar
    var collapseNavbar = function() {

      var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

      if (scrollTop > 100) {
        mainNav.classList.add("navbar-shrink");
      } else {
        mainNav.classList.remove("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    collapseNavbar();
    // Collapse the navbar when page is scrolled
    document.addEventListener("scroll", collapseNavbar);

    // Hide navbar when modals trigger
    var modals = document.querySelectorAll('.portfolio-modal');
      
    for (var modal of modals) {
      
      modal.addEventListener('shown.bs.modal', function (event) {
        mainNav.classList.add('d-none');
      });
        
      modal.addEventListener('hidden.bs.modal', function (event) {
        mainNav.classList.remove('d-none');
      });
    }
  }

  var contactForm = document.querySelector('#contactForm');
  if (contactForm && !contactForm.hasAttribute('data-noajax')) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var action = contactForm.action;
      if (!action) {
        return;
      }
      var statusContainer = document.querySelector('#success');
      var submitButton = contactForm.querySelector('button[type="submit"]');

      // Ensure Formspree receives a `_replyto` field even if the visible input is named `email`
      var emailInput = contactForm.querySelector('input[name="email"]');
      var replyToInput = contactForm.querySelector('input[name="_replyto"]');
      if (emailInput && replyToInput) {
        replyToInput.value = emailInput.value;
      }

      // Disable submit and show loading state
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
      }

      var data = new FormData(contactForm);

      fetch(action, {
        method: contactForm.method || 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          // If a `_next` hidden input exists, redirect there (Formspree redirect won't happen when using fetch)
          var nextInput = contactForm.querySelector('input[name="_next"]');
          if (nextInput && nextInput.value) {
            window.location = nextInput.value;
            return;
          }
          statusContainer.innerHTML = '<div class="alert alert-success">Mensaje enviado. Gracias por contactarnos.</div>';
          contactForm.reset();
        } else {
          response.json().then(function (data) {
            statusContainer.innerHTML = '<div class="alert alert-danger">No se pudo enviar el mensaje. Por favor intenta de nuevo.</div>';
          }).catch(function () {
            statusContainer.innerHTML = '<div class="alert alert-danger">No se pudo enviar el mensaje. Por favor intenta de nuevo.</div>';
          });
        }
      }).catch(function () {
        statusContainer.innerHTML = '<div class="alert alert-danger">Error de conexión. Verifica tu servicio de envío.</div>';
      }).finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || 'Enviar Mensaje';
        }
      });
    });
  }

})(); // End of use strict