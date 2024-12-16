

(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.materialSearchInputClear = {
    attach: function (context) {
      $('.nzp-search-input', context).once('search-input-behaviours').each(function () {
        var element = $(this);
        var inp = element.find('input.mdc-text-field__input');
        var clr = element.find('.mdc-icon-button');
        inp.on("input", function () {
          if (inp.val().length > 0) {
            clr.css("visibility", "visible");
          } else {
            clr.css("visibility", "hidden");
          }
        });
        inp.is(":focus", function () {
          if (inp.val().length > 0) {
            clr.css("visibility", "visible");
          } else {
            clr.css("visibility", "hidden");
          }
        });
        clr.on("touchstart click", function (e) {
          e.preventDefault();
          inp.val("");
          setTimeout(function () {
            clr.css("visibility", "hidden");
          }, 200);
        });

      });
    }
  };

})(jQuery, Drupal);

