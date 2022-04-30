<?php

defined( 'ABSPATH' ) || exit;

class Themify_Builder_Component_Row extends Themify_Builder_Component_Base {
	
    public static $isFirstRow=false;

    public function get_name() {
	return 'row';
    }

    public function get_settings() {

	return apply_filters('themify_builder_row_fields_options', array(
	    // Row Width
	    array(
		'id' => 'row_width',
		'label' => __('Row Width', 'themify'),
		'type' => 'layout',
		'mode' => 'sprite',
		'options' => array(
		    array('img' => 'row_default', 'value' => '', 'label' => __('Default', 'themify')),
		    array('img' => 'row_fullwidth', 'value' => 'fullwidth', 'label' => __('Boxed', 'themify')),
		    array('img' => 'row_fullwidth_content', 'value' => 'fullwidth-content', 'label' => __('Fullwidth', 'themify'))
		)
	    ),
	    // Row Height
	    array(
		'id' => 'row_height',
		'label' => __('Row Height', 'themify'),
		'type' => 'layout',
		'mode' => 'sprite',
		'options' => array(
		    array('img' => 'row_default', 'value' => '', 'label' => __('Default', 'themify')),
		    array('img' => 'row_fullheight', 'value' => 'fullheight', 'label' => __('Full Height', 'themify'))
		),

	    ),
	    array(
		'id' => 'custom_css_row',
		'type' => 'custom_css'
	    ),
	    array(
		'id' => 'row_anchor',
		'type' => 'row_anchor',
		'label' => __('Row Anchor', 'themify'),
		'class' => 'large',
		'help'	=> __('Example: enter ‘about’ as row anchor and add ‘#about’ link in menu link. When the link is clicked, it will scroll to this row(<a href="https://themify.me/docs/builder#scrollto-row-anchor"  target="_blank">learn more</a>).', 'themify')
	    ),
		array(
			'id' => 'hide_anchor',
			'type' => 'checkbox',
			'label' => '',
			'options' => array(
				array( 'name' => '1', 'value' => __( 'Hide anchor on URL', 'themify' ) )
			),
		),
	    array('type' => 'custom_css_id'),
		array( 'type' => 'tooltip' ),
		$this->get_clickable_component_settings(),
	));
    }

    public function get_form_settings( $onlyStyle = false ) {
		$heading = array();
		for ( $i = 1; $i <= 6; ++$i ) {
			$h = 'h' . $i;
			$selector = $h;
			if ( $i === 3 ) {
				$selector .= ':not(.module-title)';
			}
			$heading = array_merge( $heading, array(
				self::get_expand($h.'_f', array(
					self::get_tab( array(
						'n' => array(
							'options' => array(
								self::get_font_family( ' ' . $selector, 'font_family_' . $h ),
								self::get_color_type( ' ' . $selector, '', 'font_color_type_' . $h, 'font_color_' . $h, 'font_gradient_color_' . $h ),
								self::get_font_size( ' ' . $h, 'font_size_' . $h ),
								self::get_line_height( ' ' . $h, 'line_height_' . $h ),
								self::get_letter_spacing( ' ' . $h, 'letter_spacing_' . $h ),
								self::get_text_transform( ' ' . $h, 'text_transform_' . $h ),
								self::get_font_style( ' ' . $h, 'font_style_' . $h, 'font_weight_' . $h ),
								self::get_text_shadow( ' ' . $selector, 't_sh' . $h ),
								// Heading  Margin
								self::get_heading_margin_multi_field( ' ', $h, 'top' ),
								self::get_heading_margin_multi_field( ' ', $h, 'bottom' )
							)
						),
						'h' => array(
							'options' => array(
								self::get_font_family( ' ' . $selector, 'f_f_' . $h . '_h' ),
								self::get_color_type( ' ' . $selector, '', 'f_c_t_' . $h . '_h', 'f_c_' . $h . '_h', 'f_g_c_' . $h . '_h' ),
								self::get_font_size( ' ' . $h, 'f_s_' . $h, '', 'h' ),
								self::get_line_height( ' ' . $h, 'l_h_' . $h, 'h' ),
								self::get_letter_spacing( ' ' . $h, 'l_s_' . $h, 'h' ),
								self::get_text_transform( ' ' . $h, 't_t_' . $h, 'h' ),
								self::get_font_style( ' ' . $h, 'f_st_' . $h, 'f_w_' . $h, 'h' ),
								self::get_text_shadow( ' ' . $selector, 't_sh' . $h, 'h' ),
								// Heading  Margin
								self::get_heading_margin_multi_field( ' ', $h, 'top', 'h' ),
								self::get_heading_margin_multi_field( ' ', $h, 'bottom', 'h' )
							)
						)
					) )
				) )
			) );
		}
		$styles = array(
			'type' => 'tabs',
			'options' => array(
				'g' => array('options' => $this->get_styling()),
				'head' => array('options' => $heading)
			)
		);
	if ( $onlyStyle === true ) {
	    return $styles;
	}
	$row_form_settings = array(
	    'setting' => array(
		'name' => __( 'Row Options', 'themify' ),
		'options' => $this->get_settings()
	    ),
	    'styling' => array(
		'options' => $styles
	    )
	);
	return apply_filters( 'themify_builder_row_lightbox_form_settings', $row_form_settings );
    }

