<?php

namespace Drupal\yoast_analysis;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;

class EntityTypeInfo implements ContainerInjectionInterface {
  use StringTranslationTrait;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * EntityTypeInfo constructor.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   Current user.
   */
  public function __construct(AccountInterface $current_user) {
    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('current_user')
    );
  }

  /**
   * @param \Drupal\Core\Entity\EntityTypeInterface[] $entity_types
   */
  public function entityTypeAlter(array &$entity_types) {
    foreach ($entity_types as $entity_type_id => $entity_type) {
      if ($entity_type->hasLinkTemplate('canonical')) {
        $entity_type->setLinkTemplate('yoast-analysis-analyse', "/yoast_analysis/$entity_type_id/{{$entity_type_id}}");
      }
    }
  }

  public function entityOperation(EntityInterface $entity): array {
    $operations = [];
    $url = $entity->hasLinkTemplate('yoast-analysis-analyse')
      ? $entity->toUrl('yoast-analysis-analyse')
      : NULL;
    if ($url && $url->access()) {
      $operations['yoast_analysis_analyse'] = [
        'title' => $this->t('SEO Analysis'),
        'weight' => 80,
        'url' => $url,
      ];
    }
    return $operations;
  }

}
