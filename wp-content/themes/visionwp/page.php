<?php
/**
 * Single Page 
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */

get_header(); 
do_action( 'visionwp_before_content' );?>

<div class="visionwp-single-post-wrapper">
	<div class="visionwp-container" id="site-content">
		<main id="main" class="site-main">
			<?php if ( have_posts() ): ?>
				<div class="visionwp-row" id="visionwp-main-content">
					<?php while ( have_posts() ) : the_post(); ?>
						<div class="visionwp-single-content"> 
							<?php 
								the_content(); 
								visionwp_content_navigation();
								?>
						</div>
					<?php endwhile; ?>
				</div>					
			<?php endif; ?>	
		</main>
	</div>	
</div>
<?php get_footer();