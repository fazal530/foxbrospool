<?php

namespace Drupal\Tests\starrating\Kernel\Formatter;

use Drupal\Tests\node\Traits\NodeCreationTrait;

/**
 * Tests the starrating formatter.
 */
class StarRatingFormatterTest extends FormatterTestBase {

  use NodeCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $settings = [
      'icon_type' => 'Airplane',
      'icon_color' => 4,
    ];
    $this->createField('starrating', 'starrating', $settings);
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
<div class='rate-image Airplane4-on even s1'></div>
<div class='rate-image Airplane4-on odd s2'></div>
<div class='rate-image Airplane4-on even s3'></div>
<div class='rate-image Airplane4-on odd s4'></div>
<div class='rate-image Airplane4-on even s5'></div>
<div class='rate-image Airplane4-on odd s6'></div>
<div class='rate-image Airplane4-on even s7'></div>
<div class='rate-image Airplane4-on odd s8'></div>
</div>
</div>
</div>
HTML;

    $this->assertMarkupEqual($expected, $actual);
  }

}