    /**
     * Get template row
     *
     * @param array  $rows
     * @param array  $row
     * @param string $builder_id
     * @param bool   $echo
     *
     * @return string
     */
    public static function template($rows, $row, $builder_id, $echo = false) {
		$row = apply_filters( 'tf_builder_row', $row, $builder_id );
        // prevent empty rows from being rendered
	global $ThemifyBuilder;
	if(Themify_Builder::$frontedit_active===false || $ThemifyBuilder->in_the_loop===true){
	    $count =isset($row['cols']) ? count($row['cols']) : 0;
	    if (($count === 0 && !isset($row['styling']) ) || ($count === 1 && empty($row['cols'][0]['modules']) && empty($row['cols'][0]['styling']) && empty($row['styling']) ) // there's only one column and it's empty
	    ) {
		return '';
	    }
	    /* allow addons to control the display of the rows */
	    $display = apply_filters('themify_builder_row_display', true, $row, $builder_id);
	    if (false === $display || (isset($row['styling']['visibility_all']) && $row['styling']['visibility_all'] === 'hide_all' )) {
		return false;
	    }
            if($count>6){//need if user will downgrade fv from v7 to v5
                
                if(!isset($row['cols'][5]['modules'])){
                    $row['cols'][5]['modules']=array();
                }
                for($i=$count-1;$i>6;--$i){//move modules to the last column
                    if(!empty($row['cols'][$i]['modules'])){
                        foreach($row['cols'][$i]['modules'] as $v){
                            $row['cols'][5]['modules'][]=$v;
                        }
                    }
                }
                
                $count=6;
                for($i=0;$i<$count;++$i){
                    $row['cols'][$i]['grid_class']='col6-1';
                }
                array_splice($row['cols'],$count);
            }
	}
	else{
	    $count=0;
	}
	$row['row_order'] = isset($row['row_order']) ? $row['row_order'] : '';
	$row_classes = array('module_row themify_builder_row');
	$row_attributes = array();
	$is_styling = !empty($row['styling']);
	$video_data = '';
	if ($is_styling===true) {
	    // @backward-compatibility
	    if (!isset($row['styling']['background_type']) && !empty($row['styling']['background_video'])) {
			$row['styling']['background_type'] = 'video';
		} elseif ( ( empty($row['styling']['background_type']) || (isset($row['styling']['background_type']) && $row['styling']['background_type'] === 'image' )) && isset($row['styling']['background_zoom']) && $row['styling']['background_zoom'] === 'zoom' && $row['styling']['background_repeat'] === 'repeat-none') {
			$row_classes[] = 'themify-bg-zoom';
	    }
	    $class_fields = array('custom_css_row', 'background_repeat',  'row_height');
	    foreach ($class_fields as $field) {
			if (!empty($row['styling'][$field])) {
				$row_classes[] = $row['styling'][$field];
			}
	    }
		if(in_array('builder-parallax-scrolling',$row_classes,true)){
			Themify_Enqueue_Assets::addPrefetchJs(THEMIFY_BUILDER_JS_MODULES.'parallax.js',THEMIFY_VERSION);
		}
	    $class_fields=null;
	    /**
	     * Row Width class
	     * To provide backward compatibility, the CSS classname and the option label do not match. See #5284
	     */
	    if (isset($row['styling']['row_width'])) {
			if ('fullwidth' === $row['styling']['row_width']) {
				$row_classes[] = 'fullwidth_row_container';
			} elseif ('fullwidth-content' === $row['styling']['row_width']) {
				$row_classes[] = 'fullwidth';
			}
			$breakpoints = themify_get_breakpoints(null, true);
			$breakpoints['desktop'] = 1;
			$prop = 'fullwidth' === $row['styling']['row_width'] ? 'padding' : 'margin';
			foreach ($breakpoints as $k => $v) {
				$styles = $k === 'desktop' ? $row['styling'] : (!empty($row['styling']['breakpoint_' . $k]) ? $row['styling']['breakpoint_' . $k] : false);
				if ($styles) {
					$val = self::getDataValue($styles, $prop);
					if ($val) {
						$row_attributes['data-' . $k . '-' . $prop] = $val;
					}
				}
			}
			$breakpoints=null;
	    }
	    // background video
	    $video_data = self::get_video_background($row['styling']);
		if($video_data!==''){
			$video_data=' '.$video_data;
		}
	    // Class for Scroll Highlight
	    if (!empty($row['styling']['row_anchor']) && $row['styling']['row_anchor']!=='#') {
			$row_classes[] = 'tb_has_section';
			$row_classes[] = 'tb_section-' . $row['styling']['row_anchor'];
			$row_attributes['data-anchor'] = $row['styling']['row_anchor'];
	    }
		// Disable change hashtag in URL
		if (!empty($row['styling']['hide_anchor'])) {
			$row_attributes['data-hide-anchor'] = $row['styling']['hide_anchor'];
		}
		if(!empty( $row['styling']['global_styles'] ) ){
		    $row_classes = Themify_Global_Styles::add_class_to_components( $row_classes, $row['styling'],$builder_id);
		}
	}
	else{
	    $row['styling']=array();
	}
	if (!$echo) {
	    $output = PHP_EOL; // add line break
	    ob_start();
	}
	if (Themify_Builder::$frontedit_active===false) {
	    $row_content_classes = array();
	    $gutter=!empty($row['gutter'])?$row['gutter']:'';
            $column_h=!empty($row['column_h']);
            $column_alignment=!empty($row['column_alignment']) ? $row['column_alignment']:'';
            
            if($column_alignment==='' && isset($row['sizes']['desktop_align'])){//need if user will downgrade fv from v7 to v5
                $column_alignment=$row['sizes']['desktop_align'];
                if($column_alignment==='center'){
                    $column_alignment='col_align_middle';
                }
                else{
                    $column_alignment=$column_alignment==='end'?'col_align_bottom':'';
                }
            }
            if($column_alignment===''){
                $column_alignment= (function_exists('themify_theme_is_fullpage_scroll') && themify_theme_is_fullpage_scroll() ? 'col_align_middle' : 'col_align_top');
            }
            $row_content_classes[] =$column_alignment;
            if($gutter==='' && isset($row['sizes']['desktop_gutter'])){//need if user will downgrade fv from v7 to v5
                $gutter=$row['sizes']['desktop_gutter'];
                $gutter=($gutter==='narrow' || $gutter==='none')?('gutter-'.$gutter):'';
            }
            if ($gutter!=='' && $gutter !== 'gutter-default') {
		$row_content_classes[] = $gutter;
	    }
            if($column_h===false && !empty($row['sizes']['desktop_auto_h'])){//need if user will downgrade fv from v7 to v5
                $column_h=true;
            }
	    if ($column_h===true) {
		$row_content_classes[] = 'col_auto_height';
	    }
	    if ($count > 0) {
                $row_content_classes[] = 'col-count-'.$count;
		$row_content_attr = self::get_directions_data($row, $count);
		$order_classes = self::get_order($count);
		$is_phone = themify_is_touch('phone');
		$is_tablet = $is_phone===false && themify_is_touch('tablet');
		$is_right = false;
		if ($is_tablet===true) {
		    $is_right = isset($row_content_attr['data-tablet_dir']) || isset($row_content_attr['data-tablet_landscape_dir']);
		    if (isset($row_content_attr['data-col_tablet']) || isset($row_content_attr['data-col_tablet_landscape'])) {
			$row_content_classes[] = isset($row_content_attr['data-col_tablet_landscape']) ? $row_content_attr['data-col_tablet_landscape'] : $row_content_attr['data-col_tablet'];
		    }
		} elseif ($is_phone===true) {
		    $is_right = isset($row_content_attr['data-mobile_dir']);
		    if (isset($row_content_attr['data-col_mobile'])) {
			$row_content_classes[] = $row_content_attr['data-col_mobile'];
		    }
		} else {
		    $is_right = isset($row_content_attr['data-desktop_dir']);
		}
		if ($is_right===true) {
		    $row_content_classes[] = 'direction-rtl';
		    $order_classes = array_reverse($order_classes);
		}
	    }
	    $row_content_classes = implode(' ', $row_content_classes);
	    if (isset($row['element_id'])) {
			if(isset($row['styling']['row_width']) && ('fullwidth'===$row['styling']['row_width'] || 'fullwidth-content' === $row['styling']['row_width'])){
				$row_attributes['data-css_id']=$row['element_id'];
			}
			$row_classes[] = 'tb_'.$row['element_id'];
	    }	
	    if($is_styling===true){
			$row_attributes = self::sticky_element_props($row_attributes,$row['styling']);
	    }
            $row_attributes['data-lazy']=1;
            if(self::$isFirstRow===false){
                self::$isFirstRow=true;
                $row_classes[]='tb_first';//need for lazy loadd, load first row bg image
            }
            else{
                self::$isFirstRow=null;
            }
	}
	do_action('themify_builder_row_start', $builder_id, $row, $row['row_order']);
	$row_classes[]='tf_clearfix';
	$row_attributes['class'] = implode(' ', apply_filters('themify_builder_row_classes', $row_classes, $row, $builder_id));
	$row_classes=null;
	$row_attributes = self::clickable_component( $row['styling'], $row_attributes );
	$row_attributes = apply_filters('themify_builder_row_attributes', self::parse_animation_effect($row['styling'],$row_attributes), $row['styling'], $builder_id);

	echo (strpos($row_attributes['class'], 'tb-page-break') !== false) ? '<!-- tb_page_break -->' : '';
	?>
	<!-- module_row -->
	<div <?php echo self::get_element_attributes($row_attributes),$video_data; ?>>
	    <?php
	    $row_attributes=$video_data=null;
	    if ($is_styling===true) {
			do_action('themify_builder_background_styling', $builder_id, $row, $row['row_order'], 'row');
			self::background_styling($row, 'row',$builder_id);
	    }
	    ?>
		<div class="row_inner<?php if (Themify_Builder::$frontedit_active===false): ?> <?php echo $row_content_classes ?><?php $row_content_classes=null;endif; ?> tf_box tf_w tf_rel"<?php if (!empty($row_content_attr)){ echo ' ',self::get_element_attributes($row_content_attr);$row_content_attr=null;}?>>
		<?php
		if ($count > 0) {
		    foreach ($row['cols'] as $cols => $col) {
			Themify_Builder_Component_Column::template($rows, $row, $cols, $col, $builder_id, $order_classes, true);
		    }
		}
		?>
	    </div>
	    <!-- /row_inner -->
	</div>
	<!-- /module_row -->
	<?php
	do_action('themify_builder_row_end', $builder_id, $row, $row['row_order']);
	if (!$echo) {
	    $output .= ob_get_clean();
	    // add line break
	    $output .= PHP_EOL;
	    return $output;
	}
    }

    private static function getDataValue($styles, $type = 'padding') {
	$value = '';
	if (!empty($styles['checkbox_' . $type . '_apply_all']) && !empty($styles[$type . '_top'])) {
	    $value = $styles[$type . '_top'];
	    $value.= isset($styles[$type . '_top_unit']) ? $styles[$type . '_top_unit'] : 'px';
	    $value = $value . ',' . $value;
	} elseif (!empty($styles[$type . '_left']) || !empty($styles[$type . '_right'])) {
	    if (!empty($styles[$type . '_left'])) {
		$value = $styles[$type . '_left'];
		$value.= isset($styles[$type . '_left_unit']) ? $styles[$type . '_left_unit'] : 'px';
	    }
	    if (!empty($styles[$type . '_right'])) {
		$value.= ','.$styles[$type . '_right'];
		$value.= isset($styles[$type . '_right_unit']) ? $styles[$type . '_right_unit'] : 'px';
	    }
	}
	return $value;
    }

}
