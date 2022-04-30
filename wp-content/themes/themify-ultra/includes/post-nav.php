<?php 
/**
 * Post Navigation Template
 * @package themify
 * @since 1.0.0
 */

$post_type = 'portfolio' === get_post_type() ? 'portfolio' : 'post';

if ( ! themify_check( "setting-{$post_type}_nav_disable",true ) ) :

	$in_same_cat = themify_check( "setting-{$post_type}_nav_same_cat",true );
	$this_taxonomy = 'post' === $post_type ? 'category' : $post_type . '-category';
	$previous = themify_theme_prev_single_post( '<span class="prev tf_box">%link</span>', '<span class="arrow"></span> %title');
	$next = get_next_post_link('<span class="next tf_box">%link</span>', '<span class="arrow"></span> %title',$in_same_cat,'', $this_taxonomy);

	if ( ! empty( $previous ) || !empty( $next ) ) : 
	    Themify_Enqueue_Assets::loadThemeStyleModule('post-nav');    
	?>

		<div class="post-nav tf_box tf_clearfix">
			<?php echo $previous,$next; ?>
		</div>
		<!-- /.post-nav -->

	<?php endif; // empty previous or next

endif; // check setting nav disable