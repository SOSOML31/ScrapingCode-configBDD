(function ($, Drupal, drupalSettings) {
  Drupal.ameli_menu = Drupal.ameli_menu || {
    hasUpdate: false,
    urls: {},
    active_trail_ids: {},
    process: function () {
      $.each(this.urls, function (url, ids) {
        $.ajax({
          url: url,
          method: 'GET',
          success: function success(data) {
            for (let id of ids) {
              const $menu = $(id);
              $menu.html(data.menu);

              if (Drupal.ameli_menu.active_trail_ids.length > 0) {
                $('.js-' + Drupal.ameli_menu.active_trail_ids.join(',.js-'), $menu).addClass('active');
              }
              Drupal.attachBehaviors($menu[0]);
            }
          },
          complete: function(xhr, stat) {
            // trigger ameli_menu_update with call status
            $(document).trigger({
              type: 'ameli_menu_update',
              id: ids,
              url: url,
              stat: stat,
              context: $(ids.join(',')).get(0),
              settings: drupalSettings
            });
          }
        });
      });
    }
  };

  $(document).ready(function() {
    if (drupalSettings.ameli_menu === undefined) {
      return;
    }
    $.each(drupalSettings.ameli_menu.menus, function (id, val) {
      if(Drupal.ameli_menu.urls[val.updateUrl] === undefined) {
        Drupal.ameli_menu.urls[val.updateUrl] = [];
      }
      Drupal.ameli_menu.urls[val.updateUrl].push('#' + val.id);
    });
    Drupal.ameli_menu.active_trail_ids = drupalSettings.ameli_menu.active_trail_ids;
    Drupal.ameli_menu.process();
  });
})(jQuery, Drupal, drupalSettings);
