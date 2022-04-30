<?php 
global $themify; 
$categories = wp_get_object_terms( get_the_id(), 'portfolio-category' );
$class = '';
if ( ! is_wp_error( $categories ) ) {
	foreach ( $categories as $cat ) {
		if ( is_object( $cat ) ) {
			$class .= ' cat-' . $cat->term_id;
		}
	}
}
$is_loop = themify_loop_is_singular( 'portfolio' );
?>
<?php themify_post_before(); //hook ?>
<article id="portfolio-<?php the_id(); ?>" class="<?php echo implode(' ', get_post_class('post tf_clearfix portfolio-post' . $class)); ?>">
	<?php themify_post_start(); //hook ?>

	<?php if ( $is_loop===true ) : ?>

		<?php if ( $themify->hide_meta !== 'yes' ): ?>
			<p class="post-meta entry-meta">
			    <?php themify_meta_taxonomies('','<span class="separator">, </span>'); ?>
			</p>
		<?php endif; //post meta ?>

		<?php themify_post_title(); ?>

		 <?php get_template_part('includes/portfolio-meta', get_post_type()); ?>

	<?php endif; // is singular portfolio ?>

	<?php if ($is_loop===false && $themify->hide_image !== 'yes'){

	    themify_post_media();

	} // not singular portfolio ?>

	<div class="post-content">

		<?php if ( $is_loop===false  ) : ?>

			<div class="post-content-inner">

						<?php if ( $themify->hide_date !== 'yes' ) : ?>
							<?php themify_theme_post_date(); ?>
						<?php endif; ?>

						<?php if ( $themify->hide_meta !== 'yes' ): ?>
							<p class="post-meta entry-meta">
								<?php the_terms( get_the_id(), get_post_type() . '-category', '<span class="post-category">', ' <span class="separator">/</span> ', ' </span>' ) ?>
							</p>
						<?php endif; //post meta ?>

						<?php themify_post_title(); ?>

		<?php endif; // is singular portfolio ?>

		<?php themify_post_content()?>

		<?php if ( $is_loop===false ) : ?>

			</div>
			<!-- /.post-content-inner -->
		<?php endif; // is singular portfolio ?>

	</div>
	<!-- /.post-content -->
	<?php themify_post_end(); //hook ?>
</article>
<!-- /.post -->
<?php themify_post_after(); //hook 
