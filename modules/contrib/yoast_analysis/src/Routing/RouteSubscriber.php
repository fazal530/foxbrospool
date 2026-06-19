<?php

namespace Drupal\yoast_analysis\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class RouteSubscriber extends RouteSubscriberBase {

  protected $entityTypeManager;

  public function __construct(EntityTypeManagerInterface $entity_manager) {
    $this->entityTypeManager = $entity_manager;
  }

  protected function alterRoutes(RouteCollection $collection) {
    foreach ($this->entityTypeManager->getDefinitions() as $entity_type_id => $entity_type) {
      if ($route = $this->getEntityAnalyseRoute($entity_type)) {
        $collection->add("entity.$entity_type_id.yoast_analysis_analyse", $route);
      }
    }
  }

  protected function getEntityAnalyseRoute(EntityTypeInterface $entity_type) {
    if ($analyse = $entity_type->getLinkTemplate('yoast-analysis-analyse')) {
      $entity_type_id = $entity_type->id();
      $route = new Route($analyse);
      $route
        ->addDefaults([
          '_controller' => '\Drupal\yoast_analysis\Controller\AnalysisController::entityAnalyse',
          '_title' => 'Yoast Analysis',
        ])
        ->setRequirement('_entity_access', $entity_type_id . '.update')
        ->setRequirement('_yoast_analysis_access', 'TRUE')
        ->setOption('_admin_route', TRUE)
        ->setOption('_yoast_analysis_entity_type_id', $entity_type_id)
        ->setOption('parameters', [
          $entity_type_id => ['type' => 'entity:' . $entity_type_id],
        ]);

      return $route;
    }
  }

}
