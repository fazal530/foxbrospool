<?php

namespace Drupal\yoast_analysis\Access;

use Drupal\Core\Access\AccessResultInterface;
use Drupal\Core\Entity\EntityDisplayRepository;
use Drupal\Core\Routing\Access\AccessInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\RouteMatchInterface;

/**
 * Checks if the yoast_analysis view mode is present for the given entity type.
 */
class AnalysisAccessCheck implements AccessInterface {

  const YOAST_ANALYSIS_VIEW_MODE = 'yoast_analysis';

  private EntityDisplayRepository $entityDisplayRepository;

  public function __construct(EntityDisplayRepository $entity_display_repository) {
    $this->entityDisplayRepository = $entity_display_repository;
  }

  public function access(RouteMatchInterface $route_match): AccessResultInterface {
    $entity_type = $route_match->getRouteObject()->getOption('_yoast_analysis_entity_type_id');
    $entity = $route_match->getParameter($entity_type);
    $bundle = $entity->bundle();
    $view_modes = $this->entityDisplayRepository->getViewModeOptionsByBundle($entity_type, $bundle);

    return array_key_exists(self::YOAST_ANALYSIS_VIEW_MODE, $view_modes)
      ? AccessResult::allowed()
      : AccessResult::forbidden();
  }

}
