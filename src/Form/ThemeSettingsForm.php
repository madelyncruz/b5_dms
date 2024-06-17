<?php

namespace Drupal\b5_dms\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Provides a class for theme settings form.
 */
class ThemeSettingsForm {

  use StringTranslationTrait;

  /**
   * The nested array of form elements.
   *
   * @var array
   */
  protected $form;

  /**
   * The current state of the form.
   *
   * @var \Drupal\Core\Form\FormStateInterface
   */
  protected $formState;

  /**
   * ThemeSettingsForm contructor.
   *
   * @param array $form
   *   The nested array of form elements.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function __construct(array &$form, FormStateInterface $form_state) {
    $this->form = &$form;
    $this->formState = $form_state;
  }

  /**
   * Build form settings for avatar elements.
   */
  public function avatar() {
    $this->form['avatar'] = [
      '#type' => 'details',
      '#title' => $this->t('Avatar'),
      '#description' => $this->t('Specify the user target fields of the avatar.'),
      '#open' => TRUE,
    ];
    $this->form['avatar']['b5_dms_avatar_theme'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Theme format'),
      '#default_value' => theme_get_setting('b5_dms_avatar_theme'),
    ];
    $this->form['avatar']['b5_dms_avatar_name_first'] = [
      '#type' => 'textfield',
      '#title' => $this->t('First name field'),
      '#default_value' => theme_get_setting('b5_dms_avatar_name_first'),
      '#description' => $this->t('The field machine name of the user’s first name.'),
      '#states' => [
        'visible' => [
          ':input[name="b5_dms_avatar_theme"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="b5_dms_avatar_theme"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $this->form['avatar']['b5_dms_avatar_name_last'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Family name field'),
      '#default_value' => theme_get_setting('b5_dms_avatar_name_last'),
      '#description' => $this->t('The field machine name of the user’s family name.'),
      '#states' => [
        'visible' => [
          ':input[name="b5_dms_avatar_theme"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $this->form['avatar']['b5_dms_avatar_designation'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Designation title field'),
      '#default_value' => theme_get_setting('b5_dms_avatar_designation'),
      '#description' => $this->t('The field machine name of the user’s job title.'),
      '#states' => [
        'visible' => [
          ':input[name="b5_dms_avatar_theme"]' => ['checked' => TRUE],
        ],
      ],
    ];
  }

  /**
   * Build form settings for components elements.
   */
  public function components() {
    $this->form['components'] = [
      '#type' => 'details',
      '#title' => $this->t('Components'),
      '#open' => TRUE,
    ];
    $this->form['components']['navbar']['b5_dms_navbar_top_background'] = [
      '#type' => 'select',
      '#title' => $this->t('Navbar top background color'),
      '#options' => [
        'bg-primary' => $this->t('Primary'),
        'bg-dark' => $this->t('Dark'),
        'bg-light' => $this->t('Light'),
      ],
      '#default_value' => theme_get_setting('b5_dms_navbar_top_background'),
      '#empty_option' => $this->t('Default'),
    ];
    $this->form['components']['navbar']['b5_dms_navbar_top_color'] = [
      '#type' => 'select',
      '#title' => $this->t('Navbar top link color'),
      '#options' => [
        'navbar-dark' => $this->t('Dark'),
        'navbar-light' => $this->t('Light'),
      ],
      '#default_value' => theme_get_setting('b5_dms_navbar_top_color'),
      '#empty_option' => $this->t('Default'),
    ];
    $this->form['components']['offcanvas']['b5_dms_offcanvas_background'] = [
      '#type' => 'select',
      '#title' => $this->t('Offcanvas background'),
      '#options' => [
        'text-bg-dark' => $this->t('Dark'),
        'text-bg-light' => $this->t('Light'),
      ],
      '#default_value' => theme_get_setting('b5_dms_offcanvas_background'),
      '#empty_option' => $this->t('Default'),
    ];
    $this->form['components']['input_switch']['b5_dms_input_switch'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Checkbox switches IDs'),
      '#default_value' => theme_get_setting('b5_dms_input_switch'),
      '#description' => $this->t('List the checkbox input IDs on separate lines. For example, edit-field-bool-1a-value|node|beneficiary or edit-field-bool-1a-value|view|case_step'),
    ];
  }

  /**
   * Build form settings for email elements.
   */
  public function email() {
    // Theme email info.
    $this->form['email'] = [
      '#type' => 'details',
      '#title' => $this->t('Email'),
      '#open' => TRUE,
    ];
    $this->form['email']['b5_dms_mail_header'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Email header'),
      '#default_value' => theme_get_setting('b5_dms_mail_header'),
    ];
    $this->form['email']['b5_dms_mail_footer'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Email footer'),
      '#default_value' => theme_get_setting('b5_dms_mail_footer'),
    ];
  }

  /**
   * Build form settings for footer elements.
   */
  public function footer() {
    $this->form['footer'] = [
      '#type' => 'details',
      '#title' => $this->t('Footer'),
      '#open' => TRUE,
    ];
    $this->form['footer']['b5_dms_footer_show'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show footer'),
      '#default_value' => theme_get_setting('b5_dms_footer_show'),
    ];
    $this->form['footer']['b5_dms_footer_about_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Title'),
      '#default_value' => theme_get_setting('b5_dms_footer_about_title'),
    ];
    $this->form['footer']['b5_dms_footer_about_message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message'),
      '#default_value' => theme_get_setting('b5_dms_footer_about_message'),
    ];
  }

