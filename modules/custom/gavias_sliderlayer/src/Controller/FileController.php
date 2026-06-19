<?php

/**
 * @file
 * Contains \Drupal\gavias_sliderlayer\Controller\FileController.
 */

namespace Drupal\gavias_sliderlayer\Controller;

use Drupal\Core\Url;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;


class FileController extends ControllerBase {

  
  public function gavias_sliderlayer_upload_file(){
    // A list of permitted file extensions
    global $base_url;
    $allowed = array('png', 'jpg', 'gif');
    $_id = gavias_sliderlayer_makeid(6);
    $file_default_scheme = \Drupal::config('system.file')->get('default_scheme');
    $upload_uri = $file_default_scheme . "://gva-sliderlayer-upload";

    if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

      $original_name = basename($_FILES['upl']['name']);
      $safe_name = preg_replace('/[^A-Za-z0-9._-]/', '_', $original_name);
      $extension = strtolower(pathinfo($safe_name, PATHINFO_EXTENSION));

      if(!in_array($extension, $allowed)){
        echo '{"status":"error extension"}';
        exit;
      }  
      \Drupal::service('file_system')->prepareDirectory($upload_uri, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY | \Drupal\Core\File\FileSystemInterface::MODIFY_PERMISSIONS);
      $path_folder = \Drupal::service('file_system')->realpath($upload_uri);
    
      $ext = $extension;
      $image_name = basename($safe_name, ".{$ext}");

      $filename = $image_name . "-{$_id}" . ".{$ext}";
      $file_path = $path_folder . '/' . $filename;
      $file_uri = $upload_uri . '/' . $filename;
      $file_url = \Drupal::service('file_url_generator')->generateString($file_uri);

      if(move_uploaded_file($_FILES['upl']['tmp_name'], $file_path)){
        $result = array(
          'file_url' => $file_url,
          'file_url_full' => \Drupal::service('file_url_generator')->generateAbsoluteString($file_uri)
        );
        print json_encode($result);
        exit;
        }
    }

    echo '{"status":"error"}';
    exit;

  }

  public function get_images_upload(){
    header('Content-type: application/json');
    global $base_url;
    $file_default_scheme = \Drupal::config('system.file')->get('default_scheme');
    $upload_uri = $file_default_scheme . "://gva-sliderlayer-upload";
    $file_path = \Drupal::service('file_system')->realpath($upload_uri);

    $list_file = glob($file_path . '/*.{jpg,png,gif}', GLOB_BRACE);

    $files = array();
    $data = '';
    foreach ($list_file as $key => $file) {
      if(basename($file)){
        $file_uri = $upload_uri . '/' . basename($file);
        $file_url = \Drupal::service('file_url_generator')->generateString($file_uri);
        $files[$key]['file_url'] = $file_url;
        $files[$key]['file_url_full'] = \Drupal::service('file_url_generator')->generateAbsoluteString($file_uri);
      }  
    }
    $result = array(
      'data' => $files
    );
    print json_encode($result);
    exit(0);
  }
  
}
