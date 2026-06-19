<?php

namespace Drupal\Tests\starrating\Kernel\Formatter;

use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the starrating_value formatter.
 */
class StarRatingValueFormatterTest extends FormatterTestBase {

  use NodeCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->createField('starrating', 'starrating_value');
  }

  /**
   * Tests the rendered output.
   */
  public function testRender(): void {
    $node = $this->createNode([
      'type' => 'article',
    ]);
    $node->{$this->fieldName} = ['value' => 8];
    $node->save();

    $actual = $this->renderField($node, $this->fieldName);
    $expected = <<<HTML
<div>
<div>$this->fieldName</div>
<div><div class='starrating'>
8
</div>
</div>
</div>
HTML;

    $this->assertMarkupEqual($expected, $actual);
  }

}
