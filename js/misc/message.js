/**
 * @file
 * Replaced Drupal cores message API.
 */
((Drupal) => {
  /**
   * @typedef {class} Drupal.Message~messageDefinition
   */

  /**
   * Theme function for a message.
   *
   * @param {object} message
   *   The message object.
   * @param {string} message.text
   *   The message text.
   * @param {object} options
   *   The message context.
   * @param {string} options.type
   *   The message type.
   * @param {string} options.id
   *   ID of the message, for reference.
   * @param {bool} options.defaultIcon
   *   Use the message type as the default icon.
   * @param {string} options.icon
   *   The icon class.
   *
   * @return {HTMLElement}
   *   A DOM Node.
   */
  Drupal.theme.message = ({ text }, { type, id, defaultIcon, icon }) => {
    const messagesTypes = Drupal.Message.getMessageTypeLabels();
    const messageWrapper = document.createElement('div');
    const messageItem = document.createElement('div');

    // Set the root element attributes.
    messageWrapper.setAttribute('class', 'messages-wrapper bg-white');
    messageWrapper.appendChild(messageItem);

    // Set the message item element attributes.
    messageItem.setAttribute('class', `messages alert alert-dismissible alert-${type.replace('error', 'danger')}`);
    messageItem.setAttribute(
      'role',
      type === 'error' || type === 'warning' ? 'alert' : 'status',
    );
    messageItem.setAttribute('data-drupal-message-id', id);
    messageItem.setAttribute('data-drupal-message-type', type);
    messageItem.setAttribute('aria-label', messagesTypes[type]);

    // Append the "messages-content" element to the root "messages-content" element.
    const messageContent = document.createElement('div');
    messageItem.appendChild(messageContent);
    messageContent.classList.add('messages-content', 'd-flex', 'gap-3');

    // Append the "messages-content-icon" element to the root "messages-content" element.
    // See @scss/styles/iconography.min.scss for the classes that can be used.
    const messageContentIcon = document.createElement('i');
    if (defaultIcon || icon) {
      messageContentIcon.classList.add('messages-content-icon');
      messageContent.appendChild(messageContentIcon);
    }
    if (defaultIcon) {
      if (type === 'success') {
        messageContentIcon.classList.add('icon-24x24', 'icon-r1', 'icon-c1');
      }
      else if (type === 'warning') {
        messageContentIcon.classList.add('icon-24x24', 'icon-r1', 'icon-c13');
      }
      else if (type === 'error') {
        messageContentIcon.classList.add('icon-24x24', 'icon-r1', 'icon-c5');
      }
    }
    if (icon) {
      icon = icon.split(' ');
      for (var i = 0; i < icon.length; i++) {
        messageContentIcon.classList.add(icon[i]);
      }
    }

    // Append the "messages-content-body" element to the root "messages-content" element.
    const messageContentBody = document.createElement('div');
    messageContent.appendChild(messageContentBody);
    messageContentBody.classList.add('messages-content-body');
    messageContentBody.innerHTML = `${text}`;

    return messageWrapper;
  };
})(Drupal);
