<?php
/**
 * Template for individual post
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */ ?>
<article class="visionwp-content" id="post-<?php the_ID(); ?>" <?php post_class( 'visionwp-post' ); ?> >
	<?php $orders = visionwp_get( 'post_meta_order' );
	if( $orders ) {
		foreach( $orders as $order ) {
			visionwp_post_meta_order( $order );
		}		
	} ?>
</article>