/**
 * @file
 * Contains fixes and general modification specific to node forms.
 * Modification works with elements with classes required.
 *
 */
(function($, Drupal, once) {
  'use strict';

  Drupal.behaviors.b5_dms_node_form = {
    attach: function (context) {
      var nodeForm = once('bs5-node-form', 'form.node-form', context);
      if (nodeForm.length) {
        nodeForm.forEach(processNodeForm);
      }

      var nodeFormConditionalFields = once('bs5-node-form-cfw', '.node-form .conditional-fields-wrapper', context);
      if (nodeFormConditionalFields.length) {
        nodeFormConditionalFields.forEach(processNodeFormConditionalFields);
      }

      // Overrides add more submit button.
      var iefAddMoreSubmit = once('bs5-ief-submit', '.field-add-more-submit', context);
      if (iefAddMoreSubmit.length) {
        iefAddMoreSubmit.forEach(processAddMoreSubmit);
      }

      // Overrides add more submit button.
      var flatpickrField = once('bs5-flatpickr', '.field--widget-datetime-flatpickr', context);
      if (flatpickrField.length) {
        flatpickrField.forEach(processFlatpickrField);
      }
    }
  }

  /**
   * Process node form to track changes and to prevent
   * from form submission without confirmation.
   *
   * @code
   *  <form class="node-form">
   *    <div class="form-actions">
   *      <input class="btn-navigate" value="Previous" />
   *      <input class="btn-navigate" value="Next" />
   *    </div>
   *  </form>
   * @endcode
   *
   * @param {object} element
   *   The node form context.
   */
  function processNodeForm(element) {
    var element = $(element);

    // Track node form changes.
    element.trackChanges();

    // Get the old form build ID to track form changes by using the form build ID for AJAX callbacks.
    var bIdOld = element.find('input[name="form_build_id"]').val() || undefined;

    // Show the modal confirmation before leaving the page.
    element.find('.form-actions .btn-navigate').click(function (ev) {
      var j = document.getElementById('js-modal');
      var b = $(this);

      // Compare the old form build ID with the updated build ID.
      var bIdNew = element.find('input[name="form_build_id"]').val() || undefined;
      var bIdUpdated = bIdNew !== undefined && bIdOld !== undefined && bIdNew !== bIdOld;

      if (j && (element.isChanged() || bIdUpdated)) {
        var m = $(j);
        var bm = new bootstrap.Modal(j, {
          'backdrop': false,
          'keyboard': false,
        });

        m.find('.modal-title').text(Drupal.t('Leave without saving?'));
        m.find('.modal-body').text(Drupal.t('Changes you have made so far will not be saved.'));
        m.find('.modal-footer .btn-cancel').text(Drupal.t('Stay on this page'));
        m.find('.modal-footer .btn-continue').text(Drupal.t('Leave'));

        // Unbind the modified submit handler to the clicked buttons
        // to continue with their original behaviour on continue confirmation.
        m.find('.modal-footer .btn-continue').click(function () {
          b.unbind('click').click();
        });

        // Show modal.
        bm.show();

        // Prevent the default form submission.
        ev.preventDefault();
      }
    });

    // Add the change event listener to each group visibility option input.
    element.find('.group-visibility-option input').on('change', handleVisibilityChange);

    // Initial call to set visibility based on the default selected value.
    handleVisibilityChange();
  }

  /**
   * Resolves issue with conditional fields form group.
   * To apply the fix, the conditional fields must be
   * wrapped in ".conditional-fields-wrapper" element class.
   *
   * @param {object} element
   *   The conditional fields wrapper context.
   */
  function processNodeFormConditionalFields(element) {
    var element = $(element);

    // Show the wrapper by default if children contains visible attribute.
    if (element.children(':visible').length) {
      element.addClass('show');
    }

    // Callback function to execute when mutations are observed.
    var callback = function(mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.type == 'attributes') {
          var target = $(mutation.target);
          var parent = target.parent();
          var hide = target.parent().children(':visible').length === 0;

          // The wrapper is hidden in CSS to avoid unusual display behavior
          // while the page is being loaded.
          setTimeout(function() {
            if (!hide) {
              parent.closest('.conditional-fields-wrapper').addClass('show');
            }
          }, 300);

          // Look for hidden children. If all are hidden,
          // then hide the wrapper by removing "show" class.
          if (hide) {
            parent.closest('.conditional-fields-wrapper').removeClass('show');
          }
        }
      }
    };

    // Select the node that will be observed for mutations.
    var targetNode = element.find('.form-group')[0];

    // Create an observer instance linked to the callback function.
    var observer = new MutationObserver(callback);

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true };

    // Start observing the target node for configured mutations.
    observer.observe(targetNode, config);
  }

  /**
   * Adds "Enter date" placeholder.
   * Also, sets a delay once context was loaded as initially the element is empty.
   *
   * @param {object} element
   *   The date picker field context.
   */
  function processFlatpickrField(element) {
    element = $(element);
    element.each(function() {
      var input = $(this).find('input');
      setTimeout(function() {
        input.next('input').attr('placeholder', Drupal.t('Enter date'));
      }, 1000);
    });
  }

  /**
   * Overrides the ".field-add-more-submit" element text
   * using the parent "ief-submit" class and "ief-add-more" attribute.
   *
   * @code
   *  <div class="ief-submit" ief-add-more="add more foo text">
   *  <div class="field--type-entity-reference"></div>
   *  </div>
   * @endcode
   *
   * @param {object} element
   *   The form or submit wrapper context.
   */
  function processAddMoreSubmit(element) {
    element = $(element);
    var addMoreSubmit = element.closest('.field--type-entity-reference').parent('.ief-submit');
    if (addMoreSubmit.length) {
      var submit = addMoreSubmit.attr('ief-add-more') || 'Add more';
      element.val(Drupal.t(submit));
    }
  }

  /**
   * Hide or show the element by data-visibility attribute value.
   *
   * @code
   *  <div class="group-visibility-option">
   *    <input type="radio" value="1" />
   *    <input type="radio" value="2" />
   *  </div>
   *  <div class="group-visibility-item" data-visibility="1"></div>
   *  <div class="group-visibility-item" data-visibility="2"></div>
   *  <div class="group-visibility-item" data-visibility="1|2"></div>
   * @endcode
   */
  function handleVisibilityChange() {
    var selected_values = [];

    // Get all checked checkbox values.
    $('.group-visibility-option input:checked').each(function() {
      selected_values.push($(this).val());
    });

    // Show / hide elements based on checked values.
    $('.group-visibility-item').each(function() {
      var visibility_values = $(this).attr('data-visibility').split('|');
      var show = false;

      for (var i = 0; i < visibility_values.length; i++) {
        if (selected_values.includes(visibility_values[i])) {
          show = true;
          break;
        }
      }

      $(this).removeClass('show');
      if (show) {
        $(this).addClass('show');
      }
    });
  }

  // Extends the jQuery prototype.
  $.fn.extend({
    // Track of any modifications to the input elements.
    trackChanges: function() {
      $(":input",this).change(function() {
        $(this.form).data("changed", true);
      });
    },

    // Verifies whether any changes have been made to the form.
    isChanged: function() {
      return this.data("changed");
    },
   });

})(jQuery, Drupal, once);
