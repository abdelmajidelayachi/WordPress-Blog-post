<?php

/**
 * Product Meta Box Options
 * @since 1.0.0
 * @var array
 */
if (!function_exists('themify_theme_get_product_metaboxes')) {
	/**
	 * @deprecated
	 * kept for backwards compatibility
	 */
    function themify_theme_get_product_metaboxes(array $args, &$meta_boxes) {
		return array();
    }
}

/**
 * Creates module for ajax cart style
 * @param array
 * @return string
 */
function themify_ajax_cart_style($data = array()) {

	$key = 'setting-cart_show_seconds';
	$output = '<p><span class="label">' . __('Show cart', 'themify') . '</span>
					<select name="' . $key . '">' .
	           themify_options_module(array(
		           array('name' => __('Off','themify'), 'value' => 'off'),
		           array('name' => 1, 'value' => 1000),
		           array('name' => 2, 'value' => 2000),
		           array('name' => 3, 'value' => 3000),
		           array('name' => 4, 'value' => 4000),
		           array('name' => 5, 'value' => 5000)
	           ), $key) . '
					</select> ' . esc_html__('seconds', 'themify') . '<br>
					<small class="pushlabel">' . esc_html__('When an item is added, show cart for n second(s)', 'themify') . '</small>
				</p>';
    /**
     * Disable AJAX add to cart
     * @var String
     */
    $output .= '<p>
				<label for="setting-single_ajax_cart" class="pushlabel"><input type="checkbox" id="setting-single_ajax_cart" name="setting-single_ajax_cart" ' . checked(themify_get('setting-single_ajax_cart',null,true), 'on', false) . ' /> ' . __('Disable AJAX cart on single product page', 'themify') . '</label></p>';

	return $output;
}
