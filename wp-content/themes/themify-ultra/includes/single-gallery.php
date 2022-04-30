<?php
$shortcode = themify_get('post_layout_gallery');
$gallery = $shortcode?themify_get_gallery_shortcode($shortcode):false;
if (!$gallery) {
	return;
}
$thumb_size = themify_get_gallery_shortcode_params($shortcode, 'size','thumbnail');
$columns = themify_get_gallery_shortcode_params($shortcode, 'columns',3);
$use = themify_is_image_script_disabled();
if ($thumb_size !== 'full') {
	$size['width'] = get_option("{$thumb_size}_size_w");
	$size['height'] = get_option("{$thumb_size}_size_h");
}
$isNewWp=function_exists('wp_filter_content_tags');
?>
<div data-lazy="1" class="gallery gallery-wrapper packery-gallery masonry gallery-columns-<?php echo $columns ?> tf_clearfix">
	<?php foreach ($gallery as $image): ?>
		<?php
		$caption = $image->post_excerpt ? $image->post_excerpt : $image->post_content;
		$description = $image->post_content ? $image->post_excerpt : $image->post_excerpt;
		$alt = get_post_meta($image->ID, '_wp_attachment_image_alt', true);
		if (!$alt) {
			$alt = $caption ? $caption : ($description ? $description : the_title_attribute('echo=0'));
		}
		$featured = get_post_meta($image->ID, 'themify_gallery_featured', true);
		$img_size = $thumb_size !== 'full' ? $size : ( $featured ? array('width' => 474, 'height' => 542) : array('width' => 474, 'height' => 271));
		$img_size = apply_filters('themify_single_gallery_image_size', $img_size, $featured);
		$height = $thumb_size !== 'full' && $featured ? 2 * $img_size['height'] : $img_size['height'];
		$thumb = $featured ? 'large' : $thumb_size;
		$img = wp_get_attachment_image_src($image->ID, apply_filters('themify_gallery_post_type_single', $thumb));
		$url = !$featured || $use ? $img[0]:themify_get_image("src={$img[0]}&w={$img_size['width']}&h={$height}&urlonly=true");
		$lightbox_url = $thumb_size!=='large'?wp_get_attachment_image_src($image->ID, 'large'):$img;
		$img = '<img src="'.$url.'" alt="'.esc_attr( $alt ).'" class="wp-post-image wp-image-' . $image->ID.'" />';
		$img = $isNewWp===true?wp_filter_content_tags($img):wp_make_content_images_responsive($img);
		?>
		<div class="item gallery-icon <?php echo esc_attr( $featured ); ?>">
		    <a href="<?php echo esc_url( $lightbox_url[0] ) ?>" title="<?php esc_attr_e($image->post_title) ?>" data-caption="<?php esc_attr_e($caption); ?>" data-description="<?php esc_attr_e( $description ); ?>" class="themify_lightbox">
				<span class="gallery-item-wrapper">
					<?php echo $img;?>
					<?php if ($caption): ?>
						<div class="gallery-caption">
							<span><?php echo esc_html( $caption ); ?></span>
						</div>
					<?php endif; ?>
				</span>
			</a>
		</div>
	<?php endforeach; ?>
</div>