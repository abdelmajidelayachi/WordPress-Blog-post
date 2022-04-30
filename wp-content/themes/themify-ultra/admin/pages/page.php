<?php

/**
 * Page Meta Box Options
 * @since 1.0.0
 * @return array
 */
if (!function_exists('themify_theme_page_meta_box')) {

    function themify_theme_page_meta_box() {
	return array(
	    // Page Layout
	    array(
		'name' => 'page_layout',
		'title' => __('Sidebar Option', 'themify'),
		'description' => '',
		'type' => 'layout',
		'show_title' => true,
		'meta' => array(
		    array('value' => 'default', 'img' => 'themify/img/default.svg', 'selected' => true, 'title' => __('Default', 'themify')),
		    array('value' => 'sidebar1', 'img' => 'images/layout-icons/sidebar1.png', 'title' => __('Sidebar Right', 'themify')),
		    array('value' => 'sidebar1 sidebar-left', 'img' => 'images/layout-icons/sidebar1-left.png', 'title' => __('Sidebar Left', 'themify')),
		    array('value' => 'sidebar2', 'img' => 'images/layout-icons/sidebar2.png', 'title' => __('Left and Right', 'themify')),
		    array('value' => 'sidebar2 content-left', 'img' => 'images/layout-icons/sidebar2-content-left.png', 'title' => __('2 Right Sidebars', 'themify')),
		    array('value' => 'sidebar2 content-right', 'img' => 'images/layout-icons/sidebar2-content-right.png', 'title' => __('2 Left Sidebars', 'themify')),
		    array('value' => 'sidebar-none', 'img' => 'images/layout-icons/sidebar-none.png', 'title' => __('No Sidebar ', 'themify'))
		),
		'default' => 'default',
		'hide' => 'sidebar-none post_sticky_sidebar',
	    ),
	    array(
		'name' => 'post_sticky_sidebar',
		'title' => __('Sticky Sidebar', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		'show_title' => true,
		'enable_toggle' => true,
		'class' => 'hide-if sidebar-none',
		'meta' => array(
		    array('value' => '', 'name' => '', 'selected' => true),
		    array('value' => 1, 'name' => __('Enable', 'themify')),
		    array('value' => 0, 'name' => __('Disable', 'themify'))
		),
	    ),
	    // Content Width
	    array(
		'name' => 'content_width',
		'title' => __('Content Width', 'themify'),
		'description' => 'Select "Fullwidth" if the page is to be built with the Builder without the sidebar (it will make the Builder content fullwidth).',
		'type' => 'layout',
		'show_title' => true,
		'meta' => array(
		    array(
			'value' => 'default_width',
			'img' => 'themify/img/default.svg',
			'selected' => true,
			'title' => __('Default', 'themify')
		    ),
		    array(
			'value' => 'full_width',
			'img' => 'themify/img/fullwidth.svg',
			'title' => __('Fullwidth', 'themify')
		    )
		),
		'default' => 'default_width'
	    ),
	    // Hide page title
	    array(
		'name' => 'hide_page_title',
		'title' => __('Hide Page Title', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'default', 'name' => '', 'selected' => true),
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'))
		),
		'default' => 'default'
	    ),
	    // Custom menu
	    array(
		'name' => 'custom_menu',
		'title' => __('Custom Menu', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		// extracted from $args
		'meta' => themify_get_available_menus()
	    ),
	    // Full section scroll
        array(
            'type' => 'separator'
        ),
        array(
		'name' => 'section_full_scrolling',
		'shop'=>false,
		'title' => __('Builder Section Scroll', 'themify'),
		'description' => __('When it is enabled, each Builder row will be full height and perform section scroll on page scroll.', 'themify'),
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'), 'selected' => true)
		),
		'default' => 'no',
		'hide' => 'no section-scrolling-mobile section-scrolling-direction section-scrolling-style section-scrolling-parallax section-scrolling-effect'
	    ),
	    // Scroll Section on mobile devices
	    array(
		'name' => 'section_scrolling_mobile',
		'title' => '',
		'after' => __('Keep section scroll enabled on tablet/mobile', 'themify'),
		'type' => 'checkbox',
		'default' => 'checked',
		'shop'=>false,
		'class' => 'section-scrolling-mobile'
	    ),
	    array(
			'name' => 'section_scrolling_effect',
			'title' => '',
			'type' => 'dropdown',
			'meta' => array(
				array('value' => 'scroll', 'name' => __('Scroll', 'themify'), 'selected' => true),
				array('value' => 'fade', 'name' => __('Fade', 'themify'))
			),
			'shop' => false,
			'default' => 'scroll',
			'class' => 'section-scrolling-effect',
			'after' => __(' Scroll Effect', 'themify')
	    ),
	    // section scroll direction
	    array(
		'name' => 'section_scrolling_direction',
		'title' => '',
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'vertical', 'name' => __('Vertical', 'themify'), 'selected' => true),
		    array('value' => 'horizontal', 'name' => __('Horizontal', 'themify'))
		),
		'shop'=>false,
		'default' => 'vertical',
		'class' => 'section-scrolling-direction',
		'after' => __(' Scroll Direction', 'themify')
	    ),
	    // section scroll style
	    array(
		'name' => 'section_scrolling_style',
		'title' => '',
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'snake', 'name' => __('Snake-style', 'themify'), 'selected' => true),
		    array('value' => 'single', 'name' => __('Single-direction', 'themify'))
		),
		'default' => 'snake',
		'shop'=>false,
		'class' => 'section-scrolling-style',
		'after' => __(' Scroll Style', 'themify')
	    ),
	    // Enalble parallax scrolling
	    array(
		'name' => 'section_scrolling_parallax',
		'title' => '',
		'after' => __(' Disable parallax scrolling', 'themify'),
		'type' => 'checkbox',
		'default' => 'off',
		'shop'=>false,
		'class' => 'section-scrolling-parallax'
	    ),
	    array(
			'name' => 'fullpage_footer_section',
			'title' => '',
			'after' => __('Append footer as last section', 'themify'),
			'type' => 'checkbox',
			'default' => 'off',
			'shop' => false,
			'class' => 'fullpage-footer',
	    ),
	);
    }

}

