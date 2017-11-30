/* Developed by Juno_okyo */
'use strict';

new WOW().init();

jQuery(document).ready(function($) {
  $('#navbar-menu').find('a.nav-link').click(function(event) {
    event.preventDefault();

    let currentMenu = $(this).attr('href');
    $.scrollTo(currentMenu, 500);

    if (currentMenu === '#section-contact') {
      setTimeout(function() {
        $('#contact-form').find('input').first().focus();
      }, 700);
    }
  });

  $('#scroll-down-btn').click(function(event) {
    event.preventDefault();
    $.scrollTo('#section-about', 600);
  });
});