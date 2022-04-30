<?php
/**
 * The template for displaying woocommerce.
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @package VisionWP
 */

get_header(); ?>
<div id="content" class="container">
	<div class="row">
		<div class="visionwp-content-wrapper">
			<main id="main" class="site-main ">
			<?php if ( have_posts() ): ?>
				<div class="row" id="load-more">
                    <?php woocommerce_content(); ?>
				</div>
			
				<?php the_posts_pagination(
					array(
						'prev_text' => esc_html__( 'Previous', 'visionwp' ),
						'next_text' => esc_html__( 'Next', 'visionwp' ),
                    ),
				); ?>				
			<?php else: ?>
				<?php
					get_template_part( 'templates/content/content', 'none' );
				?>
			<?php endif; ?>				
			</main><!-- .site-main -->
		</div>
		<?php if( visionwp_is_sidebar_active() ) : ?>
			<div class="visionwp-sidebar-wrapper">
				<?php get_sidebar(); ?>
			</div>
		<?php endif; ?>
	</div>
</div>
<?php get_footer(); ?>