/**
 * Default Page Layout Module
 * @param array $data Theme settings data
 * @return string Markup for module.
 * @since 1.0.0
 */
function themify_default_page_layout($data = array()) {
    $data = themify_get_data();

    /**
     * Theme Settings Option Key Prefix
     * @var string
     */
    $prefix = 'setting-default_page_';

    /**
     * Sidebar placement options
     * @var array
     */
    $sidebar_location_options = array(
	array('value' => 'sidebar1', 'img' => 'images/layout-icons/sidebar1.png', 'selected' => true, 'title' => __('Sidebar Right', 'themify')),
	array('value' => 'sidebar1 sidebar-left', 'img' => 'images/layout-icons/sidebar1-left.png', 'title' => __('Sidebar Left', 'themify')),
	array('value' => 'sidebar2', 'img' => 'images/layout-icons/sidebar2.png', 'title' => __('Left and Right', 'themify')),
	array('value' => 'sidebar2 content-left', 'img' => 'images/layout-icons/sidebar2-content-left.png', 'title' => __('2 Right Sidebars', 'themify')),
	array('value' => 'sidebar2 content-right', 'img' => 'images/layout-icons/sidebar2-content-right.png', 'title' => __('2 Left Sidebars', 'themify')),
	array('value' => 'sidebar-none', 'img' => 'images/layout-icons/sidebar-none.png', 'title' => __('No Sidebar', 'themify'))
    );

    /**
     * Tertiary options <blank>|yes|no
     * @var array
     */
    $default_options = array(
	array('name' => '', 'value' => ''),
	array('name' => __('Yes', 'themify'), 'value' => 'yes'),
	array('name' => __('No', 'themify'), 'value' => 'no')
    );

    /**
     * Module markup
     * @var string
     */
    $output = '';

    /**
     * Page sidebar placement
     */
    $output .= '<p>
					<span class="label">' . __('Page Sidebar Option', 'themify') . '</span>';
    $val = isset($data[$prefix . 'layout']) ? $data[$prefix . 'layout'] : '';
    foreach ($sidebar_location_options as $option) {
	if (( '' == $val || !$val || !isset($val) ) && ( isset($option['selected']) && $option['selected'] )) {
	    $val = $option['value'];
	}
	if ($val == $option['value']) {
	    $class = "selected";
	} else {
	    $class = "";
	}
	$output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
    }
    $output .= '<input type="hidden" name="' . $prefix . 'layout" class="val" value="' . $val . '" /></p>';


    $output .= '<p class="pushlabel" data-show-if-element="[name=' . esc_attr($prefix) . 'layout]" 
		    data-show-if-value=\'["sidebar1", "sidebar1 sidebar-left", "sidebar2" ,"sidebar2 content-left" ,"sidebar2 content-right"]\'>
						<label for="' . esc_attr($prefix) . 'sticky_sidebar">
							<input type="checkbox" id="' . esc_attr($prefix) . 'sticky_sidebar" name="' . esc_attr($prefix) . 'sticky_sidebar" value="1"
							' . checked(themify_get(esc_attr($prefix) . 'sticky_sidebar'), 1, false) . '
							/>' . __('Enable sticky sidebar', 'themify') . '
						</label>
					</p>';
    /**
     * Hide Title in All Pages
     */
    $output .= '<p>
					<span class="label">' . __('Hide Title in All Pages', 'themify') . '</span>
					<select name="setting-hide_page_title">' .
	    themify_options_module($default_options, 'setting-hide_page_title') . '
					</select>
				</p>';

    /**
     * Hide Feauted images in All Pages
     */
    $output .= '<p>
					<span class="label">' . __('Hide Featured Image', 'themify') . '</span>
					<select name="setting-hide_page_image">' .
	    themify_options_module($default_options, 'setting-hide_page_image') . '
					</select>
				</p>';

    /**
     * Featured Image dimensions
     */
    $output .= '<p>
				<span class="label">' . __('Image Size', 'themify') . '</span>
				<input type="text" class="width2" name="setting-page_featured_image_width" value="' . themify_get('setting-page_featured_image_width') . '" /> ' . __('width', 'themify') . ' <small>(px)</small>
				<input type="text" class="width2 show_if_enabled_img_php" name="setting-page_featured_image_height" value="' . themify_get('setting-page_featured_image_height') . '" /> <span class="show_if_enabled_img_php">' . __('height', 'themify') . ' <small>(px)</small></span>
				<br /><span class="pushlabel show_if_enabled_img_php"><small>' . __('Enter height = 0 to disable vertical cropping with img.php enabled', 'themify') . '</small></span>
			</p>';

    /**
     * Page Comments
     */
    $pre = 'setting-comments_pages';
    $output .= '<p><span class="label">' . __('Page Comments', 'themify') . '</span><label for="' . $pre . '"><input type="checkbox" id="' . $pre . '" name="' . $pre . '" ' . checked(themify_get($pre), 'on', false) . ' /> ' . __('Disable comments in all Pages', 'themify') . '</label></p>';

    return $output;
}

