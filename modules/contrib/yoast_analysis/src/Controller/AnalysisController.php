<?php

namespace Drupal\yoast_analysis\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\yoast_analysis\AnalysisData;

class AnalysisController extends ControllerBase {

  public function entityAnalyse(RouteMatchInterface $route_match) {
    $output = [];

    $entity = $this->getEntityFromRouteMatch($route_match);

    if ($entity instanceof EntityInterface) {
      $output[] = [
        '#type' => 'yoast_analysis',
        '#analysis_data' => AnalysisData::fromEntity($entity),
      ];
    }

    return $output;
  }

  protected function getEntityFromRouteMatch(RouteMatchInterface $route_match) {
    $parameter_name = $route_match->getRouteObject()->getOption('_yoast_analysis_entity_type_id');
    return $route_match->getParameter($parameter_name);
  }

}
