
(function ($, Drupal, once, drupalSettings) {
  'use strict';

  var self;
  var $element;

  Drupal.behaviors.b5_dms = {
    attach: function (context, settings) {
      self = this;

      // Override bs4_modal_dialog default settings.
      if (drupalSettings.bs4_modal_dialog) {
        // Extra large and centered dialog.
        drupalSettings.bs4_modal_dialog.dialogClasses = 'modal-dialog-centered modal-xl';

        // Override dialog button classes.
        drupalSettings.bs4_modal_dialog.buttonPrimaryClass = 'btn-outline-gradient';

        // Disable the automatic dismissal of a Bootstrap Modal
        // when clicking outside of it or pressing the 'Escape' key.
        // drupalSettings.bs4_modal_dialog.backdrop = 'static';
        // drupalSettings.bs4_modal_dialog.keyboard = false;
      }

      // Scroll active nav item into view
      var stepper = once('bs5-stepper', '.stepper', context);
      if (stepper.length) {
        stepper.forEach(processStepper);
      }

      var sidebarNav = once('b5-dms-sidebar-nav', '.sidebar-nav', context);
      if (sidebarNav.length) {
        sidebarNav.forEach(processSidebarNav);
      }

      var assignToMe = once('b5-dms-assignee', '.js-assignee', context);
      if (assignToMe.length) {
        assignToMe.forEach(processAssignToMe);
      }

      // Scroll active tabbable nav item into view.
      var tabbable = once('bs5-tabbable-nav', '.tabbable-nav > .nav', context);
      if (tabbable.length) {
        tabbable.forEach(processTabbable);
      }

      var cardTitle = once('bs5-card-title', '[card-title]', context);
      if (cardTitle.length) {
        cardTitle.forEach(processCardTitle);
      }

      var copyContent = once('bs5-copy-content', '.js-copy-content', context);
      if (copyContent.length) {
        copyContent.forEach(processCopyContent);
      }

      var navbar = once('bs5-navbar', '.navbar-nav', context);
      if (navbar.length) {
        navbar.forEach(processNavbar);
      }

      var formExposedFilter = once('bs5-form-exposed-filter', '.form-exposed-filter', context);
      if (formExposedFilter.length) {
        formExposedFilter.forEach(processFormExposedFilter);
      }

      var cardView = once('bs5-card-view', '.card-view.-stacked', context);
      if (cardView.length) {
        $(cardView).each(function() {
          $(this).find('.-left').matchHeight({
            property: "min-height",
            target: $(this).find('.-right')
          });
        });
      }

      // Enable popovers.
      var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl, { html: true })
      });

      // Enable back to top.
      var backTop = once('bs5-back-top', '.back-top', context);
      if (backTop.length) {
        backTop.forEach(processBackTop);
      }

      // Play embedded video.
      var playVideo = once('bs5-play-video', '.btn-play.-play-video', context);
      if (playVideo.length) {
        playVideo.forEach(processPlayVideo);
      }

      // Responsive menu.
      var mmPanels = once('bs5-mm-panels', '.mm-panels>.project-back-button', context);
      if (mmPanels.length) {
        mmPanels.forEach(processMmPanels);
      }

      // Card collapse.
      var cardCollapse = once('bs5-card-collapse', '.card-collapse', context);
      if (cardCollapse.length) {
        cardCollapse.forEach(processCardCollapse);
      }
    },
  };

  Drupal.behaviors.b5_dms_modules = {
    attach: function (context) {
      if ($.fn.datepicker) {
        var datepicker = once('bs5-dms-datepicker', '.views-exposed-form .js-form-date-wrapper input, .views-exposed-form .js-form-item-date input', context);
        if (datepicker.length) {
          datepicker.forEach(processDatePicker);
        }
      }
    }
  };

  /**
   * Processes the collapsible card.
   *
   * @param {object} element
   *   The collapsible card context.
   *
   * @example
   * // Usage example:
   * <div class="card card-collapse">
    * <div class="card-body">
    *   <div class="collapse"></div>
    * </div>
    * <div class="card-footer">
    *   <div data-bs-toggle="collapse" data-bs-toggle-title="See more details|See fewer details"></div>
    * </div>
   * </div>
   */
  function processCardCollapse(element) {
    var $element = $(element);

    // Replace the button text on collapse hidden.
    $element.find('.collapse').on('hidden.bs.collapse', function () {
      getCardCollapseTitles({ body: $(this).parent(), type: 'hidden' });
    });

    // Replace the button text on collapse shown.
    $element.find('.collapse').on('shown.bs.collapse', function () {
      getCardCollapseTitles({ body: $(this).parent(), type: 'shown' });
    });
  }

  /**
   * Override the collapsible button titles.
   *
   * @param {object} body
   *   The card body object.
   * @param {string} type
   *   The type of collapse event fired.
   */
  function getCardCollapseTitles({ body, type }) {
    var $body = $(body);

    // Get the button from the footer.
    var $button = $body.next('.card-footer').find('.btn[data-bs-toggle="collapse"]');

    // Get the toggle title attribute.
    var title = $button.attr('data-bs-toggle-title') || undefined;

    // Split titles into an array of substrings.
    var titles = title.split('|');

    // Get the expand and collapse title.
    var expandTitle = titles && titles[0] || null;
    var collapseTitle = titles && titles[1] || null;

    // Skip if both titles are empty.
    if (!expandTitle || !collapseTitle) {
      return;
    }

    // Override the collapsible button text.
    $button.text(Drupal.t(type === 'hidden' ? expandTitle : collapseTitle));
  }

  /**
   * Processes the behavior for a "back to top" functionality on a webpage.
   *
   * @param {object} element
   *   The back to top context.
   */
  function processBackTop(element) {
    var el = $(element);
    var m = $('#main-container');
    $(window).on('scroll', function(e) {
      var topPos = $(this).scrollTop();
      if (!el.hasClass('hide') && topPos < m.offset().top) {
        el.addClass('hide');
        el.fadeTo(300, 0);
        el.removeClass('scrolling');
      }
      if (el.hasClass('hide') && topPos > m.offset().top) {
        el.removeClass('hide');
        el.fadeTo(300, 1);
      }
    });
    el.click(function() {
      if (!el.hasClass('scrolling')) {
        el.addClass('scrolling');
        _scrollToDiv(m);
      }
    });
  }

  /**
   * Override the text of the `.card > .card-header` element
   * using the tokenized parent attribute `card-title`.
   *
   * The overrides commonly used in entity views using the multi-valued entity referenced fields.
   *
   * It is also supported in the DS layout attribute,
   * where we can define the `card-title` attribute under the 'Custom wrappers' tab.
   *
   * @code
   *  <div card-title="placeholder title: [node:title]">
   *    <div class="card">
   *      <h3 class="card-header"></h3>
   *    </div>
   *  </div>
   * @endcode
   *
   * @param {object} element
   *   The card wrapper context.
   */
  function processCardTitle(element) {
    element = $(element);

    // The card may contain another card inside using the `field_group` layout.
    // To ensure that the overrides will only apply to itself,
    // make sure to obtain the first card header element using the eq() method.
    var j = element.find('.card > .card-header').eq(0).length && element.find('.card > .card-header').eq(0) || undefined;

    // Check if both the title and required attributes exist before overriding the text.
    if (j && element.attr('card-title')) {
      j.text(element.attr('card-title'));
    }
  }

  /**
   * Binds a click event handler to copy content from a specified element when a button is clicked.
   *
   * @code
   *  <div class="js-copy-content">
   *    <div class="content-value"></div>
   *    <div class="content-btn"></div>
   *  </div>
   * @endcode
   *
   * @param {object} element
   *   The copy content context.
   */
  function processCopyContent(element) {
    element = $(element);
    element.find('.content-btn').click(function() {
      var $btn = $(this);
      var successText = $btn.attr('data-success-text') || Drupal.t('Successfully copied');
      var successful = copyContent(element.find('.content-text').html());
      if (successful) {
        // Check if the button has a popover attached, and remove it if it does.
        if ($btn.data('bs.popover')) {
          $btn.popover('dispose');
        }

        // Trigger popover.
        $btn.popover({
          placement: 'top',
          trigger: 'manual', // Set trigger to 'manual' to control it programmatically.
          html: true, // Enable HTML content in the popover.
          content: `
            <div class="popover-content d-flex align-items-center gap-1">
              <i class="icon-check-circle-fill fs-9 text-success"></i>
              ${successText}
            </div>
          `,
        });

        // Show the popover.
        $btn.popover('show');

        // Hide the popover after a delay.
        setTimeout(function() {
          $btn.popover('hide');
        }, 2000);
      }
    });
  }

  /**
   * The date widget processing callback to enforce date the fields
   * to use datepicker instead of the HTML date type due to date formatting issue.
   *
   * @param {object} element
   *   The datapicker input context.
   */
  function processDatePicker(input) {
    var $element = $(input);
    $element.attr({
      'type': 'text',
      'autocomplete': 'off',
      'placeholder': $element.attr('value') ? $element.attr('value') : 'dd-mm-yyyy',
      'value': $element.attr('value'),
    });
    $element.datepicker({
      dateFormat: 'dd-mm-yy',
    });
  }

  /**
   * Inserts the specified element after the '.mm-panels' element
   * and removes specific classes.
   *
   * @param {object} element
   *   The mm-panels context.
   */
  function processMmPanels(element) {
    $(element).insertAfter($('.mm-panels'));
    $(element).removeClass('mm-hidden mm-panel');
  }

  /**
   * Process navbar overrides.
   *
   * @param {object} element
   *   The navbar context.
   */
  function processNavbar(element) {
    element = $(element);

    // Scroll to hash element.
    element.find('.nav-link').click(function(e) {
      var hash = $(this)[0].hash;
      if (hash && !$(this).hasClass('active')) {
        element.find('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('html').animate({
          scrollTop: $(hash).offset().top
        }, 500);
        e.preventDefault();
      }
    });
  }

  /**
   * Attaches a click event to the provided element
   * to play a video using an iFrame embed.
   *
   * @param {object} element
   *   The play video context.
   */
  function processPlayVideo(element) {
    element = $(element);
    element.click(function(e) {
      var button = $(this);
      var iframe = $('<iframe>', {
        "height": "100%",
        "width": "100%",
        "src": button.attr('href'),
        "frameborder": "0",
        "allow": "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
        "allowfullscreen": true
      });

      /**
       * The embed aspect ratio eg. 21x9, 16x9, 4x3 or 1x1
       */
      var embed = $('<div/>');
      var ratio = button.attr('data-ratio');
      if (ratio) {
        embed.addClass('ratio ratio-' + ratio);
      }
      embed.append(iframe);

      var el = $(button.attr('data-target'));
      if (!button.hasClass('-playing') && el) {
        button.addClass('-playing');
        el.html(embed);
        button.fadeTo(500, 0.5);
      }
      return false;
    });
  }

  /**
   * Process views exposed filter overrides.
   *
   * @param {object} element
   *   The views exposed filter wrapper context.
   */
  function processFormExposedFilter(element) {
    element = $(element);

    // Reload the page when clickin on the `.btn-reset` button.
    element.find('.btn-reset').on('click', function() {
      location.reload();
    });
  }

  /**
   * Scroll active tabbable nav item into view.
   *
   * @param {object} element
   *   The tabbable context.
   */
  function processTabbable(element) {
    var offset = 80;
    var $tabbable = $(element);

    // Get the active nav item.
    var $activeNavItem = $tabbable.find('.nav-link.active');

    if ($activeNavItem.length) {
      $tabbable.animate({
        scrollLeft: ($activeNavItem.offset().left - (($tabbable.width() - $activeNavItem.width()) / 2)) - offset
      }, 100);
    }

    $tabbable.fadeTo(300, 1);
  }

  /**
   * Process the "Assign to Me" functionality for a given element.
   *
   * This function selects the current user as the assignee when a related
   * element with the class 'assignee' is clicked.
   *
   * @param {jQuery|HTMLElement} element - The element to process.
   */
  function processAssignToMe(element) {
    element = $(element);
    var assignee = element.find('.assignee');
    var select = element.find('select');


    assignee.on('click', function() {
      select.val(drupalSettings.user.uid).trigger('chosen:updated');
    });

    // Pre-populate the assignee on node add.
    if (drupalSettings.path.currentPath.includes('node/add') && select.val() == SELECT_NONE) {
      assignee.trigger('click');
    }
  }

  /**
   * Process a sidebar navigation element and enable slide toggle if applicable.
   *
   * @param {Object} element - The sidebar navigation context.
   */
  function processSidebarNav(element) {
    var sidebar = $(element);
    var slideToggle = sidebar.find('.js-slide-toggle');

    if (slideToggle.length) {
      sidebarNavSlideToggle(slideToggle);
    }
  }

  /**
   * Scroll active nav item into stepper view.
   *
   * @param {object} element
   *   The stepper context.
   */
  function processStepper(element) {
    var offset = 80;
    var $stepper = $(element);

    // Get the active nav item.
    var $activeNavItem = $stepper.find('.nav-link.active');

    if ($activeNavItem.length) {
      $stepper.animate({
        scrollLeft: ($activeNavItem.offset().left - (($stepper.width() - $activeNavItem.width()) / 2)) - offset
      }, 100);
    }

    $stepper.fadeTo(300, 1);
  }

  /**
   * Toggle the state of the sidebar navigation region.
   *
   * @param {Object} button - The JavaScript toggle button.
   */
  function sidebarNavSlideToggle(button) {
    var sidebar = button.closest('.sidebar-nav');
    var slideToggleStorageKey = 'sidebar-nav-slide-toggle';
    var currSlideToggle = window.localStorage.getItem(slideToggleStorageKey) || SIDEBAR_NAV_SLIDE_TOGGLE_IN;

    button.addClass(currSlideToggle === SIDEBAR_NAV_SLIDE_TOGGLE_IN ? 'active' : '');
    sidebar.addClass(currSlideToggle);

    button.on('click', function() {
      const $button = $(this);
      const toggleTo = currSlideToggle === SIDEBAR_NAV_SLIDE_TOGGLE_IN ? SIDEBAR_NAV_SLIDE_TOGGLE_OUT : SIDEBAR_NAV_SLIDE_TOGGLE_IN;
      currSlideToggle = toggleTo;

      $button.toggleClass('active');
      sidebar
        .toggleClass(`${SIDEBAR_NAV_SLIDE_TOGGLE_IN} ${SIDEBAR_NAV_SLIDE_TOGGLE_OUT}`, false)
        .toggleClass(toggleTo, true);
      window.localStorage.setItem(slideToggleStorageKey, toggleTo);
    });
  }

  // Define constants.
  const SIDEBAR_NAV_SLIDE_TOGGLE_IN = 'expanded';
  const SIDEBAR_NAV_SLIDE_TOGGLE_OUT = 'collapsed';
  const SELECT_NONE = '_none';

})(jQuery, Drupal, once, drupalSettings);

/**
 * Scroll to the target div.
 */
 function _scrollToDiv(target, speed, offset) {
  speed = speed == undefined ? 600 : speed;
  offset = offset == undefined ? 100 : offset;
  jQuery('html, body').animate({
    scrollTop: target.offset().top - offset
  }, speed);
}
