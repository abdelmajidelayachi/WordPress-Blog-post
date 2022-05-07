<?php
if(isset($PostID) && isset($_POST['counterbox_setting_save_action'])) {
	 		if (!wp_verify_nonce($_POST['wpsm_counter_security'], 'wpsm_counter_nonce_save_settings_values')) {
				die();
			}
			$icon_clr        	  	 = sanitize_text_field($_POST['icon_clr']);
			$count_title_clr         = sanitize_text_field($_POST['count_title_clr']);
			$count_num_clr        	 = sanitize_text_field($_POST['count_num_clr']);	
			$icon_size        	 	 = sanitize_text_field($_POST['icon_size']);
			$count_num_size        	 = sanitize_text_field($_POST['count_num_size']);
			$title_size        	 	 = sanitize_text_field($_POST['title_size']);
			$cn_weight        	 	 = sanitize_text_field($_POST['cn_weight']);
			$font_family         	 = sanitize_text_field($_POST['font_family']);
			$display_icon            = apply_filters( "sanitize_option_display_icon", $_POST['display_icon'], 'display_icon', 'yes' );
			//$display_icon        	 = $_POST['display_icon'];
			$cn_layout         		 = sanitize_text_field($_POST['cn_layout']);
			$custom_css         	 = sanitize_textarea_field($_POST['custom_css']);
			
			$Settings_MyArray = serialize( array(
			
			//BOX COLOR SETTINGS
			
				 
				'icon_clr' 		       => $icon_clr,
				'count_title_clr' 	   => $count_title_clr,
				'count_num_clr' 	   => $count_num_clr,
				'icon_size' 		   => $icon_size,
				'count_num_size' 	   => $count_num_size,
				'title_size' 		   => $title_size,
				'cn_weight' 		   => $cn_weight,
				'font_family' 		   => $font_family,
				'display_icon' 		   => $display_icon,
				'cn_layout' 		   => $cn_layout,
				'custom_css' 		   => $custom_css,
				
			));
			update_post_meta($PostID, 'Counter_Meta_Settings', $Settings_MyArray);				
}
?>