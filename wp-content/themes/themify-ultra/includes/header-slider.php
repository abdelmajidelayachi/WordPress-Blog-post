<?php
if (themify_get('header_wrap') === 'slider') {
    $images = themify_get_gallery_shortcode(themify_get('background_gallery', ''));
    if (!empty($images)) {
	
	Themify_Enqueue_Assets::loadThemeStyleModule('layouts/slider');
	Themify_Enqueue_Assets::loadThemeStyleModule('gallery-controller');

	$slider_args = array(
	    'data-lazy' => 1,
	    'data-effect' => 'fade',
	    'data-auto' => 'yes' === themify_get('background_auto', 'yes') ? themify_get('background_autotimeout', 5) : 0,
	    'data-speed' => themify_get('background_speed', 500),
	    'data-wrapvar' => 'yes' === themify_get('background_wrap', 'yes') ? 1 : 0,
	    'data-slider_nav' => themify_check('header_hide_controlls') ? 0 : 1
	);
	if(themify_check( 'header_hide_controls' )){
	    $slider_attrs['data-pager'] = $slider_attrs['data-slider_nav'] = 0;
	}
	$image_size=apply_filters('themify_theme_background_gallery_image_size', 'large');
	$isFirst=false;
	?>
	<div id="gallery-controller" class="tf_w tf_h tf_abs tf_overflow">
		<div <?php echo themify_get_element_attributes($slider_args) ?> class="tf_swiper-container tf_carousel tf_overflow tf_h tf_w tf_clearfix" data-height="100%">
		    <div class="tf_swiper-wrapper tf_lazy tf_h">
			<?php foreach ($images as $image): ?>
			    <?php
			    // Get large size for background
			    $image_data = wp_get_attachment_image_src($image->ID, $image_size);
			    if (empty($image_data[0])) {
				continue;
			    }
			    $alt = get_post_meta($image->ID, '_wp_attachment_image_alt', true);
			    $alt = !$alt ? get_post_meta($image->ID, '_wp_attachment_image_title', true) : $alt;
			    ?>
	    		<div class="tf_swiper-slide tf_lazy">
                            <?php echo themify_get_image( array( 'w' => '', 'h' => '', 'image_size'=>$image_size,  'src' => $image_data[0], 'alt'=> $alt,'is_slider'=>true,'lazy_load'=>$isFirst,'class'=>'tf_w tf_h' ) );?></div>
                            <?php $isFirst=true;?>
			<?php endforeach; ?>		
		    </div>
		</div>
	</div>
	<!-- /gallery-controller -->
	<?php
    }
}
