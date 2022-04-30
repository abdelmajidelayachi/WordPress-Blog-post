<?php 
/*
 * Template Name: VisionWP Full Width
 */
get_header();
do_action( 'visionwp_before_content' ); ?>
<div id="content">
	<?php
		if ( have_posts() ) {
			while ( have_posts() ) {
				the_post(); 
				the_content();
			} 
		}
	?>
</div>
<?php 
do_action( 'visionwp_after_content' ); 
get_footer();