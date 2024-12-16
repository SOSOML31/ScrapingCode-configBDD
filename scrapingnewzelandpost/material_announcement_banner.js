
(function ($, Drupal) {

  'use strict';

  function setCookie(name, arr, duration) { // duration in days
    var expires = "";
    if (duration) {
      expires = "; max-age=" + (duration * 24 * 60 * 60);
    }
    document.cookie = name + "=" + (JSON.stringify(arr) || "") + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        var cookieStr = cookie.substring(nameEQ.length, cookie.length);
        var cookieVal = JSON.parse(cookieStr);
        return cookieVal;
      }
    }
    return [];
  }


  Drupal.behaviors.materialAnnouncementBanner = {
    attach: function () {
      $('.announcement-banner').once('material-announcement-banner').each(function () {
        var viewed = Date.now();
        var revisionTime = $(this).attr('data-revision-creation-time');
        var cookieVal = getCookie($(this).attr('id'));
        var currentExpire = cookieVal.expire;
        var creationTime = cookieVal.created;

        if ((currentExpire === undefined) || (currentExpire < viewed) || (creationTime < revisionTime)) {
          $(this).css('display', 'flex');
        }

        $('.announcement-banner__buttons .announcement-banner__dismiss .mdc-button').once('material-announcement-banner-dismiss').each(function () {
          $(this).click(function (event) {
            var clicked = Date.now();
            var banner = $(this).closest('.announcement-banner');
            if (banner) {
              event.preventDefault();
              banner.slideUp(250);
              var days = 1;
              var expire = clicked + (days * 24 * 60 * 60 * 1000);
              var data = {
                'expire': expire,
                'created': banner.attr('data-revision-creation-time')
              };
              setCookie(banner.attr('id'), data, days);
            }
          });

        });

      });

    }
  };

})(jQuery, Drupal);

