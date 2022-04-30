<?php
defined( 'ABSPATH' ) || exit;

class Themify_Builder_Component_Subrow extends Themify_Builder_Component_Base {

    public function get_name() {
		return 'subrow';
    }

    public function get_form_settings($onlyStyle=false) {
		$styles = $this->get_styling();
		if($onlyStyle===true){
			return $styles;
		}
		$row_form_settings = array(
			'setting' => array(
				'name' => __( 'Subrow Settings', 'themify' ),
				'options' => $this->get_settings(),
			),
			'styling' => array(
				'name' => __('Sub Row Styling', 'themify'),
				'options' => $styles
			)
		);
		return apply_filters('themify_builder_subrow_lightbox_form_settings', $row_form_settings);
    }


    /**
     * Get template Sub-Row.
     * 
     * @param int $rows 
     * @param int $cols 
     * @param int $index 
     * @param array $row 
     * @param string $builder_id 
     * @param boolean $echo 
     */
    public static function template($rows, $cols, $index, $row, $builder_id, $echo = false) {
	$print_sub_row_classes = array('module_subrow themify_builder_sub_row');
	$subrow_tag_attrs =  array();
	$count = 0;
	$video_data = '';
	$is_styling = !empty($row['styling']);
	if ($is_styling===true) {
	    if (isset($row['styling']['background_type']) && $row['styling']['background_type'] === 'image' && isset($row['styling']['background_zoom']) && $row['styling']['background_zoom'] === 'zoom' && $row['styling']['background_repeat'] === 'repeat-none') {
		$print_sub_row_classes[] = 'themify-bg-zoom';
	    }
	    $class_fields = array('custom_css_subrow', 'background_repeat');
	    foreach ($class_fields as $field) {
		if (!empty($row['styling'][$field])) {
		    $print_sub_row_classes[] = $row['styling'][$field];
		}
	    }
	    $class_fields=null;
	    // background video
	    $video_data = self::get_video_background($row['styling']);
		if($video_data){
			$video_data=' '.$video_data;
		}
	    if(!empty( $row['styling']['global_styles'] )){
		$print_sub_row_classes= Themify_Global_Styles::add_class_to_components($print_sub_row_classes , $row['styling'] , $builder_id);
	    }
	}
	else{
	    $row['styling']=array();
	}
	if (Themify_Builder::$frontedit_active===false) {
	    $count = !empty($row['cols']) ? count($row['cols']) : 0;
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
		$print_sub_row_classes[] = 'tb_' . $row['element_id'];
	    }
	    if($is_styling===true ){
		$subrow_tag_attrs = self::sticky_element_props($subrow_tag_attrs,$row['styling']);
	    }
	    $subrow_tag_attrs['data-lazy']=1;
	}
	$print_sub_row_classes = apply_filters('themify_builder_subrow_classes', $print_sub_row_classes, $row, $builder_id);
	$print_sub_row_classes[]='tf_w tf_clearfix';
	$subrow_tag_attrs['class'] = implode(' ', $print_sub_row_classes);
	$print_sub_row_classes=null;
	$subrow_tag_attrs = self::clickable_component( $row['styling'], $subrow_tag_attrs );
	$subrow_tag_attrs = apply_filters('themify_builder_subrow_attributes',self::parse_animation_effect($row['styling'],$subrow_tag_attrs) ,$row['styling'], $builder_id);
	

	if (!$echo) {
	    $output = PHP_EOL; // add line break
	    ob_start();
	}
	// Start Sub-Row Render ######
	?>
	<div <?php echo self::get_element_attributes($subrow_tag_attrs),$video_data; ?>>
	    <?php
	    $subrow_tag_attrs=$video_data=null;
	    if ($is_styling===true) {
		$row['row_order'] = $index;
		do_action('themify_builder_background_styling', $builder_id, $row, $rows . '-' . $cols . '-' . $index, 'subrow');
		self::background_styling($row, 'subrow',$builder_id);
	    }
	    ?>
		<div class="subrow_inner<?php if (Themify_Builder::$frontedit_active===false): ?> <?php echo $row_content_classes ?><?php $row_content_classes=null;endif; ?> tf_box tf_w"<?php if (!empty($row_content_attr)){ echo ' ',self::get_element_attributes($row_content_attr);$row_content_attr=null;}?>>
		<?php
		if ($count > 0) {
		    foreach ($row['cols'] as $col_key => $sub_col) {
			Themify_Builder_Component_Column::template_sub_column($rows, $cols, $index, $col_key, $sub_col, $builder_id, $order_classes, true);
		    }
		}
		?>
	    </div>
	</div><!-- /themify_builder_sub_row -->
	<?php
	// End Sub-Row Render ######

	if (!$echo) {
	    $output .= ob_get_clean();
	    // add line break
	    $output .= PHP_EOL;
	    return $output;
	}
    }

}
