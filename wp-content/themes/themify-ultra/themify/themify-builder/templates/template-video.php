<?php

defined( 'ABSPATH' ) || exit;

/**
 * Template Video
 * 
 * This template can be overridden by copying it to yourtheme/themify-builder/template-video.php.
 *
 * Access original fields: $args['mod_settings']
 * @author Themify
 */

$fields_default = array(
    'mod_title_video' => '',
    'style_video' => '',
    'url_video' => '',
    'ext_start' => '',
    'ext_end' => '',
    'ext_hide_ctrls' => 'no',
    'ext_privacy' => '',
    'ext_branding' => '',
    'dl_btn' => '',
    'autoplay_video' => '',
    'mute_video' => 'no',
    'width_video' => '',
    'unit_video' => 'px',
    'title_tag' => 'h3',
    'title_video' => '',
    'title_link_video' => false,
    'caption_video' => '',
    'css_video' => '',
    'animation_effect' => '',
    'o_i_c'=>'',
    'o_i'=>'',
    'o_w'=>'',
    'o_h' => '',
);

$fields_args = wp_parse_args($args['mod_settings'], $fields_default);
unset($args['mod_settings']);
$fields_default=null;
$mod_name=$args['mod_name'];
$builder_id = $args['builder_id'];
$element_id = $args['module_ID'];

if($fields_args['o_i_c']!==''){
    $fields_args['o_i_c'] = self::get_checkbox_data($fields_args['o_i_c']);
}
$video_maxwidth = $fields_args['width_video'] !== '' ? $fields_args['width_video'] . $fields_args['unit_video'] : '';
$video_autoplay_css = $fields_args['autoplay_video'] === 'yes' ? 'video-autoplay' : '';
if($fields_args['style_video']==='video-overlay'){
    Themify_Builder_Model::load_module_self_style($mod_name,'overlay');
}
$container_class = apply_filters('themify_builder_module_classes', array(
    'module',
    'module-' . $mod_name,
    $element_id, 
    $fields_args['style_video'], 
    $fields_args['css_video'], 
    $video_autoplay_css
), $mod_name, $element_id, $fields_args);

if(!empty($fields_args['global_styles']) && Themify_Builder::$frontedit_active===false){
    $container_class[] = $fields_args['global_styles'];
}
$container_props = apply_filters('themify_builder_module_container_props', self::parse_animation_effect($fields_args,array(
    'class' => implode(' ', $container_class),
	)), $fields_args, $mod_name, $element_id);
$args=null;
if(Themify_Builder::$frontedit_active===false){
    $container_props['data-lazy']=1;
}

