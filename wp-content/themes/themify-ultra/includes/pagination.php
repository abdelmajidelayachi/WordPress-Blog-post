<?php
/**
 * Partial template for pagination.
 * Creates numbered pagination or displays button for infinite scroll based on user selection
 *
 * @since 1.0.0
 */
global $themify;
if (  'slider' !== $themify->post_layout  && 'infinite' === themify_get('setting-more_posts',false,true))  {
	global $wp_query, $total_pages;
	if(!isset($total_pages)){
		$total_pages=$wp_query->max_num_pages;
	}
	$current_page = get_query_var( 'paged' );
	if(empty($current_page)){
		$current_page=get_query_var( 'page',1 );
	}
    $current_page=$current_page<1?1:$current_page;
	if ( $total_pages > $current_page ) {
		Themify_Enqueue_Assets::loadinfiniteCss();
		echo '<p class="tf_load_more tf_textc tf_clear"><a href="' . next_posts( $total_pages, false ) . '" data-page="'.esc_attr($current_page).'" class="load-more-button">' . __( 'Load More', 'themify' ) . '</a></p>';
	}
	$total_pages=null;
} else {
	if ( 'numbered' === themify_get( 'setting-entries_nav','numbered',true )) {
		themify_pagenav();
	} else { 
	    Themify_Enqueue_Assets::loadThemeStyleModule('post-nav');
	?>
		<div class="post-nav tf_box tf_clearfix">
			<span class="prev tf_box"><?php next_posts_link( __( '&laquo; Older Entries', 'themify' ) ) ?></span>
			<span class="next tf_box"><?php previous_posts_link( __( 'Newer Entries &raquo;', 'themify' ) ) ?></span>
		</div>
	<?php
	}
}