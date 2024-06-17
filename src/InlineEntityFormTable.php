<?php

namespace Drupal\b5_dms;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Url;

/**
 * Provides a class for inline entity form table.
 */
class InlineEntityFormTable {

  /**
   * The entity display mode.
   *
   * @var string
   */
  protected $display = 'default';

  /**
   * The currently active request object.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $request;

  /**
   * The IEF settings.
   *
   * @var array
   */
  protected $settings;

  /**
   * The entity object.
   *
   * @var \Drupal\Core\Entity\EntityInterface
   */
  protected $entity;

  /**
   * An additional dialog options.
   *
   * @var array
   */
  protected $dialogOptions;

  /**
   * Alter the IEF table.
   *
   * @param array $variables
   *   The variables from IEF table template.
   *
   * @see template_inline_entity_form_entity_table()
   */
  public function alterTable(array &$variables) {
    // Get the information as possible.
    $table = &$variables['table'];
    $header = &$variables['table']['#header'] ?? NULL;
    $form = &$variables['form'];
    $form_id = $form['#id'];

    // Register view and display ID for theme container suggestions usage.
    $route_match = \Drupal::routeMatch();
    $view_id = $route_match->getParameter('view_id');
    $display_id = $route_match->getParameter('display_id');
    $parent_node = $route_match->getParameter('node') ?? NULL;

    // Build sticky actions header.
    if ($header) {
      $operations_idx = array_key_last($header);
      $header[$operations_idx] = [
        'data' => t('Actions'),
        'class' => ['views-align-right'],
      ];
    }

    // Get the IEF theme settings.
    $this->settings = [
      'apply_dialog_exclude' => _b5_dms_apply_element($form_id, 'modal'),
      'dialog_type' => theme_get_setting('b5_dms_ief_table_action') ?? NULL,
      'display_id' => $display_id ?? NULL,
      'form_id' => $form_id,
      'view_id' => $view_id ?? NULL,
    ];

    // Set the dialog options.
    $this->dialogOptions = $this->setDialogOptions();

    /** @var \Symfony\Component\HttpFoundation\Request $request */
    $this->request = \Drupal::request();

    // Set default edit form ID.
    $edit_form_id = _b5_dms_remove_random_characters($variables['form']['#id']);

    foreach (Element::children($form) as $key) {
      /** @var \Drupal\Core\Entity\FieldableEntityInterface $entity */
      $this->entity = $form[$key]['#entity'];
      $cell = &$table[$key];

      if (isset($cell['actions']['ief_entity_edit'])) {
        if ($this->entity instanceof EntityInterface && !$this->entity->isNew()) {
          $this->setActionLinks($cell, 'edit', $this->settings['apply_dialog_exclude']);
        }
      }

      // Add dropdown-item class.
      if (isset($cell['actions']['ief_entity_edit'])) {
        $cell['actions']['ief_entity_edit']['#attributes']['class'][] = 'dropdown-item';
        if ($this->entity instanceof EntityInterface && $parent_node instanceof EntityInterface) {
          // Additional identifiers for specific parent and entity bundle
          // for template suggestions usage.
          $edit_cell_id = $edit_form_id;
          $edit_cell_id .= '__parent_' . $parent_node->bundle() . '__entity_' . $this->entity->bundle();
          $cell['actions']['ief_entity_edit']['#attributes']['data-form-id'] = _b5_dms_convert_html_id($edit_cell_id, $use_html = FALSE);

          // Add entity data for template usage.
          $cell['actions']['ief_entity_edit']['#entity_data'] = [
            'bundle' => $this->entity->bundle(),
            'id' => $this->entity->id(),
            'type' => $this->entity->getEntityTypeId(),
            'parent' => [
              'bundle' => $parent_node->bundle(),
              'id' => $parent_node->id(),
              'type' => $parent_node->getEntityTypeId(),
            ],
          ];
        }
      }

      if (isset($cell['actions']['ief_entity_remove'])) {
        $cell['actions']['ief_entity_remove']['#attributes']['class'][] = 'dropdown-item';
      }
      if (isset($cell['actions']['ief_entity_duplicate'])) {
        $cell['actions']['ief_entity_duplicate']['#attributes']['class'][] = 'dropdown-item';
      }

      // Make the action cell sticky.
      $table[$key]['actions']['#wrapper_attributes']['class'][] = 'views-align-right';
    }
  }

  /**
   * Set the IEF action links.
   */
  protected function setActionLinks(array &$cell, string $op, $no_dialog = FALSE) {
    if (!$this->entity) {
      return;
    }

    // Get the entity type ID.
    $entity_type_id = $this->entity->getEntityTypeId();

    if ($op == 'edit') {
      $cell['actions']['ief_entity_edit']['#attributes']['class'] = [];

      if ($this->settings['dialog_type'] && !$no_dialog) {
        $edit_url = Url::fromRoute('entity.' . $entity_type_id . '.edit_form', [
          $entity_type_id => $this->entity->id(),
        ]);

        // Get the edit route parameters.
        $edit_params = $edit_url->getRouteParameters();

        // Set display parameters.
        // Works with `form_mode_control` module.
        $edit_url->setRouteParameter('display', $this->display);

        // Override the IEF edit behavior.
        $cell['actions']['ief_entity_edit'] = [
          '#type' => 'link',
          '#title' => t('Edit'),
          '#url' => $edit_url,
        ];

        // Register view and display ID for theme container suggestions usage.
        $cell['actions']['ief_entity_edit']['#attributes']['data-form-id'] = $this->settings['form_id'];
        $cell['actions']['ief_entity_edit']['#attributes']['data-display-id'] = $this->settings['display_id'];
        $cell['actions']['ief_entity_edit']['#attributes']['data-view-id'] = $this->settings['view_id'];

        // Ajaxify the link.
        $cell['actions']['ief_entity_edit']['#attributes']['class'][] = 'use-ajax';
        $cell['actions']['ief_entity_edit']['#attributes'] += $this->dialogOptions;

        // Set destination if none has set.
        // Otherwise, redirect back to the original source path.
        if ($this->request->query->get('destination')) {
          $edit_url->setRouteParameter('destination', $this->request->query->get('destination'));
        }
        elseif (!isset($edit_params['destination'])) {
          $edit_url->setRouteParameter('destination', $this->request->getPathInfo());
        }
      }
    }
  }

  /**
   * Sets the dialog options depending on the dialog type.
   *
   * @param array $options
   *   The dialog options.
   *
   * @return array
   *   Returns the dialog options per dialog type.
   */
  public function setDialogOptions(array $options = []) {
    $default_options = [
      'data-dialog-type' => 'bootstrap4_modal',
    ];

    // Bootstrap 4 modal dialog options.
    // 'backdrop' => 'static',.
    $default_options['data-dialog-options']['backdrop'] = 'static';
    $default_options['data-dialog-options']['dialogClasses'][] = 'modal-dialog-centered';
    $default_options['data-dialog-options']['dialogClasses'][] = 'modal-xl';

    // Serializa data dialog options.
    $default_options['data-dialog-options'] = Json::encode($default_options['data-dialog-options']);

    return $default_options;
  }

  /**
   * Set the entity form display using the `form_mode_control` module.
   *
   * @param string $display
   *   The airbnb settings config name.
   *
   * @return object
   *   Returns the current object.
   */
  protected function setDisplay(string $display) : object {
    $this->display = $display;
    return $this;
  }

}
