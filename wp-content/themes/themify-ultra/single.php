<?php
/**
 * Template for single post view
 * @package themify
 * @since 1.0.0
 */
get_header();
$isInfinity = themify_theme_is_single_infinite_enabled() && (is_singular('post') || is_singular('portfolio'));
if (is_singular('post') || is_singular('portfolio')) {
    ?>
<?php if ($isInfinity===true): ?>
    <div class="<?php echo implode(' ', apply_filters('tf_single_scroll_wrap', get_body_class('tf_single_scroll_wrap tf_rel tf_clear tf_w'))) ?>">
<?php endif; ?>
	<?php
	get_template_part('includes/featured-area');
    }
    ?>
    <!-- layout-container -->
    <div id="layout" class="pagewidth tf_box tf_clearfix">
	<?php
	if (have_posts()) {
	    the_post();
	    $style = get_post_type() === 'portfolio' ? 'portfolio' : 'single';
	    Themify_Enqueue_Assets::loadThemeStyleModule($style);
	    get_template_part('includes/content-single');
	}
	themify_get_sidebar();
	?>
    </div>    
<?php if ($isInfinity===true): ?>
    </div>
<?php endif; ?>
<?php get_footer(); 