/**
 * Default Custom Post Layout Module
 * @param array $data Theme settings data
 * @return string Markup for module.
 * @since 1.0.0
 */
if (!function_exists('themify_ultra_custom_post_type_layouts')) {

    function themify_ultra_custom_post_type_layouts($data = array()) {
	$data = themify_get_data();

	/**
	 * Theme Settings Option Key Prefix
	 * @var string
	 */
	$prefix = 'setting-custom_post_';

	/**
	 * Module markup
	 * @var string
	 */
	$output = '';

	$custom_posts = null;

	$post_types = get_post_types(array('public' => true, 'publicly_queryable' => 'true'), 'objects');
        $excluded_types = apply_filters( 'themify_exclude_CPT_for_sidebar', array('post', 'page', 'attachment', 'product', 'tbuilder_layout', 'tbuilder_layout_part', 'section', 'portfolio'));


	foreach ($post_types as $key => $value) {
	    if (!in_array($key, $excluded_types)) {
		$custom_posts[$key] = array('name' => $value->labels->singular_name, 'archive' => $value->has_archive);
	    }
	}

	$custom_posts = apply_filters('themify_get_public_post_types', $custom_posts);

	/**
	 * Sidebar placement options
	 * @var array
	 */
	$sidebar_location_options = array(
	    array('value' => 'sidebar1', 'img' => 'images/layout-icons/sidebar1.png', 'selected' => true, 'title' => __('Sidebar Right', 'themify')),
	    array('value' => 'sidebar1 sidebar-left', 'img' => 'images/layout-icons/sidebar1-left.png', 'title' => __('Sidebar Left', 'themify')),
	    array('value' => 'sidebar2', 'img' => 'images/layout-icons/sidebar2.png', 'title' => __('Left and Right', 'themify')),
	    array('value' => 'sidebar2 content-left', 'img' => 'images/layout-icons/sidebar2-content-left.png', 'title' => __('2 Right Sidebars', 'themify')),
	    array('value' => 'sidebar2 content-right', 'img' => 'images/layout-icons/sidebar2-content-right.png', 'title' => __('2 Left Sidebars', 'themify')),
	    array('value' => 'sidebar-none', 'img' => 'images/layout-icons/sidebar-none.png', 'title' => __('No Sidebar', 'themify'))
	);

	/**
	 * Page sidebar placement
	 */
	if (is_array($custom_posts)) {
	    foreach ($custom_posts as $key => $cPost) {
			$output .= sprintf('<h4>%s %s</h4>', $cPost['name'], __('Post Type', 'themify'));

			if ($cPost['archive']) {

				$output .= '<p>' . sprintf('<span class="label">%s %s</span>', $cPost['name'], __('Archive Sidebar', 'themify'));
				$val = isset($data[$prefix . $key . '_archive']) ? $data[$prefix . $key . '_archive'] : '';

				foreach ($sidebar_location_options as $option) {
					if (( '' == $val || !$val || !isset($val) ) && ( isset($option['selected']) && $option['selected'] )) {
						$val = $option['value'];
					}
					if ($val == $option['value']) {
						$class = "selected";
					} else {
						$class = "";
					}
					$output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
				}

				$output .= '<input type="hidden" name="' . ($prefix . $key) . '_archive" class="val" value="' . $val . '" /></p>';
				$output .=
					'<p class="pushlabel" data-show-if-element="[name=' . ($prefix.$key) . '_archive]" 
						data-show-if-value=\'["sidebar1", "sidebar1 sidebar-left", "sidebar2" ,"sidebar2 content-left" ,"sidebar2 content-right"]\'>
						<label for="'.esc_attr($prefix.$key).'_archive_post_sticky_sidebar">
							<input type="checkbox" id="'.esc_attr($prefix.$key).'_archive_post_sticky_sidebar" name="'.esc_attr($prefix.$key).'_archive_post_sticky_sidebar" value="1"
							'.checked( themify_get( esc_attr($prefix.$key).'_archive_post_sticky_sidebar' ),1, false ) .'
							/>'.__('Enable sticky sidebar', 'themify').'
						</label>
					</p>';
				$content_width = isset( $data[ $prefix . $key . '_archive_content_width'] ) ? $data[ $prefix . $key . '_archive_content_width'] : 'default_width';
				$output .=
					'<p data-show-if-element="[name=' . ( $prefix . $key) . '_archive]" data-show-if-value=\'["sidebar-none"]\'>
						<span class="label">' . sprintf( __( '%s Archive Content Width', 'themify' ), $cPost['name'] ) . '</span>
						<a href="#" class="preview-icon' . ( $content_width === 'default_width' ? ' selected' : '' ) . '" title="' . __( 'Default Width', 'themify' ) . '"><img src="' . THEME_URI . '/themify/img/default.svg" alt="default_width"></a>
						<a href="#" class="preview-icon' . ( $content_width === 'full_width' ? ' selected' : '' ) . '" title="' . __( 'Fullwidth', 'themify' ) . '"><img src="' . THEME_URI . '/themify/img/fullwidth.svg" alt="full_width"></a>
						<input type="hidden" name="' . $prefix . $key . '_archive_content_width" value="' . esc_attr( $content_width ) . '" class="val">
					</p>';
			}

			$output .= '<p>' . sprintf('<span class="label">%s %s</span>', ucfirst($cPost['name']), __('Single Sidebar', 'themify'));
			$val = isset($data[$prefix . $key . '_single']) ? $data[$prefix . $key . '_single'] : '';

			foreach ($sidebar_location_options as $option) {
				if (!$val && !empty($option['selected'])) {
					$val = $option['value'];
				}
				if ($val == $option['value']) {
					$class = "selected";
				} else {
					$class = "";
				}
				$output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
			}
			$output .= '<input type="hidden" name="' . ($prefix . $key) . '_single" class="val" value="' . $val . '" /></p>';
			$output .=
				'<p class="pushlabel" data-show-if-element="[name=' . ($prefix.$key) . '_single]" 
						data-show-if-value=\'["sidebar1", "sidebar1 sidebar-left", "sidebar2" ,"sidebar2 content-left" ,"sidebar2 content-right"]\'>
						<label for="'.esc_attr($prefix.$key).'_single_post_sticky_sidebar">
							<input type="checkbox" id="'.esc_attr($prefix.$key).'_single_post_sticky_sidebar" name="'.esc_attr($prefix.$key).'_single_post_sticky_sidebar" value="1"
							'.checked( themify_get( esc_attr($prefix.$key).'_single_post_sticky_sidebar' ),1, false ) .'
							/>'.__('Enable sticky sidebar', 'themify').'
						</label>
				</p>';
			$content_width = isset( $data[ $prefix . $key . '_single_content_width'] ) ? $data[ $prefix . $key . '_single_content_width'] : 'default_width';
			$output .=
				'<p data-show-if-element="[name=' . ( $prefix . $key) . '_single]" data-show-if-value=\'["sidebar-none"]\'>
					<span class="label">' . __( 'Default Single Content Width', 'themify' ) . '</span>
					<a href="#" class="preview-icon' . ( $content_width === 'default_width' ? ' selected' : '' ) . '" title="' . __( 'Default Width', 'themify' ) . '"><img src="' . THEME_URI . '/themify/img/default.svg" alt="default_width"></a>
					<a href="#" class="preview-icon' . ( $content_width === 'full_width' ? ' selected' : '' ) . '" title="' . __( 'Fullwidth', 'themify' ) . '"><img src="' . THEME_URI . '/themify/img/fullwidth.svg" alt="full_width"></a>
					<input type="hidden" name="' . $prefix . $key . '_single_content_width" value="' . esc_attr( $content_width ) . '" class="val">
				</p>';
	    }
	}

	return $output;
    }

}

