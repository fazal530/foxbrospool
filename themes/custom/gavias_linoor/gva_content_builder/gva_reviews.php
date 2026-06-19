<?php 
if(!class_exists('element_gva_reviews')):
   class element_gva_reviews{
      public function render_form(){
         $fields = array(
            'type' => 'element_gva_reviews',
            'title' => t('Reviews'),
            'fields' => array(
               array(
                  'id'     => 'title',
                  'type'      => 'text',
                  'title'  => t('Title For Admin'),
                  'class'     => 'display-admin'
               ),
               array(
                  'id'        => 'bg_color',
                  'type'      => 'text',
                  'title'     => t('Background color'),
                  'desc'      => t('Background color fox box. e.g: #ccc, default background of theme')
               ),
               array(
                  'id'        => 'el_class',
                  'type'      => 'text',
                  'title'     => t('Extra class name'),
                  'desc'      => t('Style particular content element differently - add a class name and refer to it in custom CSS.'),
               ),  
               array(
                  'id'        => 'animate',
                  'type'      => 'select',
                  'title'     => t('Animation'),
                  'desc'      => t('Entrance animation for element'),
                  'options'   => gavias_content_builder_animate(),
                  'class'     => 'width-1-2'
               ), 
               array(
                  'id'        => 'animate_delay',
                  'type'      => 'select',
                  'title'     => t('Animation Delay'),
                  'options'   => gavias_content_builder_delay_wow(),
                  'desc'      => '0 = default',
                  'class'     => 'width-1-2'
               ),  
            ),                                     
         );

         for($i=1; $i<=10; $i++){
            $fields['fields'][] = array(
               'id'     => "info_{$i}",
               'type'   => 'info',
               'desc'   => "Reviews item {$i}"
            );
            $fields['fields'][] = array(
               'id'        => "image_{$i}",
               'type'      => 'upload',
               'title'     => t("Image {$i}")
            );
            $fields['fields'][] = array(
               'id'        => "title_{$i}",
               'type'      => 'text',
               'title'     => t("Title {$i}")
            );
            $fields['fields'][] = array(
               'id'        => "reviews_{$i}",
               'type'      => 'select',
               'options'   => ['1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5'],
               'title'     => t("Reviews {$i}")
            );
            $fields['fields'][] = array(
               'id'        => "time_{$i}",
               'type'      => 'text',
               'title'     => t("Time {$i}")
            );
            $fields['fields'][] = array(
               'id'           => "content_{$i}",
               'type'         => 'textarea',
               'title'        => t("Content {$i}"),
            );
            $fields['fields'][] = array(
               'id'        => "link_{$i}",
               'type'      => 'text',
               'title'     => t("Link {$i}")
            );
         }
         return $fields;
      }

      public static function render_content( $attr = array(), $content = '' ){
         global $base_url;
         $default = array(
            'title'           => '',
            'bg_color'        => '',
            'el_class'        => '',
            'animate'         => '',
            'animate_delay'   => ''
         );

         for($i=1; $i<=10; $i++){
            $default["image_{$i}"] = '';
            $default["title_{$i}"] = '';
            $default["reviews_{$i}"] = '1';
            $default["time_{$i}"] = '';
            $default["content_{$i}"] = '';
            $default["link_{$i}"] = '';
         }

         extract(gavias_merge_atts($default, $attr));

         if($animate) $el_class .= ' wow ' . $animate; 

         $bg_style = '';
         if($bg_color){
            $bg_style = "style=\"background-color: {$bg_color};\"";
         }
         ob_start();
         ?>
      
         
      <div class="gsc-reviews <?php echo $el_class ?>"> 
         <div class="owl-carousel init-carousel-owl" data-items="1" data-items_lg="1" data-items_md="1" data-items_sm="1" data-items_xs="1" data-loop="1" data-speed="800" data-auto_play="1" data-auto_play_speed="900" data-auto_play_timeout="5000" data-auto_play_hover="0" data-navigation="1" data-rewind_nav="0" data-pagination="1" data-mouse_drag="1" data-touch_drag="1">
            <?php for($i=1; $i<=10; $i++){ ?>
               <?php 
                  $title = "title_{$i}";
                  $reviews = "reviews_{$i}";
                  $time = "time_{$i}";
                  $content = "content_{$i}";
                  $link = "link_{$i}";
                  $image = "image_{$i}";
                  $style = "style_{$i}";
                  $title_html = '';
                  if($$title){
                     $$title_html = "<a href=\"{$$link}\">" . $$title . "</a>";
                  }
               ?>
               <?php if($$title){ ?>
                  <div class="item">
                     <div class="item-content">
                        <?php if($$link){ ?>
                           <a href="<?php print $$link ?>">
                        <?php } ?>
                           <div class="content-box" <?php print $bg_style ?>>
                              <div class="content-inner">
                                 <?php if($$title){ ?>
                                    <h3 class="title"><?php print $$title ?></h3>
                                 <?php } ?>
                                 <div>
                                    <?php for($r=1; $r<=5; $r++){ ?>
                                       <span class="fa fa-star <?php if($r <= $$reviews){ echo 'checked'; } ?>"></span>
                                    <?php } ?>
                                    <?php if($$time){ ?>
                                       <span class="time"><?php echo $$time; ?></span>
                                    <?php } ?>
                                 </div>
                                 <?php if($$content){ echo '<div class="desc">' . $$content . '</div>'; } ?>
                              </div>
                           </div>
                        <?php if($$link){ ?>
                           </a>
                        <?php } ?>
                     </div>
                  </div>
               <?php } ?>    
            <?php } ?>
         </div>   
      </div> 

         <?php return ob_get_clean();
      }

   }
 endif;  



