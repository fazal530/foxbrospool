<?php

namespace Drupal\yoast_analysis\Element;

use Drupal\Component\Utility\Html;
use Drupal\Core\Render\Element;
use Drupal\Core\Render\Element\RenderElement;

/**
 * @RenderElement("yoast_analysis")
 */
class YoastAnalysis extends RenderElement {

  public function getInfo() {
    $class = static::class;
    return [
      '#pre_render' => [
        [$class, 'preRenderYoastAnalysis'],
      ],
      '#attributes' => [
        'class' => ['yoast-analysis'],
      ],
      '#id' => '',
      '#analysis_data' => NULL,
      '#theme_wrappers' => ['container'],
    ];
  }

  public static function preRenderYoastAnalysis($element) {
    if (empty($element['#id'])) {
      $element['#id'] = Html::getUniqueId('yoast-analysis');
    }

    $element['form'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => 'yoast-analysis-form',
      ],
    ];

    $element['form']['keyword'] = [
      '#type' => 'textfield',
      '#attributes' => ['class' => ['yoast-analysis__keyword']],
      '#id' => Html::getUniqueId('yoast-analysis__keyword'),
      '#title' => t('Keyword'),
    ];

    $element['form']['refresh'] = [
      '#type' => 'button',
      '#attributes' => ['class' => ['yoast-analysis__refresh']],
      '#id' => Html::getUniqueId('yoast-analysis__refresh'),
      '#value' => t('Analyse'),
    ];

    $element['snippet'] = [
      '#type' => 'container',
      '#attributes' => [
        'id' => Html::getUniqueId('yoast-analysis__snippet'),
        'class' => ['yoast-analysis__snippet'],
      ],

      'preview' => [
        '#theme' => 'yoast_analysis_snippet_preview',
      ],
    ];

    $element['output'] = [
      '#type' => 'container',
      '#attributes' => [
        'id' => Html::getUniqueId('yoast-analysis__output'),
        'class' => ['yoast-analysis__output'],
      ],
    ];

    $element['content_output'] = [
      '#type' => 'container',
      '#attributes' => [
        'id' => Html::getUniqueId('yoast-analysis__content-output'),
        'class' => ['yoast-analysis__content-output'],
      ],
    ];

    $element['#attached'] = $element['#attached'] ?? [];
    $element['#attached']['library'] = $element['#attached']['library'] ?? [];
    $element['#attached']['library'][] = 'yoast_analysis/analysis';

    $element['#attached']['drupalSettings'] = $element['#attached']['drupalSettings'] ?? [];

    $element['#attached']['drupalSettings'] = [
      'yoast_analysis' => [
        'container_settings' => [
          $element['#id'] => (object) [
            'analysis_data' => $element['#analysis_data']->toArray(),
          ],
        ],
      ],
    ];

    Element::setAttributes($element, ['id']);

    return $element;
  }

}
