/**
 * @file
 * Replaced Drupal cores ajax throbber(s), see: https://www.drupal.org/node/2974681
 *
 */
(function ($, Drupal) {
  Drupal.theme.ajaxProgressThrobber = (message) => {
    var throbber = Bs5Spinner();
    var messageClass = typeof message === 'string' ? ' -message' : '';

    if (typeof message === 'string') {
      throbber = '<div class="ajax-progress ajax-progress-throbber spinner-grow">'
      throbber += ('<div class="throbber sr-only">&nbsp;</div>')  + '</div>'
      throbber += Drupal.theme('ajaxProgressMessage', message);
      throbber += Bs5SpinnerClose();

      // Add spinner close click handler.
      $(throbber).find('.spinner-border-close').click(function() {
        $(throbber).remove();
      });
    }

    // Prepare throbber output.
    var output = `<div class="spinner-border-throbber spinner-ajax btn btn-light text-dark-600 btn-sm` + messageClass +`">
      <div class="spinner-border-inner d-flex gap-2">
        ` + throbber + `
      </div>
    </div>`;

    return output;
  };

  Drupal.theme.ajaxProgressIndicatorFullscreen = () => {
    return Bs5Spinner();
  };

  Drupal.theme.ajaxProgressClose = () => {
    return Bs5SpinnerClose();
  };

  /**
   * @return (string) The HTML markup of Bootstrap 5 spinner.
   *
   * @see https://getbootstrap.com/docs/5.1/components/spinners/
   */
  const Bs5Spinner = () => {
    return `<div class="spinner-border-full">
      <div class="spinner-border-inner">
        <div class="spinner-border text-primary mx-auto" role="status">
          <span class="ajax-spinner__label"></span>
        </div>
      </div>
    </div>`;
  };

  /**
   * @return (string) The HTML markup of Bootstrap 5 spinner close.
   */
  const Bs5SpinnerClose = () => {
    return `<div class="spinner-border-close">
      <i class="icon-12x12 icon-r3 icon-c2"></i>
    </div>`;
  };

})(jQuery, Drupal);
