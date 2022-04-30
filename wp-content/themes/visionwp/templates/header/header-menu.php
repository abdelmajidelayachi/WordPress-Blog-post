<?php
/**
 * Template for header menu 
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */ 
?>
<div class="visionwp-menu-wrapper">
    <nav class="visionwp-primary-menu" id="site-navigation">
        <?php wp_nav_menu( array(
            'theme_location' => 'primary-menu',
            'echo'           => true,
            'container'      => false,
            'menu_id'        => 'primary-menu',
            'menu_class'     => 'navigation clearfix',
        )); ?>
    </nav>
    <button class="menu-toggler" id="menu-icon">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="screen-reader-text"><?php esc_html_e( 'menu toggler', 'visionwp' ); ?></span>
    </button>
</div>
