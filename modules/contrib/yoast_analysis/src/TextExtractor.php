<?php

namespace Drupal\yoast_analysis;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class TextExtractor {
  protected EntityTypeManagerInterface $entityTypeManager;
  protected RendererInterface $renderer;
  protected ContainerInterface $container;

  public function __construct(EntityTypeManagerInterface $entityTypeManager, RendererInterface $renderer, ContainerInterface $container) {
    $this->entityTypeManager = $entityTypeManager;
    $this->renderer = $renderer;
    $this->container = $container;
  }

  public function getEntityHtml(EntityInterface $entity, $view_mode = 'yoast_analysis'): string {
    $build = $this->entityTypeManager
      ->getViewBuilder($entity->getEntityTypeId())
      ->view($entity, $view_mode);

    $build['#entity_type'] = $entity->getEntityTypeId();
    $build['#' . $build['#entity_type']] = $entity;

    return (string) $this->renderer->render($build);
  }

  /**
   * @return array{'title': string, 'description': string}
   */
  public function getEntityMetatags(EntityInterface $entity): array {
    $metatags = [
      'title' => $entity->label(),
      'description' => '',
    ];

    if (function_exists('metatag_get_tags_from_route')) {
      $tags = metatag_get_tags_from_route($entity) ?? [];

      foreach ($tags['#attached']['html_head'] as $tag) {
        $tag_name = $tag[1] ?? NULL;
        if (!array_key_exists($tag_name, $metatags)) {
          continue;
        }

        $tag_content = $tag[0]['#attributes']['content'] ?? NULL;
        if ($tag_content) {
          $metatags[$tag_name] = $tag_content;
        }
      }
    }

    return $metatags;
  }

  public function getEntityMetaDescription(EntityInterface $entity): string {
    return $this->getEntityMetatags($entity)['description'];
  }

}