$url = esc_url( $fields_args['url_video'] );
if ( ! empty( $url ) ) {
	$video_url = parse_url($fields_args['url_video']);
	$isLocal = isset($video_url['host']) && $video_url['host'] !== 'www.youtube.com'
		&& $video_url['host'] !== 'youtube.com'
		&& $video_url['host'] !== 'youtu.be'
		&& $video_url['host'] !== 'www.vimeo.com'
		&& $video_url['host'] !== 'vimeo.com'
		&& $video_url['host'] !== 'player.vimeo.com';
	if($isLocal===false){
		if($fields_args['autoplay_video'] === 'yes'){
			$container_props['data-auto']=true;
			$fields_args['mute_video']='yes';
		}
		if($fields_args['ext_hide_ctrls'] === 'yes'){
			$container_props['data-hide-controls']=true;
		}
		if(!empty($fields_args['ext_start'])){
			$container_props['data-start']=$fields_args['ext_start'];
		}
		if(!empty($fields_args['ext_end'])){
			$container_props['data-end']=$fields_args['ext_end'];
		}
		if(!empty($fields_args['ext_privacy'])){
			$container_props['data-privacy']=true;
		}
		if($fields_args['ext_branding']==='yes'){
			$container_props['data-branding']=true;
		}
    }
	if($fields_args['mute_video'] === 'yes'){
		$container_props['data-muted']=true;
	}
	if ( $isLocal === false || ! ( $fields_args['o_i_c'] !== '1' || $fields_args['o_i'] === '' ) ) {
		$container_props['data-url']=$url;
		if($isLocal===true){
            themify_get_icon('fas volume-mute','fa');
            themify_get_icon('fas volume-up','fa');
            themify_get_icon('fas undo-alt','fa');
            themify_get_icon('fas redo-alt','fa');
            themify_get_icon('fas external-link-alt','fa');
            themify_get_icon('fas airplay','fa');
            themify_get_icon('far closed-captioning','fa');
            themify_get_icon('fas expand','fa');
	}
}
}
?>
<!-- module video -->
<div <?php echo self::get_element_attributes(self::sticky_element_props($container_props,$fields_args)); ?>>
    <?php
	$container_props=$container_class=null;
	if ( !empty( $url ) ):?>
		<?php 
			echo Themify_Builder_Component_Module::get_module_title($fields_args,'mod_title_video');
		?>
		<div class="video-wrap-outer"<?php echo '' !== $video_maxwidth ? ' style="max-width:' . $video_maxwidth . ';"' : ''; ?>>
			<div class="video-wrap tf_rel tf_overflow<?php echo $isLocal===true?' tf_local_video':''; ?>">
				<?php
				if($fields_args['o_i_c']!=='1' || $fields_args['o_i']===''){
					if($isLocal===true){
						$video=wp_video_shortcode(array('src'=>$url,'preload'=>'none','autoplay'=>$fields_args['autoplay_video'] === 'yes'));
						$r='playsinline webkit-playsinline';
						if ($fields_args['mute_video'] === 'yes') {
							$r.=' muted';
						}
                        if(!empty($fields_args['dl_btn'])){
                            themify_get_icon('fas download','fa');
                            $r.=' data-download';
                        }
						echo str_replace(' preload=', $r.' preload=', $video);
						$r=null;
					}
				}
				else{
					$image_attr=Themify_Builder::$frontedit_active===false?array():array('data-w'=>'o_w', 'data-h'=>'o_h','data-name'=>'o_i');
					?>
					<div class="tb_video_overlay tf_rel">
						<div class="tb_video_play tf_textc"></div>
						<?php echo themify_get_image(array('src'=>$fields_args['o_i'],'w' => $fields_args['o_w'],'alt'=>$fields_args['title_video'], 'h' => $fields_args['o_h'],'attr'=>$image_attr))?>
					</div>
					<?php
					unset($image_attr);
				}
				?>
			</div>
			<!-- /video-wrap -->
		</div>
		<!-- /video-wrap-outer -->
		<?php if ('' !== $fields_args['title_video'] || '' !== $fields_args['caption_video']): ?>
			<div class="video-content">
				<?php if ('' !== $fields_args['title_video']): ?>
					<<?php echo $fields_args['title_tag'];?> class="video-title"<?php self::add_inline_edit_fields('title_video',!$fields_args['title_link_video'])?>>
						<?php if ($fields_args['title_link_video']) : ?>
							<a href="<?php echo esc_url($fields_args['title_link_video']); ?>"<?php self::add_inline_edit_fields('title_video')?>><?php echo $fields_args['title_video']; ?></a>
						<?php else: ?>
							<?php echo $fields_args['title_video']; ?>
						<?php endif; ?>
					</<?php echo $fields_args['title_tag'];?>>
				<?php endif; ?>

				<?php if ('' !== $fields_args['caption_video']): ?>
					<div class="video-caption tb_text_wrap"<?php self::add_inline_edit_fields('caption_video')?>>
						<?php echo apply_filters('themify_builder_module_content', $fields_args['caption_video']); ?>
					</div>
					<!-- /video-caption -->
				<?php endif; ?>
			</div>
			<!-- /video-content -->
		<?php endif; ?>
	<?php endif;?>
</div>
