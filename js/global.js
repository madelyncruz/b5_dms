(function ($, Drupal, drupalSettings) {
  'use strict';

  /**
   * Retrieves user data by their user ID using an AJAX request.
   *
   * @param {string} [url='api/users'] - The URL endpoint to retrieve user data from. If not provided, it defaults to 'api/users'.
   * @returns {Promise<Object|undefined>} A Promise that resolves with the user data object or undefined if no user is found. Rejects with an error message on failure.
   */
  window.getUserById = function(url) {
    // Default to 'api/users' if url is not provided.
    const r = url || 'api/users';

    // Get the user ID from drupalSettings.
    const uid = drupalSettings.user.uid;

    return new Promise(function(resolve, reject) {
      // Make an AJAX request to retrieve user data.
      $.ajax({
        url: Drupal.url(`${r}/${uid}`),
        method: 'GET',
        dataType: 'json',
      })
      .then(function(data) {
        // Resolve with the user data object found or undefined.
        resolve(data[0] || undefined);
      })
      .fail(function(xhr, status, error) {
        // Log an error message and reject the Promise on failure.
        console.error(`User ${uid} request failed: ${error}`);
        reject(error);
      });
    });
  }

  /**
   * Checks if any of the specified roles are present in the input role string.
   *
   * @param {Object} options - The input options.
   * @param {string[]} options.allowedRoles - An array of roles to check against.
   * @param {string} options.role - The input role string to be checked.
   *
   * @returns {boolean} Returns `true` if any of the specified roles are found in the input role string, otherwise `false`.
   *
   * @example
   * // Usage example:
   * const allowedRoles = ['site_architect', 'abnb_administrator', 'abnb_senior_operator'];
   * const inputRole = "qa_tester, abnb_administrator";
   * const result = hasMatchingRolesInInput({ allowedRoles, role: inputRole });
   * if (result) {
   *   console.log('At least one of the allowed roles is present in the input role string.');
   * } else {
   *   console.log('None of the allowed roles are present in the input role string.');
   * }
   */
  window.hasMatchingRolesInInput = function({ allowedRoles, role }) {
    // Split the input string into an array of roles.
    var roles = role.split(', ');
    for (var i = 0; i < allowedRoles.length; i++) {
      if (roles.includes(allowedRoles[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Copies the provided content to the clipboard.
   *
   * @param {string} content - The text content to be copied.
   * @returns {boolean} - Returns true if the content was successfully copied; otherwise, false.
   */
  window.copyContent = function(content) {
    // Create a new textarea element to hold the content.
    var textArea = document.createElement('textarea');
    var contentToCopy = content;

    // Set the value of the textarea to the content to be copied.
    textArea.value = contentToCopy;

    // Append the textarea element to the DOM.
    document.body.appendChild(textArea);

    // Select the text within the textarea.
    textArea.select();

    // Execute the copy command to copy the selected text to the clipboard.
    var successful = document.execCommand('copy');

    // Remove the textarea element from the DOM.
    document.body.removeChild(textArea);

    return successful;
  }

})(jQuery, Drupal, drupalSettings);
