<?php

namespace Drupal\starrating\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'starrating' widget.
 *
 * @FieldWidget(
 *   id = "starrating",
 *   module = "starrating",
 *   label = @Translation("Star rating"),
 *   field_types = {
 *     "starrating"
 *   }
 * )
 */
class StarRatingWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = $items[$delta]->value ?? 0;
    $field_settings = $this->getFieldSettings();
    $max_value = $field_settings['max_value'];
    $options = [];
    for ($i = 0; $i <= $max_value; $i++) {
      $options[$i] = $i;
    }

    $element += [
      '#type' => 'select',
      '#options' => $options,
      '#default_value' => $value,
      '#empty_option' => $this->t('Not selected'),
      '#empty_value' => 0,
    ];
    return ['value' => $element];
  }

}
