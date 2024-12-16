/**
 * @file
 * Enable MDC selects to work with drupal, MDC won't set a value when inside of a form field OOTB.
 * https://stackoverflow.com/questions/59147410/value-selected-in-select-menu-not-being-sent-to-the-server
 */


(function ($, Drupal, drupalSettings, w) {
  'use strict';
  Drupal.behaviors.materialselectvalue = {
    attach: function (context, settings) {
      $('.mdc-select-list', context).once('mdcSelectValue').each(function () {
        $(this).on('DOMSubtreeModified', $(this), function () {
          var selectedValue = $(this).find('.mdc-list-item--selected').attr('data-value');
          var par = $(this).parent().find('.mdc-select-list-data');
          par.val(selectedValue);
          par.trigger("change");
        });
      });
    }
  };

})(jQuery, Drupal, drupalSettings, window);
  