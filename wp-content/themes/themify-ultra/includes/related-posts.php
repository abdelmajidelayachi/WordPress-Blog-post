<?php
/**
 * Partial template to display related posts for the current single entry.
 *
 * @since 1.0.0
 */

if( 'post' !== get_post_type() ) {
	return;
}

$key = 'setting-relationship_taxonomy';

// Either 'tag' or 'category'. Used later in query.
$taxonomy_type = 'tag' === themify_get( $key,false,true ) ? 'tag' : 'category';
// Set taxonomy for the corresponding post type. Defaults to category/{post_type}-category.
$taxonomy = 'tag' === $taxonomy_type ? 'post_tag' : 'category';

$saved_entry = get_post();
$terms       = wp_get_post_terms( get_the_id(), $taxonomy );
$term_ids    = array();

if ( ! is_wp_error( $terms ) && is_array( $terms ) ) {
	for ( $i = 0,$count=count( $terms ); $i < $count; ++$i ) {
		$term_ids[$i] = $terms[$i]->term_id;
	}
	$related = new WP_Query( array(
		$taxonomy_type . '__in' => $term_ids,
		'post__not_in'          => array_merge( array( get_the_id() ), get_option( 'sticky_posts' ) ),
		'posts_per_page'        => themify_get( $key.'_entries',3,true ),
		'ignore_sticky_posts '  => true,
	) );
	if ( $related->have_posts() ) : ?>
		<?php 
		    Themify_Enqueue_Assets::loadThemeStyleModule('related-posts');
		    global $themify;
		    $themify_save = clone $themify;
		    // Content to display
		    $themify->display_content = themify_get( $key . '_display_content',false,true );
		    $themify->auto_featured_image = themify_check( 'setting-auto_featured_image',true );
		    $themify->width = themify_get( $key . '_image_width',394,true );
		    $themify->height = themify_get( $key . '_image_height',330,true );
            $themify->hide_image=!themify_check( $key . '_hide_image',true )?'':'yes';
		?>
		<div class="related-posts tf_clearfix">
			<h4 class="related-title"><?php _e( 'Related Posts', 'themify' ); ?></h4>
			<?php while ( $related->have_posts() ) : $related->the_post(); ?>
				<article class="post type-post tf_clearfix">
					<?php themify_post_media(array('no_hook'=>true,'unlink'=>false,'use_video_link'=>true));?>
					<div class="post-content">
						<p class="post-meta">
							<?php themify_the_terms( get_the_id(), 'post' !== get_post_type() ? get_post_type() . '-category' : 'category', ' <span class="post-category">', '<span class="separator">, </span>', '</span>' ); ?>
						</p>
						<?php 
						    themify_post_title( array( 'tag' => 'h4', 'no_hook' => true, 'unlink' => false, 'show_title' => true ) );
						    themify_post_content();
						?>
					</div>
					<!-- /.post-content -->
				</article>
			<?php endwhile; ?>
		</div>
		<!-- /.related-posts -->
		<?php  
		$themify = clone $themify_save;
		$themify_save=null;
		?>
	<?php endif;
}
$post = $saved_entry;
wp_reset_query();
