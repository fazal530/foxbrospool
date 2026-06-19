<?php

namespace Drupal\yoast_analysis;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Url as DrupalUrl;

class AnalysisData {
  protected string $title;
  protected string $metaDescription;
  protected string $text;
  protected DrupalUrl $url;
  protected LanguageInterface $language;

  public function __construct(string $title, string $metaDescription, string $text, DrupalUrl $url, LanguageInterface $language) {
    $this->title = $title;
    $this->metaDescription = $metaDescription;
    $this->text = $text;
    $this->url = $url;
    $this->language = $language;
  }

  public function toArray(): array {
    $this->url->setAbsolute(TRUE);
    $url = new Url($this->url);

    return [
      "title" => $this->title,
      "description" => $this->metaDescription,
      "base_url" => $url->getBaseUrl(),
      "path" => $url->getPath(),
      "text" => $this->text,
      "locale" => Locale::mapLocale($this->language),
    ];
  }

  public static function fromEntity(EntityInterface $entity): AnalysisData {
    /** @var \Drupal\yoast_analysis\TextExtractor $textExtractor */
    $textExtractor = \Drupal::service('yoast_analysis.text_extractor');

    $html = $textExtractor->getEntityHtml($entity);
    $metatags = $textExtractor->getEntityMetatags($entity);

    return new static(
      $metatags['title'],
      $metatags['description'],
      $html,
      $entity->toUrl(),
      $entity->language()
    );
  }

}
