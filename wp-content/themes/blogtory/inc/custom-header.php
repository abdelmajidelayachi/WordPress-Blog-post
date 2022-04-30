<?php
/**
 * Sample implementation of the Custom Header feature
 *
 * You can add an optional custom header image to header.php like so ...
 *
	<?php the_header_image_tag(); ?>
 *
 * @link https://developer.wordpress.org/themes/functionality/custom-headers/
 *
 * @package Blogtory
 */

/**
 * Set up the WordPress core custom header feature.
 *
 * @uses blogtory_header_style()
 */
function blogtory_custom_header_setup() {
	add_theme_support( 'custom-header', apply_filters( 'blogtory_custom_header_args', array(
		'default-image'          => '',
		'default-text-color'     => '000000',
		'width'                  => 1920,
		'height'                 => 300,
		'flex-height'            => true,
		'wp-head-callback'       => 'blogtory_header_style',
	) ) );
}
add_action( 'after_setup_theme', 'blogtory_custom_header_setup' );

if ( ! function_exists( 'blogtory_header_style' ) ) :
	/**
	 * Styles the header image and text displayed on the blog.
	 *
	 * @see blogtory_custom_header_setup().
	 */
	function blogtory_header_style() {
		$header_text_color = get_header_textcolor();
        $site_slogan_color = blogtory_get_option('site_slogan_color');
        ?>
        <style type="text/css">
            .be-site-slogan{
                color:<?php echo esc_attr( $site_slogan_color ); ?>;
            }
        </style>
        <?php

		/*
		 * If no custom options for text are set, let's bail.
		 * get_header_textcolor() options: Any hex value, 'blank' to hide text. Default: add_theme_support( 'custom-header' ).
		 */
		if ( get_theme_support( 'custom-header', 'default-text-color' ) === $header_text_color ) {
			return;
		}

		// If we get this far, we have custom styles. Let's do this.
		?>
		<style type="text/css">
		<?php
		// Has the text been hidden?
		if ( ! display_header_text() ) :
			?>
			.site-title,
			.site-description {
				position: absolute;
				clip: rect(1px, 1px, 1px, 1px);
			}
		<?php
		// If the user has set a custom color for the text use that.
		else :
			?>
			.site-title a,
			.site-description{
				color: #<?php echo esc_attr( $header_text_color ); ?>;
			}
		<?php endif; ?>
		</style>
		<?php
	}
endif;