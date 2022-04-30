<?php
global $themify;

if (have_posts() && $themify->post_layout_type && $themify->post_layout_type !== 'classic'){
    the_post(); 
    ?>
    <div class="featured-area tf_textc fullcover">
	<?php
	if ($themify->post_layout_type === 'gallery' || $themify->post_layout_type === 'slider') {

	    if ($themify->hide_image !== 'yes') {
		get_template_part('includes/single-' . $themify->post_layout_type, 'single');
	    }
	} 
	else {
	    themify_post_media();
	}
	get_template_part('includes/post-meta', get_post_type());
	?>
    </div>
    <?php
    rewind_posts(); 
}
