<?php
if(isset($PostID) && isset($_POST['counterbox_save_data_action']) ) {
if (!wp_verify_nonce($_POST['wpsm_counter_security'], 'wpsm_counter_nonce_save_settings_values')) {
	die();
}	
$My_Array=array();
$box_count= count($_POST['counter_title']);
if($box_count){
	for($i=0; $i < $box_count; $i++){

					$counter_icon   	    = sanitize_text_field($_POST['counter_icon'][$i]);
					$counter_value  		= sanitize_text_field($_POST['counter_value'][$i]);
					$counter_title          = sanitize_text_field($_POST['counter_title'][$i]);
					
					$My_Array[] = array(
						'counter_icon'            => $counter_icon,
						'counter_value'           => $counter_value,
						'counter_title'           => $counter_title,
						);
			}
				update_post_meta($PostID, 'manisha_demo_data',serialize($My_Array));
				update_post_meta($PostID, 'manisha_demo_count',$box_count );
		}
}		
 ?>