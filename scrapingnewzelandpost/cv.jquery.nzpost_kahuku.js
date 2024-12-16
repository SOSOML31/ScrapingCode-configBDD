/**
 * @file
 * Attaches behaviors for the Clientside Validation jQuery module for MDC text field.
 * 
 * Note: Statements relating to .form-item--error-message are carryover from early work on this
 *       script. They've been left in cos they're useful for debugging
 */


(function ($) {
  // Override clientside validation jquery validation options.
  // We do this to display the error markup same as in inline_form_errors.
  $(document).once('cvjquery').on('cv-jquery-validate-options-update', function (event, options) {
    options.errorElement = 'strong';
    options.showErrors = function (errorMap, errorList) {
      this.defaultShowErrors();

      // items validated by jquery_validate
      validationItems = $(this);
      if(validationItems.length >= 1){
        validationItemsLength = validationItems.length;
        var count = 0;
        // loop each validated item/field
        while(count < validationItemsLength){
          var itemErrorList = validationItems[count]['errorList'];
          // if.. the validaated item has any errors
          if(itemErrorList.length >= 1){
            for (var i in itemErrorList) {
              
              var fieldElement = itemErrorList[i]['element'];
              // Replace default jQuery validate message, hide helper text.
              $(fieldElement).each(function(){
                var errorElement = $(this).parent().find('strong.error');
                // Assume helper always exists as part of our components (even if empty)
                var helperContainer = $(this).parent().parent().find('.mdc-text-field-helper-line');
                var child = errorElement.clone(true);
                child.addClass('mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text');
                
                //  remove default jquery validate msg
                errorElement.remove();
      
                //  hide helper text to display an error msg
                helperContainer.find('.mdc-text-field-helper-text--persistent').hide();
                // remove old msg
                helperContainer.find('.mdc-text-field-helper-text--validation-msg').remove();
                //  preappend new error msg for this helper container
               child.prependTo(helperContainer);
             });
            }
          }
          // else.. the validated item has no errors
          else{
            var itemSuccessList = validationItems[count]['successList'];
            var itemSuccessListLength = itemSuccessList.length;
            var itemSuccessListCount = 0;
            while(itemSuccessListCount < itemSuccessListLength){
              // Show helper text, remove validation message
              $(itemSuccessList[itemSuccessListCount]).each(function(){
                var helperContainer = $(this).parent().parent().find('.mdc-text-field-helper-line');
                helperContainer.find('.mdc-text-field-helper-text--persistent').show();
                helperContainer.find('.mdc-text-field-helper-text--validation-msg').remove();
              });
              itemSuccessListCount++;
            }

          }
          count++;
        }

      }
    };
  });
})(jQuery);

