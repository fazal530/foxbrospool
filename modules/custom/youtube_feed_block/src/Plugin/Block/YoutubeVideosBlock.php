<?php

namespace Drupal\youtube_feed_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Render\Markup;

/**
 * Provides a YouTube Videos Block.
 *
 * @Block(
 *   id = "youtube_videos_block",
 *   admin_label = @Translation("YouTube Videos Block")
 * )
 */
class YoutubeVideosBlock extends BlockBase {

  public function build() {

    $videos = [];

    try {

      $client = \Drupal::httpClient();

      $response = $client->get(
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCpLV7eE2E56nWwpXiqfshHA'
      );

      $xml = simplexml_load_string($response->getBody());

      foreach ($xml->entry as $entry) {

        $namespaces = $entry->getNamespaces(true);
        $yt = $entry->children($namespaces['yt']);

        $video_id = (string) $yt->videoId;

        $videos[] = [
          'title' => (string) $entry->title,
          'embed_url' => "https://www.youtube.com/embed/{$video_id}",
        ];

        if (count($videos) >= 6) {
          break;
        }
      }

    }
    catch (\Exception $e) {
      return [
        '#markup' => 'Unable to load YouTube feed.',
      ];
    }

    $output = '<div class="youtube-grid">';

    foreach ($videos as $video) {

      $output .= '
        <div class="youtube-card">
          <iframe
            width="100%"
            height="250"
            src="' . $video['embed_url'] . '"
            title="' . htmlspecialchars($video['title']) . '"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
          <h4>' . htmlspecialchars($video['title']) . '</h4>
        </div>';
    }

    $output .= '</div>';

    return [
      '#markup' => Markup::create($output),
      '#attached' => [
        'library' => [
          'youtube_feed_block/youtube_grid',
        ],
      ],
      '#cache' => [
        'max-age' => 3600,
      ],
    ];
  }

}
