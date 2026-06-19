<?php

namespace Drupal\starrating\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'starrating' formatter.
 *
 * @FieldFormatter(
 *   id = "starrating_value_rating",
 *   module = "starrating",
 *   label = @Translation("Star rating (e.g. 8/10)"),
 *   field_types = {
 *     "starrating"
 *   }
 * )
 */
class StarRatingValueRatingFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    $max_value = $items->getSetting('max_value');
    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#theme' => 'starrating_formatter',
        '#rate' => $item->value . '/' . $max_value,
        '#type' => 'value',
      ];
    }
    return $elements;
  }

}
