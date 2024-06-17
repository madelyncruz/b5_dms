<?php

/**
 * @file
 * Provides theme settings for b5_dms theme.
 */

use Drupal\b5_dms\Form\ThemeSettingsForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_FORM_ID_alter().
 */
function b5_dms_form_system_theme_settings_alter(&$form, FormStateInterface $form_state, $form_id = NULL) {
  // Work-around for a core bug affecting admin themes. See issue #943212.
  if (isset($form_id)) {
    return;
  }

  /** @var \Drupal\Core\Entity\EntityDisplayRepository[] $view_mode_options */
  $view_mode_options = \Drupal::service('entity_display.repository')->getViewModeOptions('user');

  // Theme settings for comment user view mode.
  $form['theme_settings']['b5_dms_comment_date'] = [
    '#type' => 'checkbox',
    '#title' => t('Date in comments'),
    '#default_value' => theme_get_setting('b5_dms_comment_date') ?? FALSE,
  ];
  $form['theme_settings']['b5_dms_comment_date_format'] = [
    '#type' => 'textfield',
    '#title' => t('Date format in comments'),
    '#default_value' => theme_get_setting('b5_dms_comment_date_format') ?? NULL,
    '#states' => [
      'required' => [
        [':input[name="b5_dms_comment_date"]' => ['checked' => TRUE]],
      ],
      'visible' => [
        [':input[name="b5_dms_comment_date"]' => ['checked' => TRUE]],
      ],
    ],
  ];
  $form['theme_settings']['b5_dms_comment_user_view_mode'] = [
    '#type' => 'select',
    '#title' => t('Comment author view mode'),
    '#options' => $view_mode_options,
    '#default_value' => theme_get_setting('b5_dms_comment_user_view_mode') ?? 'default',
    '#states' => [
      'visible' => [
        [':input[name="toggle_comment_user_picture"]' => ['checked' => TRUE]],
      ],
    ],
  ];

  $theme_settings_form = new ThemeSettingsForm($form, $form_state);

  $theme_settings_form->avatar();
  $theme_settings_form->header();
  $theme_settings_form->layout();
  $theme_settings_form->components();
  $theme_settings_form->footer();

  if (\Drupal::moduleHandler()->moduleExists('ief_table_view_mode')) {
    $theme_settings_form->iefTable();
  }

  $theme_settings_form->libInternal();
  $theme_settings_form->email();
}
