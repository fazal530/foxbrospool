<?php

namespace Drupal\yoast_analysis;

use Drupal\Core\Url as DrupalUrl;

class Url {
  protected array $parts;

  public function __construct(DrupalUrl $url) {
    $this->parts = parse_url($url->toString());
  }

  public function getBaseUrl(): string {
    if (!isset($this->parts['host'])) {
      return '';
    }

    $hostAndPort = $this->parts['host'];
    if (isset($this->parts['port'])) {
      $hostAndPort .= ':' . $this->parts['port'];
    }

    if (isset($this->parts['scheme'])) {
      return $this->parts['scheme'] . '://' . $hostAndPort;
    }

    return '//' . $hostAndPort;
  }

  public function getPath(): string {
    $path = $this->parts['path'] ?? '/';
    if (isset($this->parts['query'])) {
      $path .= '?' . $this->parts['query'];
    }

    return $path;
  }

}
