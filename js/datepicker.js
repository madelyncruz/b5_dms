
(function ($, Drupal, once) {
  'use strict';

  Drupal.behaviors.b5_dms_datepicker = {
    attach: function (context) {
      var bsDatepicker = once('bs5-dms-bs-datepicker', '.bs-datepicker', context);
      if (bsDatepicker.length) {
        bsDatepicker.forEach((d) => processDatepicker($(d)));
      }
    }
  };

  /**
   * Processes a datepicker for the given element based on data attributes.
   *
   * @param {jQuery} $element
   *   jQuery object representing the element containing the datepicker configuration.
   */
  function processDatepicker($element) {
    const $input = $element.find('input');

    // Skip if input doesn't exists.
    if (!$input.length) {
      return;
    }

    // Parse element settings.
    const settingsString = $element.attr('data-settings');
    const settings = settingsString && JSON.parse(settingsString) || {};
    const { type, format, startDate, endDate } = settings;

    // Prepare datepicker options.
    const datepickerOptions = {
      // Close the datepicker immediately when a date is selected.
      autoclose: true,
    };

    // Datepicker options for year type.
    if (type === 'year') {
      // Format and notice the extra space at the beginning.
      datepickerOptions.format = ' yyyy';

      // Set minimum view to year view.
      datepickerOptions.minViewMode = 2;

      // Show the year view initially.
      datepickerOptions.startView = 2;

      // Show years.
      datepickerOptions.viewMode = 'years';
    }
    else {
      datepickerOptions.format = format;
    }

    // Add end date if provided.
    if (endDate) {
      datepickerOptions.endDate = endDate;
    }

    // Add start date if provided.
    if (startDate) {
      datepickerOptions.startDate = startDate;
    }

    // Initialize datepicker with options.
    $input.datepicker(datepickerOptions);
  }

})(jQuery, Drupal, once);
