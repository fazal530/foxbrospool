<?php

namespace Drupal\Tests\starrating\Kernel\Formatter;

use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the starrating_value_rating formatter.
 */
class StarRatingValueRatingFormatterTest extends FormatterTestBase {

  use NodeCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->createField('starrating', 'starrating_value_rating');
  }

  /**
   * Tests the rendered output.
   */
  public function testRender(): void {
    $node = $this->createNode([
      'type' => 'article',
    ]);
    $node->{$this->fieldName} = ['value' => 4];
    $node->save();

    $actual = $this->renderField($node, $this->fieldName);
    $expected = <<<HTML
<div>
<div>$this->fieldName</div>
<div><div class='starrating'>
4/10
</div>
</div>
</div>
HTML;

    $this->assertMarkupEqual($expected, $actual);
  }

}
