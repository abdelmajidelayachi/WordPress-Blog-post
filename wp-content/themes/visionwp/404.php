<?php
/**
 * The template for displaying 404 pages
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 * @since 1.0.0
 * @package VisionWP
 */

get_header();
do_action( 'visionwp_before_content' ); ?>

<div class="visionwp-404-wrapper">
	<div class="visionwp-404-content visionwp-container">
		<h2>
			<?php esc_html_e( 'This page doesn\'t seem to exist', 'visionwp' ); ?>
		</h2>
		<p>
			<?php esc_html_e( 'It looks like the link pointing here was faulty. Maybe try searching?', 'visionwp' ) ?>
		</p>
		<div class="visionwp-404-btns">
			<div class="visionwp-404-search">				
				<?php get_search_form(); ?>
			</div>
			<a href="<?php echo esc_url( home_url( '/' ) ) ?>" class="btn visionwp-404-home-btn">
				<?php esc_html_e( 'Go Back Home', 'visionwp' ); ?>
				<i class="fa fa-greater-than"></i>
			</a>
		</div> 
	</div>
</div>
<?php 
do_action( 'visionwp_after_content' );
get_footer();