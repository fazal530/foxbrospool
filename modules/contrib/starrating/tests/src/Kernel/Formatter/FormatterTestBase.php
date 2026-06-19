<?php

namespace Drupal\Tests\starrating\Kernel\Formatter;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\KernelTests\KernelTestBase;
use Drupal\node\Entity\NodeType;

/**
 * Provides a base test for kernel formatter tests.
 */
abstract class FormatterTestBase extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'system',
    'field',
    'text',
    'user',
    'node',
    'starrating',
  ];

  /**
   * The generated field name.
   */
  protected string $fieldName;

  /**
   * The renderer.
   */
  protected RendererInterface $renderer;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installConfig(['system']);
    $this->installConfig(['field']);
    $this->installConfig(['text']);
    $this->installConfig(['user']);
    $this->installConfig(['node']);
    $this->installConfig(['starrating']);
    $this->installSchema('node', 'node_access');
    $this->installEntitySchema('user');
    $this->installEntitySchema('node');

    $this->renderer = $this->container->get('renderer');

    NodeType::create([
      'type' => 'article',
      'name' => 'Article',
    ])->save();

    $this->fieldName = mb_strtolower($this->randomMachineName());
  }

  /**
   * Creates a field of the given type.
   *
   * @param string $field_type
   *   The field type.
   * @param string $formatter_id
   *   The formatter ID.
   * @param array $settings
   *   The formatter settings.
   */
  protected function createField(string $field_type, string $formatter_id, array $settings = []): void {
    $field_storage = FieldStorageConfig::create([
      'field_name' => $this->fieldName,
      'entity_type' => 'node',
      'type' => $field_type,
    ]);
    $field_storage->save();

    $field = FieldConfig::create([
      'field_storage' => $field_storage,
      'bundle' => 'article',
      'label' => $this->randomMachineName(),
    ]);
    $field->save();

    $display = \Drupal::service('entity_display.repository')->getViewDisplay('node', 'article', 'full');
    $display->setComponent($this->fieldName, [
      'type' => $formatter_id,
      'settings' => $settings,
    ]);
    $display->save();
  }

  /**
   * Render field.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param string $field_name
   *   The field name.
   */
  protected function renderField(EntityInterface $entity, string $field_name): string {
    $build = $entity->$field_name->view('full');
    $build['#title'] = $field_name;
    return (string) $this->renderer->renderInIsolation($build);
  }

  /**
   * Checks that two HTML fragments are the same after removing whitespace.
   *
   * @param string $expected
   *   Expected markup.
   * @param string $actual
   *   Actual markup.
   */
  protected function assertMarkupEqual(string $expected, string $actual): void {
    $normalize = static fn (string $str) => preg_replace('/\s+/u', '', $str);
    $expectedNormalized = $normalize($expected);
    $actualNormalized = $normalize($actual);
    if ($expectedNormalized !== $actualNormalized) {
      $message = "Markup does not match.\n\nExpected:\n$expected\n\nActual:\n$actual";
      $this->fail($message);
    }
  }

}
