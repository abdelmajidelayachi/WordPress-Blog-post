<?php
/**
 * Template for banner
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */

$btn_link = get_query_var( 'visionwp-btn-link', false ); ?>	
<div class="visionwp-banner-wrapper">
	<?php
		$src = '';
		if( !is_attachment() && ( is_single() || is_page() ) && has_post_thumbnail() ) {
			$src = get_the_post_thumbnail_url( get_the_ID(), 'full' );
		}
		elseif( is_home() && !is_front_page() ) {											
			$src = get_the_post_thumbnail_url( get_option( 'page_for_posts' ), 'full' );
		}
		else {
			$src = get_header_image();
		}
	?>
	<?php if( '' != $src ) { ?>
		<img src="<?php echo esc_url( $src ); ?>">
	<?php } ?>
	<div class="visionwp-container">
		<div class="visionwp-banner-content-inner">
			<div class="visionwp-banner-content">
				<?php
				VisionWP_Helper::visionwp_banner_heading();
				VisionWP_Helper::visionwp_banner_text();
				if( $btn_link && !empty( $btn_link ) ) { ?>
					<div class="visionwp-site-button">
						<a href="<?php echo esc_url( $btn_link ); ?>" class="visionwp-primary-button"><?php esc_html_e( 'Contact us', 'visionwp' ); ?></a>
					</div>
				<?php } ?>
			</div>
			<div class="visionwp-breadcrumb-wrapper">
				<?php VisionWP_Helper::the_breadcrumb(); ?>
			</div>
		</div>
	</div>
</div>
