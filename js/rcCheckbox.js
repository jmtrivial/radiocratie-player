/**
 * rcCheckbox.js
 * Version: 1.0.0
 * Author: Ron Masas
 */
(function($) {
    $.fn.extend({
        rcCheckbox: function() {
            this.destroy = function(){
                $(this).each(function() {
            		$(this).next('.rc-ui-select').remove();
                });
            };
            
            if ($(this).attr('data-rc-checkbox') === 'true') {
                return;
            }
            
            $(this).attr('data-rc-checkbox', 'true');
            
            $(this).each(function() {
                /**
                 * Original checkbox element
                 */
                var org_checkbox = $(this);
                /**
                 * iOS checkbox div
                 */
                var rc_checkbox = jQuery("<div>", {
                    class: 'rc-ui-select',
					title: 'qualité du flux'
                }).append(jQuery("<div>", {
                    class: 'inner'
                }));

                // If the original checkbox is checked, add checked class to the rc checkbox.
                if (org_checkbox.is(":checked")) {
                    rc_checkbox.addClass("checked");
                }
                
                // Hide the original checkbox and print the new one.
                org_checkbox.hide().after(rc_checkbox);
                
                if (org_checkbox.is(":disabled")){
                   // In case the original checkbox is disabled don't register the click event.
                	 return rc_checkbox.css('opacity','0.6');
                }
                
                // Add click event listener to the rc checkbox
                rc_checkbox.click(function() {
                    // Toggel the check state
                    rc_checkbox.toggleClass("checked");
                    // Check if the rc checkbox is checked
                    if (rc_checkbox.hasClass("checked")) {
                        // Update state
                        org_checkbox.prop('checked', true);
                    } else {
                        // Update state
                        org_checkbox.prop('checked', false);
                    }
                    
                    // Run click even in case it was registered to the original checkbox element.
                	org_checkbox.click();
                });
            });
            return this;
        }
    });
})(jQuery);