  /**
   * Build form settings for header elements.
   */
  public function header() {
    $this->form['header'] = [
      '#type' => 'details',
      '#title' => $this->t('Header'),
      '#open' => TRUE,
    ];
    $this->form['header']['b5_dms_project_link_show'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show back to project link'),
      '#default_value' => theme_get_setting('b5_dms_project_link_show'),
    ];
    $this->form['header']['b5_dms_project_link_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Project title'),
      '#default_value' => theme_get_setting('b5_dms_project_link_title'),
      '#states' => [
        'visible' => [
          ':input[name="b5_dms_project_link_show"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="b5_dms_project_link_show"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $this->form['header']['b5_dms_project_link_url'] = [
      '#type' => 'url',
      '#title' => $this->t('Project URL'),
      '#default_value' => theme_get_setting('b5_dms_project_link_url'),
      '#states' => [
        'visible' => [
          ':input[name="b5_dms_project_link_show"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="b5_dms_project_link_show"]' => ['checked' => TRUE],
        ],
      ],
    ];
  }

  /**
   * Build form settings for layout elements.
   */
  public function layout() {
    $this->form['layout'] = [
      '#type' => 'details',
      '#title' => $this->t('Layout'),
      '#open' => TRUE,
    ];
    $this->form['layout']['container']['b5_dms_fluid_container'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Fluid container'),
      '#default_value' => theme_get_setting('b5_dms_fluid_container'),
    ];
  }

  /**
   * Build form settings for internal libraries elements.
   */
  public function libInternal() {
    $this->form['lib_internal'] = [
      '#type' => 'details',
      '#title' => $this->t('Internal libraries'),
      '#open' => TRUE,
    ];
    $this->form['lib_internal']['b5_dms_lib_node_form'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('node-form.js'),
      '#default_value' => theme_get_setting('b5_dms_lib_node_form'),
      '#description' => $this->t('Check to load "node-form.js" script.'),
    ];
  }

  /**
   * Build form settings for inline entity form table elements.
   */
  public function iefTable() {
    $this->form['ief_table'] = [
      '#type' => 'details',
      '#title' => $this->t('Inline Entity Form Table'),
      '#open' => TRUE,
    ];
    $this->form['ief_table']['b5_dms_ief_table_action'] = [
      '#type' => 'select',
      '#title' => $this->t('Action links behavior'),
      '#options' => [],
      '#empty_option' => $this->t('- Select -'),
      '#default_value' => theme_get_setting('b5_dms_ief_table_action'),
    ];
    $this->form['ief_table']['b5_dms_ief_table_action_ignore'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Ignore edit action links behavior by form ID'),
      '#description' => $this->t('Enter the comma-separated of form IDs to exclude.'),
      '#default_value' => theme_get_setting('b5_dms_ief_table_action_ignore'),
    ];

    if (\Drupal::moduleHandler()->moduleExists('bootstrap4_modal')) {
      $this->form['ief_table']['b5_dms_ief_table_action']['#options']['bootstrap4_modal'] = t('Bootstrap 4 modal');
    }
  }

}
