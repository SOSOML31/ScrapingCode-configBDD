(function ($, Drupal, drupalSettings, w) {
  'use strict';
  Drupal.behaviors.mobilenavigationmaterial = {
    attach: function (context, settings) {
      $('.navigation-accordion', context).once('mobileNavigation').each(function () {
        // hide children of level 1
        var menu = $(this);
        accordionMenu(menu);

      });

      function accordionMenu(menu) {
        // If displaying top level items, hide other containers on load
        if (menu.find('.navigation-accordion__menu-level--1')) {
          if (menu.find('.navigation-accordion__menu-level--1').length > 0) {
            menu.find('.navigation-accordion__level-container').not('.navigation-accordion__menu-level--1').slideUp('fast');
            // show active trail
            var activeTrailItem = menu.find('.navigation-accordion__level-container.navigation-accordion__level-container--active-trail');
            showActiveSiblings(activeTrailItem);
            // show siblings of active item
            menu.find('.navigation-accordion__list-item.mdc-list-item--selected').parent().siblings().slideDown('fast');
          }
        }


        menu.find('.navigation-accordion__list-item-chevron').click(function (e) {
          var itemLevel = $(this).attr('data-level');
          $(this).attr('data-clicked', 'true');
          menu.find('.navigation-accordion__menu-level--' + itemLevel).each(function () {
            var nextLevel = parseInt(itemLevel) + 1;
            var levelButton = $(this).find('.navigation-accordion__list-item-chevron[data-level="' + itemLevel + '"]');

            $(this).find('.navigation-accordion__menu-level--' + nextLevel).slideUp('fast');
            if (levelButton.attr('data-clicked') != 'true') {
              levelButton.attr('data-expanded', 'false');
            }

          });

          var selectedItem = $('.navigation-accordion__list-item.mdc-list-item--selected');
          var chevronItemContainer = $(this).parent();

          selectedItem.removeClass('mdc-list-item--selected');
          selectedItem.parent().removeClass('navigation-accordion__nav-item--selected');

          chevronItemContainer.find('.navigation-accordion__list-item').addClass('mdc-list-item--selected');
          chevronItemContainer.addClass('navigation-accordion__nav-item--selected');
          chevronButtonState($(this));

          chevronItemContainer.siblings().each(function (e) {
            if ($(this).css('display') == 'none') {
              $(this).slideDown('fast');
            }
            else {
              $(this).slideUp('fast');
            }
          });
        });

        function showActiveSiblings(item) {
          item.slideDown('fast');
          item.siblings().slideDown('fast');
        }

        function chevronButtonState(chevronButton) {
          if (chevronButton.attr('data-expanded') == 'false') {
            chevronButton.attr('data-expanded', 'true');
          }
          else {
            chevronButton.attr('data-expanded', 'false');
          }
          chevronButton.attr('data-clicked', 'false');
        }
      }
    }
  };

})(jQuery, Drupal, drupalSettings, window);
