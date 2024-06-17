<?php

namespace Drupal\b5_dms\Utility;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberToTimeZonesMapper;
use libphonenumber\PhoneNumberUtil;

/**
 * Provides a trait for the phone number.
 */
trait PhoneNumberTrait {

  /**
   * The utility for international phone numbers.
   *
   * @var \libphonenumber\PhoneNumberUtil
   */
  protected $instance;

  /**
   * An offline mapper from phone numbers to time zones.
   *
   * @var \libphonenumber\PhoneNumberToTimeZonesMapper
   */
  protected $phoneTimezoneMapperInstance;

  /**
   * Gets the international phone numbers utility.
   *
   * @return \libphonenumber\PhoneNumberUtil
   *   The utility for international phone numbers.
   */
  public function phoneUtilInstance() {
    if (!$this->instance) {
      $this->instance = PhoneNumberUtil::getInstance();
    }
    return $this->instance;
  }

  /**
   * Gets the offline mapper from phone numbers.
   *
   * @return \libphonenumber\PhoneNumberToTimeZonesMapper
   *   The offline mapper from phone numbers to time zones.
   */
  public function phoneTimezoneMapperInstance() {
    if (!$this->phoneTimezoneMapperInstance) {
      $this->phoneTimezoneMapperInstance = PhoneNumberToTimeZonesMapper::getInstance();
    }
    return $this->phoneTimezoneMapperInstance;
  }

  /**
   * Gets the phone utility instance.
   *
   * @param string $number
   *   The phone number in E164 format eg. +6390000000.
   *
   * @return array
   *   The phone number instance containing the country / region code,
   *   phone number in plain / national format and timezone.
   */
  public function phoneInstance(string $number) {
    /** @var \libphonenumber\PhoneNumberUtil */
    $instance = $this->phoneUtilInstance();

    try {
      $parse_number = $instance->parse($number);
      $timezone = $this->phoneTimezoneMapperInstance()->getTimeZonesForNumber($parse_number);

      return [
        'code_country' => $parse_number->getCountryCode(),
        'code_region' => $instance->getRegionCodeForNumber($parse_number),
        'number_plain' => $number,
        'number_national' => $parse_number->getNationalNumber(),
        'timezone' => $timezone[0] ?? NULL,
      ];
    }
    catch (NumberParseException $e) {
      // Nothing to catch exception.
    }
  }

}
