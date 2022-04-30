<?php
/**
 * The sidebar on widget area
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.0.0
 * @package VisionWP WordPress Theme WordPress ThemeWordPress Theme
 */

if( !is_active_sidebar( 'visionwp_sidebar' )  ) {
    return;
} ?>

<aside id="secondary" class="widget-area">
    <?php dynamic_sidebar( 'visionwp_sidebar' ); ?>
</aside>