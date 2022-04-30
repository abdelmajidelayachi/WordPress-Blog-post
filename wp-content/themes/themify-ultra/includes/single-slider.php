<?php
$shortcode = themify_get( 'post_layout_slider' );
$slider = $shortcode?themify_get_gallery_shortcode($shortcode):false;
if ( ! $slider ) {
	return;
}
$img_width = themify_get('image_width');
$img_height = themify_get('image_height');
$image_size = !$img_width ? themify_get_gallery_shortcode_params( $shortcode, 'size' ) : 'full';

$speed = themify_get( 'setting-single_slider_speed', 'normal',true );
if( $speed === 'slow' ) {
	$speed = 4;
} elseif( $speed === 'fast' ) {
	$speed = 0.5;
} else {
	$speed = 1.25;
}
$config = apply_filters( 'themify_single_post_slider_args', array(
	'data-height'      => themify_get( 'setting-single_slider_height', 'auto',true),
	'data-auto'        => themify_get( 'setting-single_slider_autoplay', 'off',true )!=='off',
	'data-speed'       => $speed,
	'data-effect'      => themify_get( 'setting-single_slider_effect', 'scroll',true ),
) );
$isFirst=false;
?>
<div class="slider single-slider tf_rel tf_clearfix">
	<div data-lazy="1"<?php echo themify_get_element_attributes( $config)?> class="tf_swiper-container tf_carousel slides tf_rel tf_overflow">
		<div class="tf_swiper-wrapper tf_lazy tf_rel tf_w tf_h tf_textc">
			<?php foreach ( $slider as $image ) : ?>
				<?php
				$alt = get_post_meta($image->ID, '_wp_attachment_image_alt', true);
				$caption = $image->post_excerpt ? $image->post_excerpt : $image->post_content;
				if ( ! $alt ) {
					$alt = get_post_meta($image->ID, '_wp_attachment_image_title', true);
				}
				if ( ! $caption ) {
					$caption = $alt;
				}
				?>
				 <div class="tf_lazy tf_swiper-slide">
					<?php echo themify_get_image( array( 'w' => $img_width, 'h' => $img_height, 'image_size'=>$image_size,  'src' => $image->ID, 'crop'=> true,'is_slider'=>true,'lazy_load'=>$isFirst ) );
						$isFirst=true;
					?>
					<?php if ($caption): ?>
						<div class="slide-caption">
							<?php echo esc_html( $caption ); ?>
						</div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div><!-- .shortcode.slider -->