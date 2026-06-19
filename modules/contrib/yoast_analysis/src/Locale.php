<?php

namespace Drupal\yoast_analysis;

use Drupal\Core\Language\LanguageInterface;

class Locale {

  public static function mapLocale(LanguageInterface $language): string {
    $mapping = [
    // English.
      'en' => 'en_US',
    // German.
      'de' => 'de_DE',
    // Dutch.
      'nl' => 'nl_NL',
    // French.
      'fr' => 'fr_FR',
    // Spanish.
      'es' => 'es_ES',
    // Italian.
      'it' => 'it_IT',
    // Portuguese.
      'pt-pt' => 'pt_PT',
    // Russian.
      'ru' => 'ru_RU',
    // Catalan.
      'ca' => 'ca',
    // Polish.
      'pl' => 'pl_PL',
    // Swedish.
      'sv' => 'sv_SE',
    // Hungarian.
      'hu' => 'hu_HU',
    // Indonesian.
      'id' => 'id_ID',
    // Arabic.
      'ar' => 'ar',
    // Hebrew.
      'he' => 'he_IL',
    // Farsi.
      'fa' => 'fa_IR',
    // Turkish.
      'tr' => 'tr_TR',
    // Norwegian.
      'nb' => 'nb_NO',
    // Czech.
      'cs' => 'cs_CZ',
    // Slovak.
      'sk' => 'sk_SK',
    // Greek.
      'el' => 'el',
    // Japanese.
      'ja' => 'ja',
    ];

    return $mapping[$language->getId()] ?? 'xyz';
  }

}
