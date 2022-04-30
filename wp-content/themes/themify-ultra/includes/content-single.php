<?php
/**
 * Partial template for single view.
 * Loaded in regular page load queries and also through ajax with Themify Single Infinite.
 *
 */
global $themify;
$post_type = get_post_type();
?>
<?php themify_content_before(); // hook    ?>
<!-- content -->
<main id="content" class="tf_box tf_clearfix">
    <?php themify_content_start(); // hook ?>
    <?php if ($post_type !== 'portfolio' && (!$themify->post_layout_type || $themify->post_layout_type === 'classic' )) : ?>

	<?php get_template_part('includes/loop', $post_type); ?>

    <?php else: ?>

	<?php themify_post_before(); // hook   ?>

        <article id="post-<?php the_id(); ?>" <?php post_class('post tf_clearfix'); ?>>
	    <?php
	    themify_post_start();
	    if ($post_type === 'portfolio' && $themify->post_layout_type === 'classic') {
		themify_post_media();
		get_template_part('includes/post-meta', $post_type);
	    }
	    ?>
    	<div class="post-content">
		<?php
		if ($post_type === 'portfolio') {
		    get_template_part('includes/portfolio-meta', $post_type);
		}
		themify_post_content();
		?>
    	</div>
	    <?php themify_post_end(); // hook    ?>
        </article>

	<?php themify_post_after(); // hook  ?>

    <?php endif; ?>

    <?php
    wp_link_pages(array('before' => '<p class="post-pagination"><strong>' . __('Pages:', 'themify') . ' </strong>', 'after' => '</p>', 'next_or_number' => 'number'));

    get_template_part('includes/author-box', 'single');

    get_template_part('includes/post-nav');

    $key = 'setting-relationship_taxonomy';
    if (is_single() && 'none' !== themify_get( $key . '_enabled',themify_get($key,null,true),true )) {
	    get_template_part('includes/related-posts', 'loop');
    }

    themify_comments_template();

    themify_content_end(); // hook 
    ?>
</main>
<!-- /content -->
<?php
themify_content_after(); // hook 