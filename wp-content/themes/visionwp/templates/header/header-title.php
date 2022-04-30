<?php
/**
 * Template for header site identity
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */ 
?>
<div class="visionwp-site-branding">
    <div>
        <?php the_custom_logo(); ?>
            <div class="<?php echo !display_header_text() ? 'screen-reader-text' : ''; ?>">
                <?php if ( is_front_page() ) : ?>
                    <h1 class="site-title">
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                            <?php bloginfo( 'name' ); ?>									
                        </a>
                    </h1>
                <?php else : ?>
                    <p class="site-title">
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                            <?php bloginfo( 'name' ); ?>									
                        </a>
                    </p>
                <?php endif; ?>
                <?php $description = get_bloginfo( 'description', 'display' );
                if ( $description || is_customize_preview() ) : ?>
                    <p class="site-description">
                        <?php echo esc_html( $description ); ?>								
                    </p>
            <?php endif; ?>
        </div>
    </div>
</div>