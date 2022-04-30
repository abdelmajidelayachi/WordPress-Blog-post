<?php
/**
 * Template for post not found
 * @since 1.0.0
 * @package VisionWP
 */?>
<div class="visionwp-no-results not-found">
    <div class="visionwp-page-header">
        <h1 class="page-title"><?php esc_html_e( 'Nothing Found', 'visionwp' ); ?></h1>
    </div>
    <?php if( current_user_can( 'publish_posts' ) ): ?>
        <div class="visionwp-page-content">
            <?php get_search_form(); ?>
            <?php
                printf(
                    '<p>%1$s</p><a href="%2$s">%3$s</a>',
                    esc_html__( 'Sorry, but nothing matched your search. Please try again with some different keywords or you can add post.', 'visionwp' ),
                    esc_url( admin_url( 'post-new.php' ) ),
                    esc_html__( 'Home', 'visionwp' ),
                )
            ?>
        </div>
    <?php else: ?>
        <div class="visionwp-page-content">
            <?php get_search_form();
                printf(
                    '<p>%1$s</p> ',
                    esc_html__( 'We can\'t seem to find any result that match your search key.', 'visionwp' ),
                    esc_url( admin_url( 'post-new.php' ) ),
                )
            ?>
        </div>
        <div>
            <a href="<?php echo esc_url( home_url( '/' ) ) ?>" class="visionwp-btn-primary"><?php echo esc_html__( 'Home', 'visionwp' ) ?></a>
        </div>
    <?php endif; ?>
</div>