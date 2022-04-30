<?php 
/**
 * The template for displaying all single posts
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 * @since 1.0.0
 * @package VisionWP WordPress Theme WordPress ThemeWordPress Theme
 */

get_header(); 

do_action( 'visionwp_before_content' );?>
<div class="visionwp-single-post-wrapper">
	<div class="visionwp-container" id="site-content">
		<div class="visionwp-row">
			<main id="main" class="site-main content-order">
				<?php if ( have_posts() ) : ?>
					<div class="visionwp-row" id="visionwp-main-content">
						<?php while ( have_posts() ) : the_post(); ?>
							<div class="visionwp-single-content">
								<?php if( has_post_thumbnail() ): ?>
									<div class="visionwp-single-thumbnail">
										<?php the_post_thumbnail( 'full' ); ?>
									</div>
								<?php endif; ?>
								<div class="visionwp-tag-wrapper">
									<?php VisionWP_Helper::display_tag_list(); ?>
								</div>
								<?php the_content(); ?>
							</div>
						<?php endwhile; ?>
					</div>					
				<?php endif; ?>
				<div class="visionwp-nav-wrapper">
					<div class="visionwp-nav-previous">
						<?php previous_post_link( '<i class="fa fa-long-arrow-left"></i> %link', '%title', true ); ?>	
					</div>
					<div class="visionwp-nav-next">
						<?php next_post_link( '%link <i class="fa fa-long-arrow-right"></i> ', '%title', true ); ?>	
					</div>
				</div>
				<?php if ( comments_open() || get_comments_number() ) {
					echo '<div class="visionwp-comment-wrapper">';
					if ( comments_open() || get_comments_number() ) {
						echo '<div class="visionwp-comment-wrapper">';
							comments_template();
						echo '</div>';
					}
				} ?>
			</main>		
			<?php visionwp_get_sidebar(); ?>
		</div>	
	</div>
</div>
<?php do_action( 'visionwp_after_content' ); 
get_footer() ?>