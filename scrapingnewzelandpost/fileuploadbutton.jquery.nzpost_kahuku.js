(function ($, Drupal, drupalSettings, w) {
  'use strict';
  Drupal.behaviors.fileuploadbuttonmaterial = {
    attach: function (context, settings) {
      $('.nzp-file-upload-button', context).once('fileUploadButton').each(function () {
        var fileUploadClass = 'nzp-file-upload-button';
        var buttonID = $(this).attr('id').replace(fileUploadClass + '-', '');
        $(this).click(function (e) {
          e.preventDefault();
          var fileButton = $('#' + buttonID);
          fileButton.change(function(){
            var fileLabel = $('#nzp-file-upload-label-'+buttonID);
            var files = $(this)[0].files;
            if(files.length > 1){
              fileLabel.text(files.length + ' files');
            }
            else if(files.length == 1) {
              let file = files[0];
              if(file.name.length > 0){
                fileLabel.text(file.name);
              }
            }
          });
          fileButton.click();
        });
      });
    }
  };
})(jQuery, Drupal, drupalSettings, window);
