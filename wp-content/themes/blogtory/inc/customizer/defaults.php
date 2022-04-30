<?php
/**
 * Default customizer values.
 *
 * @package Blogtory
 */
if ( ! function_exists( 'blogtory_get_default_customizer_values' ) ) :
	/**
	 * Get default customizer values.
	 *
	 * @since 1.0.0
	 *
	 * @return array Default customizer values.
	 */
	function blogtory_get_default_customizer_values() {

		$defaults = array();

        $defaults['enable_trending_posts'] = false;
		$defaults['trending_post_cat'] = 1;
		$defaults['no_of_trending_posts'] = 5;
		$defaults['trending_orderby'] = 'date';
		$defaults['trending_order'] = 'desc';
		$defaults['trending_post_text'] = __('Trending Now', 'blogtory');

		$defaults['enable_home_banner'] = false;
		$defaults['banner_display_as'] = 'slider';
		$defaults['disable_banner_autoplay'] = false;
		$defaults['disable_banner_loop'] = false;
		$defaults['show_banner_dots'] = false;
		$defaults['hide_banner_nav'] = false;
		$defaults['banner_overlay_color'] = '#000';
		$defaults['banner_overlay_opacity'] = 0.7;
		$defaults['banner_speed'] = 750;
		$defaults['banner_slider_style'] = 'style_1';
		$defaults['banner_carousel_style'] = 'style_1';
		$defaults['banner_carousel_margin'] = 10;
		$defaults['banner_layout'] = 'full-width';
		$defaults['banner_content_from'] = 'category';
		$defaults['banner_post_cat'] = 1;
		$defaults['no_of_banner_posts'] = 4;
		$defaults['banner_posts_orderby'] = 'date';
		$defaults['banner_posts_order'] = 'desc';
		$defaults['banner_post_ids'] = '';

        $defaults['banner_excerpt_length'] = 40;
        $defaults['banner_read_more_text'] = __('Read More', 'blogtory');
		$defaults['show_banner_category'] = true;
		$defaults['show_banner_meta'] = true;

		$defaults['home_page_layout'] = 'no-sidebar';
		$defaults['front_page_sticky_sidebar'] = true;
		
        $defaults['enable_posts_in_front_page'] = true;
        $defaults['front_blog_style'] = 'archive_style_2';
        $defaults['front_page_excerpt_length'] = 40;
        $defaults['front_first_post_excerpt_length'] = 40;
        $defaults['front_page_pagination_type'] = 'numeric';
        $defaults['home_numeric_pagination_align'] = 'center';

		$defaults['enable_top_bar'] = false;
        $defaults['enable_todays_dates'] = false;
		$defaults['todays_date_format'] = 'l, F j Y';
		$defaults['enable_top_bar_social_nav'] = false;

		$defaults['header_style'] = 'header_style_1';
		$defaults['ad_banner_image'] = '';
		$defaults['ad_banner_link'] = '';
		$defaults['enable_search_on_header'] = true;

		$defaults['show_preloader'] = false;
		$defaults['preloader_color'] = '#74c0fc';
		$defaults['enable_breadcrumb'] = true;

        $defaults['global_sidebar_layout'] = 'no-sidebar';
        $defaults['sticky_sidebar'] = true;

        /* Font and Colors */
        $defaults['primary_color'] = '#74c0fc';
        $defaults['primary_font'] = 'Montserrat:400,400i,500,700';
        $defaults['secondary_font'] = 'Open+Sans:300,400,400italic,600,700';

        $defaults['excerpt_length'] = 40;
        $defaults['excerpt_read_more_text'] = __('Read More', 'blogtory');

        $defaults['single_post_style'] = 'single_style_1';
        $defaults['posts_navigation_style'] = 'style_1';
        $defaults['show_related_posts'] = true;
        $defaults['show_author_posts'] = true;
        $defaults['related_posts_text'] = __('Related Articles', 'blogtory');
        $defaults['author_posts_text'] = __('More From Author', 'blogtory');
        $defaults['no_of_related_posts'] = 4;
        $defaults['no_of_author_posts'] = 4;
        $defaults['related_author_col'] = 4;

        $defaults['archive_style'] = 'archive_style_2';
        $defaults['archive_excerpt_length'] = 40;
        $defaults['archive_first_post_excerpt_length'] = 40;
        $defaults['archive_pagination_type'] = 'default';
        $defaults['archive_pagination_align'] = 'center';

        /*Footer*/
        $defaults['footer_column_layout'] = 'footer_layout_1';
        $defaults['enable_footer_nav'] = false;
        $defaults['enable_footer_credit'] = true;
        $defaults['copyright_text'] = esc_html__( 'Copyright &copy; All rights reserved.', 'blogtory' );
        /**/

		$defaults = apply_filters( 'blogtory_default_customizer_values', $defaults );
		return $defaults;
	}
endif;