/**
 * Query Posts Options
 * @return array
 * @since 1.0.0
 */
function themify_theme_query_post_meta_box() {
    return array(
	// Notice
	array(
	    'name' => '_query_posts_notice',
	    'title' => '',
	    'description' => '',
	    'type' => 'separator',
	    'meta' => array(
		'html' => '<div class="themify-info-link">' . sprintf(__('<a href="%s">Query Posts</a> allows you to query WordPress posts from any category on the page. To use it, select a Query Category.', 'themify'), 'https://themify.me/docs/query-posts') . '</div>'
	    ),
	),
	// Query Category
	array(
	    'name' => 'query_category',
	    'title' => __('Query Category', 'themify'),
	    'description' => __('Select a category or enter multiple category IDs (eg. 2,5,6). Enter 0 to display all category.', 'themify'),
	    'type' => 'query_category',
	    'meta' => array()
	),
	// Query All Post Types
	array(
	    'name' => 'query_all_post_types',
	    'type' => 'dropdown',
	    'title' => __('Query All Post Types', 'themify'),
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		),
		array(
		    'value' => 'yes',
		    'name' => 'Yes',
		),
		array(
		    'value' => 'no',
		    'name' => 'No',
		),
	    )
	),
	// Descending or Ascending Order for Posts
	array(
	    'name' => 'order',
	    'title' => __('Order', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('name' => __('Descending', 'themify'), 'value' => 'desc', 'selected' => true),
		array('name' => __('Ascending', 'themify'), 'value' => 'asc')
	    ),
	    'default' => 'desc'
	),
	// Criteria to Order By
	array(
	    'name' => 'orderby',
	    'title' => __('Order By', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('name' => __('Date', 'themify'), 'value' => 'date', 'selected' => true),
		array('name' => __('Random', 'themify'), 'value' => 'rand'),
		array('name' => __('Author', 'themify'), 'value' => 'author'),
		array('name' => __('Post Title', 'themify'), 'value' => 'title'),
		array('name' => __('Comments Number', 'themify'), 'value' => 'comment_count'),
		array('name' => __('Modified Date', 'themify'), 'value' => 'modified'),
		array('name' => __('Post Slug', 'themify'), 'value' => 'name'),
		array('name' => __('Post ID', 'themify'), 'value' => 'ID'),
		array('name' => __('Custom Field String', 'themify'), 'value' => 'meta_value'),
		array('name' => __('Custom Field Numeric', 'themify'), 'value' => 'meta_value_num')
	    ),
	    'default' => 'date',
	    'hide' => 'date|rand|author|title|comment_count|modified|name|ID field-meta-key'
	),
	array(
	    'name' => 'meta_key',
	    'title' => __('Custom Field Key', 'themify'),
	    'description' => '',
	    'type' => 'textbox',
	    'meta' => array('size' => 'medium'),
	    'class' => 'field-meta-key'
	),
	// Post Layout
	array(
	    'name' => 'layout',
	    'title' => __('Query Post Layout', 'themify'),
	    'description' => '',
	    'type' => 'layout',
	    'show_title' => true,
	    'meta' => array(
		array(
		    'value' => 'list-post',
		    'img' => 'images/layout-icons/list-post.png',
		    'selected' => true
		),
		array(
		    'value' => 'grid2',
		    'img' => 'images/layout-icons/grid2.png',
		    'title' => __('Grid 2', 'themify')
		),
		array(
		    'value' => 'grid3',
		    'img' => 'images/layout-icons/grid3.png',
		    'title' => __('Grid 3', 'themify')
		),
		array(
		    'value' => 'grid4',
		    'img' => 'images/layout-icons/grid4.png',
		    'title' => __('Grid 4', 'themify')
		),
		array(
		    'value' => 'grid5',
		    'img' => 'images/layout-icons/grid5.png',
		    'title' => __('Grid 5', 'themify')
		),
		array(
		    'value' => 'grid6',
		    'img' => 'images/layout-icons/grid6.png',
		    'title' => __('Grid 6', 'themify')
		),
		array(
		    'value' => 'list-large-image',
		    'img' => 'images/layout-icons/list-large-image.png',
		    'title' => __('List Large Image', 'themify')
		),
		array(
		    'value' => 'list-thumb-image',
		    'img' => 'images/layout-icons/list-thumb-image.png',
		    'title' => __('List Thumb Image', 'themify')
		),
		array(
		    'value' => 'grid2-thumb',
		    'img' => 'images/layout-icons/grid2-thumb.png',
		    'title' => __('Grid 2 Thumb', 'themify')
		),
		array('value' => 'auto_tiles',
		    'img' => 'images/layout-icons/auto-tiles.png',
		    'title' => __('Tiles', 'themify')
		)
	    ),
	    'default' => 'list-post',
	),
	// Post Content Layout
	array(
	    'name' => 'post_content_layout',
	    'title' => __('Post Content Layout', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'overlay',
		    'name' => __('Overlay', 'themify'),
		),
		array(
		    'value' => 'polaroid',
		    'name' => __('Polaroid', 'themify'),
		),
		array(
		    'value' => 'boxed',
		    'name' => __('Boxed', 'themify'),
		),
		array(
		    'value' => 'flip',
		    'name' => __('Flip', 'themify'),
		)
	    )
	),
	// Masonry Layout
	array(
	    'name' => 'disable_masonry',
	    'title' => __('Masonry Layout', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'yes',
		    'name' => __('Enable', 'themify'),
		),
		array(
		    'value' => 'no',
		    'name' => __('Disable', 'themify'),
		)
	    )
	),
	// Post Gutter
	array(
	    'name' => 'post_gutter',
	    'title' => __('Post Gutter', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'no-gutter',
		    'name' => __('No gutter', 'themify'),
		)
	    )
	),
	// Infinite Scroll
	array(
	    'name' => 'more_posts',
	    'title' => __('Infinite Scroll', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'infinite',
		    'name' => __('Enable', 'themify'),
		),
		array(
		    'value' => 'pagination',
		    'name' => __('Disable', 'themify'),
		)
	    )
	),
	// Posts Per Page
	array(
	    'name' => 'posts_per_page',
	    'title' => __('Posts Per Page', 'themify'),
	    'description' => '',
	    'type' => 'textbox',
	    'meta' => array('size' => 'small')
	),
	// Display Content
	array(
	    'name' => 'display_content',
	    'title' => __('Display Content', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('name' => __('Full Content', 'themify'), 'value' => 'content'),
		array('name' => __('Excerpt', 'themify'), 'value' => 'excerpt', 'selected' => true),
		array('name' => __('None', 'themify'), 'value' => 'none')
	    ),
	    'default' => 'excerpt',
	),
	// Post filter 
	array(
	    'name' => 'post_filter',
	    'type' => 'dropdown',
	    'title' => __('Post Filter', 'themify'),
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		),
		array(
		    'value' => 'yes',
		    'name' => 'Yes',
		),
		array(
		    'value' => 'no',
		    'name' => 'No',
		),
	    )
	),
	// Featured Image Size
	array(
	    'name' => 'feature_size_page',
	    'title' => __('Image Size', 'themify'),
	    'description' => sprintf(__('Image sizes can be set at <a href="%s">Media Settings</a> and <a href="%s" target="_blank">Regenerated</a>', 'themify'), 'options-media.php', 'https://wordpress.org/plugins/regenerate-thumbnails/'),
	    'type' => 'featimgdropdown',
	    'display_callback' => 'themify_is_image_script_disabled'
	),
	// Multi field: Image Dimension
	themify_image_dimensions_field(),
	// Hide Title
	array(
	    'name' => 'hide_title',
	    'title' => __('Hide Post Title', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Unlink Post Title
	array(
	    'name' => 'unlink_title',
	    'title' => __('Unlink Post Title', 'themify'),
	    'description' => __('Unlink post title (it will display the post title without link)', 'themify'),
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Hide Post Date
	array(
	    'name' => 'hide_date',
	    'title' => __('Hide Post Date', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Hide Post Meta
	themify_multi_meta_field(),
	// Hide Post Image
	array(
	    'name' => 'hide_image',
	    'title' => __('Hide Featured Image', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Unlink Post Image
	array(
	    'name' => 'unlink_image',
	    'title' => __('Unlink Featured Image', 'themify'),
	    'description' => __('Display the Featured Image without link', 'themify'),
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Pagination Visibility
	array(
	    'name' => 'hide_navigation',
	    'title' => __('Hide Pagination', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
    );
}

/**
 * Portfolio Meta Box Options
 * @return array
 * @since 1.0.7
 */
function themify_theme_query_portfolio_meta_box() {
    return array(
	// Query Category
	array(
	    'name' => 'portfolio_query_category',
	    'title' => __('Portfolio Category', 'themify'),
	    'description' => __('Select a portfolio category or enter multiple portfolio category IDs (eg. 2,5,6). Enter 0 to display all portfolio categories.', 'themify'),
	    'type' => 'query_category',
	    'meta' => array('taxonomy' => 'portfolio-category')
	),
	// Descending or Ascending Order for Portfolios
	array(
	    'name' => 'portfolio_order',
	    'title' => __('Order', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('name' => __('Descending', 'themify'), 'value' => 'desc', 'selected' => true),
		array('name' => __('Ascending', 'themify'), 'value' => 'asc')
	    ),
	    'default' => 'desc',
	),
	// Criteria to Order By
	array(
	    'name' => 'portfolio_orderby',
	    'title' => __('Order By', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('name' => __('Date', 'themify'), 'value' => 'date', 'selected' => true),
		array('name' => __('Random', 'themify'), 'value' => 'rand'),
		array('name' => __('Author', 'themify'), 'value' => 'author'),
		array('name' => __('Post Title', 'themify'), 'value' => 'title'),
		array('name' => __('Comments Number', 'themify'), 'value' => 'comment_count'),
		array('name' => __('Modified Date', 'themify'), 'value' => 'modified'),
		array('name' => __('Post Slug', 'themify'), 'value' => 'name'),
		array('name' => __('Post ID', 'themify'), 'value' => 'ID'),
		array('name' => __('Custom Field String', 'themify'), 'value' => 'meta_value'),
		array('name' => __('Custom Field Numeric', 'themify'), 'value' => 'meta_value_num')
	    ),
	    'default' => 'date',
	    'hide' => 'date|rand|author|title|comment_count|modified|name|ID field-portfolio-meta-key'
	),
	array(
	    'name' => 'portfolio_meta_key',
	    'title' => __('Custom Field Key', 'themify'),
	    'description' => '',
	    'type' => 'textbox',
	    'meta' => array('size' => 'medium'),
	    'class' => 'field-portfolio-meta-key'
	),
	// Post Layout
	array(
	    'name' => 'portfolio_layout',
	    'title' => __('Portfolio Layout', 'themify'),
	    'description' => '',
	    'type' => 'layout',
	    'show_title' => true,
	    'meta' => array(
		array(
		    'value' => 'list-post',
		    'img' => 'images/layout-icons/list-post.png',
		    'selected' => true
		),
		array(
		    'value' => 'grid2',
		    'img' => 'images/layout-icons/grid2.png',
		    'title' => __('Grid 2', 'themify')
		),
		array(
		    'value' => 'grid3',
		    'img' => 'images/layout-icons/grid3.png',
		    'title' => __('Grid 3', 'themify')
		),
		array(
		    'value' => 'grid4',
		    'img' => 'images/layout-icons/grid4.png',
		    'title' => __('Grid 4', 'themify')
		),
		array(
		    'value' => 'grid5',
		    'img' => 'images/layout-icons/grid5.png',
		    'title' => __('Grid 5', 'themify')
		),
		array(
		    'value' => 'grid6',
		    'img' => 'images/layout-icons/grid6.png',
		    'title' => __('Grid 6', 'themify')
		),
		array(
		    'value' => 'slider',
		    'img' => 'images/layout-icons/slider-default.png',
		    'title' => __('Slider', 'themify')
		),
		array('value' => 'auto_tiles',
		    'img' => 'images/layout-icons/auto-tiles.png',
		    'title' => __('Tiles', 'themify')
		)
	    ),
	    'default' => 'list-post',
	),
	// Post Content Layout
	array(
	    'name' => 'portfolio_content_layout',
	    'title' => __('Post Content Layout', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'overlay',
		    'name' => __('Overlay', 'themify'),
		),
		array(
		    'value' => 'polaroid',
		    'name' => __('Polaroid', 'themify'),
		),
		array(
		    'value' => 'boxed',
		    'name' => __('Boxed', 'themify'),
		),
		array(
		    'value' => 'flip',
		    'name' => __('Flip', 'themify'),
		),
	    )
	),
	// Masonry Layout
	array(
	    'name' => 'portfolio_disable_masonry',
	    'title' => __('Masonry Layout', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'yes',
		    'name' => __('Enable', 'themify'),
		),
		array(
		    'value' => 'no',
		    'name' => __('Disable', 'themify'),
		)
	    )
	),
	// Post Gutter
	array(
	    'name' => 'portfolio_post_gutter',
	    'title' => __('Post Gutter', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'no-gutter',
		    'name' => __('No gutter', 'themify'),
		)
	    )
	),
	// Infinite Scroll
	array(
	    'name' => 'portfolio_more_posts',
	    'title' => __('Infinite Scroll', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		    'selected' => true,
		),
		array(
		    'value' => 'infinite',
		    'name' => __('Enable', 'themify'),
		),
		array(
		    'value' => 'pagination',
		    'name' => __('Disable', 'themify'),
		)
	    )
	),
	// Posts Per Page
	array(
	    'name' => 'portfolio_posts_per_page',
	    'title' => __('Portfolios Per Page', 'themify'),
	    'description' => '',
	    'type' => 'textbox',
	    'meta' => array('size' => 'small')
	),
	// Display Content
	array(
	    'name' => 'portfolio_display_content',
	    'title' => __('Display Content', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('name' => __('Full Content', 'themify'), 'value' => 'content'),
		array('name' => __('Excerpt', 'themify'), 'value' => 'excerpt', 'selected' => true),
		array('name' => __('None', 'themify'), 'value' => 'none')
	    ),
	    'default' => 'excerpt',
	),
	// Post filter 
	array(
	    'name' => 'portfolio_post_filter',
	    'type' => 'dropdown',
	    'title' => __('Post Filter', 'themify'),
	    'meta' => array(
		array(
		    'value' => '',
		    'name' => '',
		),
		array(
		    'value' => 'yes',
		    'name' => 'Yes',
		),
		array(
		    'value' => 'no',
		    'name' => 'No',
		),
	    )
	),
	// Featured Image Size
	array(
	    'name' => 'portfolio_feature_size_page',
	    'title' => __('Image Size', 'themify'),
	    'description' => __('Image sizes can be set at <a href="options-media.php">Media Settings</a> and <a href="https://wordpress.org/plugins/regenerate-thumbnails/" target="_blank">Regenerated</a>', 'themify'),
	    'type' => 'featimgdropdown',
	    'display_callback' => 'themify_is_image_script_disabled'
	),
	// Multi field: Image Dimension
	array(
	    'type' => 'multi',
	    'name' => '_portfolio_image_dimensions',
	    'title' => __('Image Dimensions', 'themify'),
	    'meta' => array(
		'fields' => array(
		    // Image Width
		    array(
			'name' => 'portfolio_image_width',
			'label' => __('width', 'themify'),
			'description' => '',
			'type' => 'textbox',
			'meta' => array('size' => 'small')
		    ),
		    // Image Height
		    array(
			'name' => 'portfolio_image_height',
			'label' => __('height', 'themify'),
			'description' => '',
			'type' => 'textbox',
			'meta' => array('size' => 'small')
		    ),
		),
		'description' => __('Enter height = 0 to disable vertical cropping with img.php enabled', 'themify'),
		'before' => '',
		'after' => '',
		'separator' => ''
	    )
	),
	// Hide Title
	array(
	    'name' => 'portfolio_hide_title',
	    'title' => __('Hide Portfolio Title', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Unlink Post Title
	array(
	    'name' => 'portfolio_unlink_title',
	    'title' => __('Unlink Portfolio Title', 'themify'),
	    'description' => __('Unlink portfolio title (it will display the post title without link)', 'themify'),
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	array(
	    'name' => 'hide_portfolio_date',
	    'title' => __('Hide Portfolio Date', 'themify'),
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Hide Post Meta
	array(
	    'name' => 'portfolio_hide_meta_all',
	    'title' => __('Hide Portfolio Meta', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Hide Post Image
	array(
	    'name' => 'portfolio_hide_image',
	    'title' => __('Hide Featured Image', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Unlink Post Image
	array(
	    'name' => 'portfolio_unlink_image',
	    'title' => __('Unlink Featured Image', 'themify'),
	    'description' => __('Display the Featured Image Without Link', 'themify'),
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	),
	// Pagination Visibility
	array(
	    'name' => 'portfolio_hide_navigation',
	    'title' => __('Hide Pagination', 'themify'),
	    'description' => '',
	    'type' => 'dropdown',
	    'meta' => array(
		array('value' => 'default', 'name' => '', 'selected' => true),
		array('value' => 'yes', 'name' => __('Yes', 'themify')),
		array('value' => 'no', 'name' => __('No', 'themify'))
	    ),
	    'default' => 'default',
	)
    );
}

/**
 * Returns false if the current page being edited is the WC designated Shop page
 *
 * @return bool
 */
function themify_wc_shop_admin_check() {
    return !(themify_is_woocommerce_active() && wc_get_page_id('shop') == get_the_id());
}

/**
 * Options get metabox
 * @since 1.0.0
 * @var array
 */
if (!function_exists('themify_theme_get_page_metaboxes')) {

    function themify_theme_get_page_metaboxes(array $args, &$meta_boxes) {
	$theme_metaboxes = array(
	    array(
		'name' => __('Page Options', 'themify'),
		'id' => 'page-options',
		'options' => themify_theme_page_meta_box(),
		'pages' => 'page'
	    ),
	    array(
		'name' => __('Query Posts', 'themify'),
		'id' => 'query-posts',
		'options' => themify_theme_query_post_meta_box(),
		'pages' => 'page',
		'display_callback' => 'themify_wc_shop_admin_check',
	    ),
	);
	if (post_type_exists('portfolio')) {
	    $theme_metaboxes[] = array(
		'name' => __('Query Portfolios', 'themify'),
		'id' => 'query-portfolio',
		'options' => themify_theme_query_portfolio_meta_box(),
		'pages' => 'page'
	    );
	}
	return $theme_metaboxes;
    }

}
