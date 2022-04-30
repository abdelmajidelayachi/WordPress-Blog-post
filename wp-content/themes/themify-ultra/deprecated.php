<?php
class Themify_Background_Gallery{
	function create_controller(){}
}
global $themify_bg_gallery;
$themify_bg_gallery=new Themify_Background_Gallery();
function themify_theme_page_title($args = array()){}
function themify_theme_single_wrapper_classes(){return '';}
function themify_get_images_from_gallery_shortcode($shortcode=''){
    return themify_get_gallery_shortcode($shortcode);
}
function themify_get_gallery_param_option($shortcode='',$param=''){
    return themify_get_gallery_shortcode_params($shortcode,$param);
}
function themify_theme_entry_title_tag(){
    return themify_post_title_tag();
}