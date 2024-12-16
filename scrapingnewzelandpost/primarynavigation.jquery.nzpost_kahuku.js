(function ($, Drupal, drupalSettings, w) {
  'use strict';
  Drupal.behaviors.primarynavigationmaterial = {
    attach: function (context, settings) {
      $('.navigation', context).once('primaryNavigation').each(function () {

        if(Cookies.get('cartItems')){
          let cookieValue = Cookies.get('cartItems');
          if(cookieValue != 0 ){
            // $('#cart-link-mobile').append('('+cookieValue+')'); //todo?
            $('#cart-mobile-nav-link').append('<span class="mobile-navigation__link-cart-value">('+cookieValue+')</span>');
            $('#cart-link-mobile').append('<span class="mdc-top-app-bar__navigation-cart-value mdc-typography--body1">('+cookieValue+')</span>');
            $('#cart-link-desktop').append('<span class="mdc-top-app-bar__navigation-cart-value">('+cookieValue+')</span>');
          }
        }
        headerFakedLogin();

        function headerFakedLogin(){
          var cookieItems = Cookies.get();
          var fakeHeader = false;
          var locationUpper = window.location.host.toLowerCase();
          if(locationUpper.match(/uat.nzpost.co.nz/)){
            $.each(cookieItems, function(key, value){
              if(key == 'auth0UAT.nzpost.co.nz'){
                fakeHeader = true;
              }
            });
          } else {
            $.each(cookieItems, function(key, value){
              if(key == 'auth0PROD.nzpost.co.nz'){
                fakeHeader = true;
              }
            });
          }
          if(fakeHeader == true){
            $('.account-nav-action-links--authenticated').css('display', 'flex');
            $('.account-nav-action-links--unauthenticated').hide();
            $('.account-drawer-action-links--authenticated').show();
            $('.account-drawer-action-links--unauthenticated').hide();
          }
          else{
            $('.account-nav-action-links--authenticated').hide();
            $('.account-nav-action-links--unauthenticated').css('display', 'flex');
            $('.account-drawer-action-links--authenticated').hide();
            $('.account-drawer-action-links--unauthenticated').show();
          }
        }

        updateChildItemPosition();

        // Smooth scroll tab: CC-3446
        $('*').on('scroll', function(e){
          updateChildItemPosition();
        });

        var mouseItem = null;
        window.onmouseover=function(e) {
          mouseItem = $(e.target);
        };

        //child list position CC-3437
        function updateChildItemPosition(){
          $('.mdc-tab').each(function(e){
            var attr = $(this).attr('data-parentnav');
            if (typeof attr !== typeof undefined && attr !== false) {
              var childItem = getChildItem($(this));
              var position = $(this).offset();
              var navBottomPosition = $('.navigation__bottom').offset();
              childItem.css('top',60);
              childItem.css('left', position.left - navBottomPosition.left);
            }
          });
        }
        // focus focusin hover keydown keypress keyup mouseenter mousemove mouseover
        // Focus next and previous out of dropdown CC-3445 CC-3435
        $('.navigation__level-three').find('a.mdc-list-item').each(function(){
          $(this).on('keydown', function(event){
            const TAB_KEY_CODE = 9;
            const ESC_KEY_CODE = 27;
              switch (event.keyCode) {
                case TAB_KEY_CODE:
                  hideDropdowns();
                  var childNavID = $(this).parent().parent().attr('data-childnav');
                  var parentNav = $("a[data-parentnav='"+childNavID+"']");
                  parentNav.focus();
                  break;
                // focus back to parent: CC-3436
                case ESC_KEY_CODE:
                  var childNavID = $(this).parent().parent().attr('data-childnav');
                  var parentNav = $("a[data-parentnav='"+childNavID+"']");
                  parentNav.focus();
                  hideDropdowns();
                  break;
                default:
              }
          });
        });


        // tab out of parent: CC-3435 CC-3445
        $('.mdc-tab').on('keydown', function(event){
          const TAB_KEY_CODE = 9;
            switch (event.keyCode) {
              case TAB_KEY_CODE:
                hideDropdowns();
                updateChildItemPosition();
              default:
            }
        });


        // tab to: CC-3433
        $('.mdc-tab').on('keyup', function(event){
          hideDropdowns();
          updateChildItemPosition();
          var attr = $(this).attr('data-parentnav');
          if (typeof attr !== typeof undefined && attr !== false) {
            var childItem = getChildItem($(this));
            childItem.addClass('mdc-menu-surface--open');
            // Focus to child down arrow: CC-3438
            const DOWN_ARROW_KEY_CODE = 40;
            switch (event.keyCode) {
              case DOWN_ARROW_KEY_CODE:
                event.preventDefault();
                var items = childItem.find('a.mdc-list-item');
                var first = items.first();
                first.focus();
                break;
              default:
            }
          }
        });

        // hover show: CC-3414
        $('.mdc-tab').on('mouseenter', function(event){
          hideDropdowns();
          updateChildItemPosition();
          var attr = $(this).attr('data-parentnav');
          if (typeof attr !== typeof undefined && attr !== false) {
            var childItem = getChildItem($(this));
            childItem.addClass('mdc-menu-surface--open');
          }
        });

        // hover hide: CC-3434
        $('.navigation__level-three').mouseout(function(e) {
          if($('.mdc-tab:hover').length != 0){
            var childNavID = $(this).find('.navigation__primary-mdc-menu').attr('data-childnav');
            if($('.mdc-tab:hover').attr('data-parentnav') == childNavID){
            }
            else{
              hideDropdowns();
            }
          }
          if ($('.mdc-tab:hover').length != 0 || $('.navigation__primary-mdc-menu:hover').length != 0) {
          }
          else{
            hideDropdowns();
          }
        });

        $('.mdc-tab').mouseout(function(e) {
          if ($('.navigation__primary-mdc-menu:hover').length != 0 || mouseItem.hasClass('mdc-tab__ripple')) {
          }
          else{
            hideDropdowns();
          }
        });

        function getChildItem(parentItem){
          var navItem = parentItem.attr('data-parentnav');
          var childItem = $("div[data-childnav='"+navItem+"']");
          return childItem;
        }


        function hideDropdowns(){
          $('.navigation__primary-mdc-menu').removeClass('mdc-menu-surface--open');
        }
      });
    }
  };

})(jQuery, Drupal, drupalSettings, window);
