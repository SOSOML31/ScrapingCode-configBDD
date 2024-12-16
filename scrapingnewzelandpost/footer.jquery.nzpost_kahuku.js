
(function ($, Drupal, drupalSettings, w) {
  'use strict';
  Drupal.behaviors.footer = {
    attach: function (context, settings) {
      $('.footer', context).once('footer').each(function () {
        $('.footer__upper-header-title-link--mobile').each(function(i){
          $(this).attr('aria-controls','footer__upper-content--panel-'+i)
            .attr('id','footer__upper-header-title-link--panel-'+i)
            .attr('aria-expanded','false');

          $(this).parent().find('.footer__upper-content--mobile')
            .attr('id','footer__upper-content--panel-'+i)
            .attr('aria-labelledby','footer__upper-header-title-link--panel-'+i);

          $(this).click(function(e){
            var activeTitleClass = 'footer__upper-header-title-link--active';
            var contentPanel = $(this).parent().find('.footer__upper-content--mobile');
            e.preventDefault();
            if($(this).hasClass(activeTitleClass)){
              contentPanel.slideUp(250);
              $(this)
                .removeClass(activeTitleClass)
                .attr('aria-expanded','false');
            }
            else{
              contentPanel.slideDown(250);
              $(this)
                .addClass(activeTitleClass)
                .attr('aria-expanded','true');
            }
          });
        });
        //shield script: https://shielded.co.nz/
        var shields = document.getElementsByClassName("keep-updated__icon-link--shielded");
        var i;
        for (i = 0; i < shields.length; i++) {
          shields[i].addEventListener("click", function(event){
            event.preventDefault()
            document.getElementById("shielded-logo").click();
          });
        }
        var frameName = new ds07o6pcmkorn({
          openElementId: "#shielded-logo",
          modalID: "modal",
        });
        frameName.init();
      });
    }
  };
  
  })(jQuery, Drupal, drupalSettings, window);
  