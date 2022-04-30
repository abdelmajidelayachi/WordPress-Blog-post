<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme and one of the
 * two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * For example, it puts together the home page when no home.php file exists.
 *
 * Learn more: https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package VisionWP WordPress Theme
 */
get_header();
do_action( 'visionwp_before_content' ); ?>
<div class="visionwp-content-wrapper" id="site-content">
    <div class="visionwp-container">
        <div class="visionwp-row">
            <main id="main" class="site-main content-order">
                <?php if( have_posts() ) : ?>
                    <div class="visionwp-row" id="visionwp-main-content">
                        <?php
                            while( have_posts() ) : the_post();
                            ?>
                            <div class="visionwp-content-post">
                                <?php get_template_part( 'templates/content/content', '' ); ?>
                            </div>
                    <?php endwhile; ?>
                </div>
                <?php else: ?>
					<?php
						get_template_part( 'templates/content/content', 'none' );
					?>
				<?php endif; ?>	
                <div class="visionwp-page-navigation">
                    <?php VisionWP_Helper::get_pagination(); ?>
                </div>
            </main>
            <?php visionwp_get_sidebar(); ?>
        </div>        
    </div>	
</div>
<?php  do_action( 'visionwp_after_content' ); 
get_footer(); ?>