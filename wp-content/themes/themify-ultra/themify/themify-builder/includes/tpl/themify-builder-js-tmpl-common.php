<?php
	$eye= themify_get_icon('eye','ti');
	$clipboard=themify_get_icon('clipboard','ti');
	$files=themify_get_icon('files','ti');
	$brush=themify_get_icon('brush','ti');
	$settings=themify_get_icon('settings','ti');
	$import=themify_get_icon('import','ti');
	$export=themify_get_icon('export','ti');
	$window=themify_get_icon('new-window','ti');
?>
<template id="tmpl-builder_lightbox">
    <?php //create fix overlay on top iframe,mouse position will be always on top iframe on resizing  ?>
    <div class="tb_resizable_overlay"></div>
    <div id="tb_lightbox_parent" class="themify_builder builder-lightbox <?php echo themify_is_themify_theme()?'is-themify-theme':'is-not-themify-theme'?>">
		<ul class="tb_action_breadcrumb"></ul>
        <div class="tb_lightbox_top_bar tf_clearfix">
            <ul class="tb_options_tab tf_clearfix"></ul>
            <div class="tb_lightbox_actions">
                <a class="builder_cancel_docked_mode"><?php echo $window?></a>
                <div class="tb_close_lightbox tf_close"><span><?php _e('Cancel', 'themify') ?></span></div>
                <span class="tb_lightbox_actions_wrap"></span>	
            </div>
        </div>
        <div id="tb_lightbox_container" class="tf_scrollbar"></div>
		<div class="tb_resizable tb_resizable_st" data-axis="-y"></div>
        <div class="tb_resizable tb_resizable_e" data-axis="x"></div>
        <div class="tb_resizable tb_resizable_s" data-axis="y"></div>
        <div class="tb_resizable tb_resizable_w" data-axis="w"></div>
        <div class="tb_resizable tb_resizable_se" data-axis="se"></div>
		<div class="tb_resizable tb_resizable_we" data-axis="sw"></div>
        <div class="tb_resizable tb_resizable_nw" data-axis="nw"></div>
        <div class="tb_resizable tb_resizable_ne" data-axis="ne"></div>
    </div>
</template>
<script type="text/template" id="tmpl-builder_lite_lightbox_confirm">
    <p>{{ data.message }}</p>
    <p>
    <# _.each(data.buttons, function(value, key) { #> 
    <button data-type="{{ key }}">{{ value.label }}</button> 
    <# }); #>
    </p>
</script>
<script type="text/template" id="tmpl-builder_lite_lightbox_prompt">
    <p>{{ data.message }}</p>
    <p><input type="text" class="tb_litelightbox_prompt_input"></p>
    <p>
    <# _.each(data.buttons, function(value, key) { #> 
    <button data-type="{{ key }}">{{ value.label }}</button> 
    <# }); #>
    </p>
</script>
<template id="tmpl-builder_row_item">
    <?php if(is_admin()):?>
		<div class="page-break-overlay"></div>
    <?php endif;?>
    <div class="tb_visibility_hint"><?php echo $eye;?></div>
    <div class="tb_row_info">
        <span class="tb_row_id"></span>
        <span class="tb_row_anchor"></span>
    </div>
    <div class="tb_action_wrap tb_row_action"></div>
    <div class="row_inner tf_box tf_w tf_rel"></div>
</template>
<template id="tmpl-builder_subrow_item">
	<div class="module_subrow themify_builder_sub_row tb_{{ data.element_id }} tf_w tf_clearfix">
		<div class="tb_visibility_hint"><?php echo $eye;?></div>
		<div class="tb_action_wrap tb_subrow_action"></div>
		<div class="subrow_inner tf_box tf_w"></div>
	</div>
</template>
<template id="tmpl-builder_column_item">
    <div class="tb_action_wrap tb_column_action"></div>
    <div class="tb_grid_drag tb_drag_right" draggable></div>
    <div class="tb_grid_drag tb_drag_left" draggable></div>
    <div class="tb_holder"></div>
    <div class="tf_plus_icon tb_column_btn_plus tb_disable_sorting"></div>
</template>
<template id="tmpl-builder_row_action">
    <ul class="tb_dropdown">
	<li class="tb_move"><?php echo themify_get_icon('move','ti')?></li>
	<li class="tb_row_settings" data-href="tb_row_options">
	    <?php echo $settings; ?>
	    <div class="themify_tooltip"><?php _e('Options', 'themify') ?></div>
	</li>
	<li class="tb_styling">
	    <?php echo $brush; ?>
	    <div class="themify_tooltip"><?php _e('Styling', 'themify') ?></div>
	</li>
	<li class="tb_duplicate">
	    <?php echo themify_get_icon('layers','ti'); ?>
	    <div class="themify_tooltip"><?php _e('Duplicate', 'themify') ?></div>
	</li>
	<li class="tb_delete_row_container tb_delete tf_close">
	    <div class="themify_tooltip"><?php _e('Delete', 'themify') ?></div>
	</li>
	<li class="tb_action_more">
	    <?php echo themify_get_icon('more','ti'); ?>
	    <div class="themify_tooltip"><?php _e('More', 'themify') ?></div>
	    <ul>
		<li class="tb_save_component"><?php echo themify_get_icon('save','ti'), __(' Save', 'themify') ?></li>
		<li class="tb_export"><?php echo $export,__(' Export', 'themify') ?></li>
		<li class="tb_import"><?php echo $import,__(' Import', 'themify') ?></li>
		<li class="tb_copy_component"><?php echo $files,__(' Copy', 'themify') ?></li>
		<li class="tb_inner_action_more">
		    <?php echo $clipboard,__(' Paste', 'themify') ?>
		    <ul>
			<li class="tb_paste_component"><?php _e('Paste', 'themify') ?></li>
			<li class="tb_paste_style"><?php _e('Paste Styling', 'themify') ?></li>
		    </ul>
		</li>
		<li class="tb_visibility_component">
		    <?php echo $eye,__(' Visibility', 'themify') ?>
		</li>
	    </ul>
	</li>
    </ul> 
    <div id="tb_row_options" class="tb_toolbar_tabs">
	<a href="#" class="tb_row_hover_expand tb_edit"><?php echo $window?></a>
	<ul class="tb_row_toolbar_menu">
	    <li class="selected" data-href="tb_rgrids"><?php _e('Grid', 'themify') ?></li>
	    <li data-href="tb_roptions"><?php _e('Row Options', 'themify') ?></li>
	</ul>
	<div id="tb_rgrids" class="selected">
	    <?php Themify_Builder_Model::grid(); ?>
	</div>
	<div id="tb_roptions"></div>
    </div>
</template>
<template id="tmpl-builder_column_action">
    <ul class="tb_dropdown">
	<li class="tb_styling">
	    <?php echo $brush; ?>
	    <div class="themify_tooltip"><?php _e('Styling', 'themify') ?></div>
	</li>
	<li class="tb_import">
	    <?php echo $import; ?>
	    <div class="themify_tooltip"><?php _e('Import', 'themify') ?></div>
	</li>
	<li class="tb_export">
	    <?php echo $export; ?>
	    <div class="themify_tooltip"><?php _e('Export', 'themify') ?></div>
	</li>
	<li class="tb_copy_component">
	    <?php echo $files; ?>
	    <div class="themify_tooltip"><?php _e('Copy', 'themify') ?></div>
	</li>
	<li class="tb_inner_action_more">
	    <?php echo $clipboard; ?>
	    <div class="themify_tooltip"><?php _e('Paste', 'themify') ?></div>
	    <ul>
		<li class="tb_paste_component"><?php _e('Paste', 'themify') ?></li>
		<li class="tb_paste_style"><?php _e('Paste Styling', 'themify') ?></li>
	    </ul>
	</li>
    </ul>
</template>
<template id="tmpl-builder_subrow_action">
    <ul class="tb_dropdown">
	<li class="tb_move"><?php echo themify_get_icon('move','ti'); ?></li>
	<li class="tb_row_settings" data-href="tb_rgrids">
	    <?php echo $settings; ?>
	    <div class="themify_tooltip"><?php _e('Options', 'themify') ?></div>
	</li>
	<li class="tb_styling ">
	    <?php echo $brush; ?>
	    <div class="themify_tooltip"><?php _e('Styling', 'themify') ?></div>
	</li>
	<li class="tb_duplicate">
	    <?php echo themify_get_icon('layers','ti'); ?>
	    <div class="themify_tooltip"><?php _e('Duplicate', 'themify') ?></div>
	</li>
	<li class="tb_delete tf_close">
	    <div class="themify_tooltip"><?php _e('Delete', 'themify') ?></div>
	</li>
	<li class="tb_action_more">
	    <?php echo themify_get_icon('more','ti'); ?>
	    <div class="themify_tooltip"><?php _e('More', 'themify') ?></div>
	    <ul>
		<li class="tb_export">
		    <?php echo $export, __('Export', 'themify'); ?>
		</li>
		<li class="tb_import">
		    <?php echo $import, __('Import', 'themify'); ?>
		</li>
		<li class="tb_copy_component">
		    <?php echo $files, __('Copy', 'themify'); ?>
		</li>
		<li class="tb_inner_action_more">
		    <?php echo $clipboard, __('Paste', 'themify'); ?>
		    <ul>
			<li class="tb_paste_component"><?php _e('Paste', 'themify') ?></li>
			<li class="tb_paste_style"><?php _e('Paste Styling', 'themify') ?></li>
		    </ul>
		</li>
		<li class="tb_visibility_component">
		    <?php echo $eye, __('Visibility', 'themify'); ?>
		</li>
	    </ul>
	</li>
    </ul>
    <div id="tb_rgrids" class="tb_toolbar_tabs">
	<a href="#" class="tb_row_hover_expand tb_edit"><?php echo $window?></a>
	<?php Themify_Builder_Model::grid(); ?>
    </div>
</template>
<template id="tmpl-builder_module_action">
    <ul class="tb_dropdown">
	<li class="tb_edit">
	    <?php echo themify_get_icon('pencil','ti'); ?>
	    <div class="themify_tooltip"><?php _e('Edit', 'themify') ?></div>
	</li>
    <li class="tb_settings">
        <?php echo $settings; ?>
        <div class="themify_tooltip"><?php _e('Options', 'themify') ?></div>
    </li>
	<li class="tb_styling">
	    <?php echo $brush; ?>
	    <div class="themify_tooltip"><?php _e('Styling', 'themify') ?></div>
	</li>
	<li class="tb_duplicate">
	    <?php echo themify_get_icon('layers','ti'); ?>
	    <div class="themify_tooltip"><?php _e('Duplicate', 'themify') ?></div>
	</li>
	<li class="tb_delete tf_close">
	    <div class="themify_tooltip"><?php _e('Delete', 'themify') ?></div>
	</li>
	<li class="tb_action_more">
	    <?php echo themify_get_icon('more','ti'); ?>
	    <div class="themify_tooltip"><?php _e('More', 'themify') ?></div>
	    <ul>
		<li class="tb_save_component"><?php echo themify_get_icon('save','ti'),__('Save', 'themify') ?></li>
		<li class="tb_export">
		    <?php echo $export,__('Export', 'themify') ?>
		</li>
		<li class="tb_import">
		    <?php echo $import,__('Import', 'themify') ?>
		</li>
		<li class="tb_copy_component">
		    <?php echo $files,__('Copy', 'themify') ?>
		</li>
		<li class="tb_inner_action_more">
		    <?php echo $clipboard,__('Paste', 'themify') ?>
		    <ul>
			<li class="tb_paste_component"><?php _e('Paste', 'themify') ?></li>
			<li class="tb_paste_style"><?php _e('Paste Styling', 'themify') ?></li>
		    </ul>
		</li>
		<li class="tb_visibility_component">
		    <?php echo $eye,__('Visibility', 'themify') ?>
		</li>
	    </ul>
	</li>
    </ul>
</template>
<template id="tmpl-last_row_add_btn">
    <div class="tb_last_add_btn_expand">
        <div class="tb_row_grid" data-col="1"><span class="tb_col_1"></span></div>
        <div class="tb_row_grid" data-col="2"><span class="tb_col_2"></span></div>
        <div class="tb_row_grid" data-col="3"><span class="tb_col_3"></span></div>
        <div class="tb_row_grid" data-col="4"><span class="tb_col_4"></span></div>
        <div class="tb_row_grid" data-col="5"><span class="tb_col_5"></span></div>
        <div class="tb_row_grid" data-col="6"><span class="tb_col_6"></span></div>
        <div class="tb_add_blocks">
           <span class="tb_block_plus_text"><?php _e('Blocks','themify'); ?></span>
        </div>
    </div>
</template>
<template id="tmpl-global_styles">
    <ul class="tb_gs_action_dropdown">
        <li data-action="insert"><?php _e('Insert Global Style','themify') ?></li>
        <li data-action="save"><?php _e('Save as Global Style','themify') ?></li>
    </ul>
    <div class="tb_gs_items_dropdown">
	<div class="tb_gs_items_header">
	    <label for="global-style-search"><?php echo themify_get_icon('search','ti'),__('', 'themify') ?><input type="text" id="global-style-search" autocomplete="off"/></label>
	    <a class="tb_open_gs" href="<?php echo esc_url(admin_url( 'admin.php?page=themify-global-styles')); ?>" target="_blank">
		<?php echo $window,__('Manage Styles', 'themify') ?>
	    </a>
	</div>
	<div class="tb_gs_list tf_scrollbar">
	    <span class="tb_no_gs_item"><?php _e('No Global Styles found.', 'themify') ?></span>
	</div>
    </div>
</template>
<template id="tmpl-builder_right_click">
    <div id="tb_right_click">
	<div id="tb_inline_gs"></div>
	<div class="tb_action_breadcrumb"></div>
	<ul>
	    <li data-action="move" title="<?php _e('Move','themify')?>" class="tb_r_name"></li>
	    <li data-action="undo" class="tb_r_undo  tb_multiply_hide"><?php _e('Undo','themify')?><span class="tb_right_help"><?php _e('Cmd+Z','themify')?></span></li>
	    <li data-action="redo" class="tb_r_redo tb_multiply_hide"><?php _e('Redo','themify')?><span class="tb_right_help"><?php _e('Cmd+Shift+Z','themify')?></span></li>
	    <li data-action="edit" class="tb_edit tb_multiply_hide"><?php _e('Edit','themify')?></li>
	    <li data-action="edit"  class="tb_styling tb_multiply_hide"><?php _e('Style','themify')?></li>
	    <li data-action="save" class="tb_multiply_hide"><?php _e('Save','themify')?><span class="tb_right_help"><?php _e('Cmd+S','themify')?></span></li>
	    <li data-action="duplicate" class="tb_multiply_hide"><?php _e('Duplicate','themify')?><span class="tb_right_help"><?php _e('Cmd+D','themify')?></span></li>
	    <li data-action="copy" class="tb_multiply_hide"><?php _e('Copy','themify')?><span class="tb_right_help"><?php _e('Cmd+C','themify')?></span></li>
	    <li class="tb_inner_action_more">
		<?php _e('Paste','themify')?><span class="tb_right_help"><?php _e('Cmd+V','themify')?></span>
		<ul>
		    <li data-action="paste" class="tb_paste_component"><?php _e('Paste','themify')?></li>
		    <li data-action="paste" class="tb_paste_style"><?php _e('Paste Styling','themify')?></li>
		</ul>
	    </li>
	    <li data-action="delete"><?php _e('Delete','themify')?><span class="tb_right_help"><?php _e('Cmd+Delete','themify')?></span></li>
	    <li class="tb_inner_action_more"> 
		<?php _e('Global Style','themify')?>
		<ul>
		    <li data-action="gs_in"><?php _e('Insert','themify')?></li>
		    <li data-action="gs_r"><?php _e('Remove','themify')?></li>
		</ul>
	    </li>
            <li data-action="edit" class="tb_visibility_component tb_multiply_hide"><?php _e( 'Visibility', 'themify' ) ?></li>
            <li data-action="reset"><?php _e( 'Reset Styling', 'themify' ) ?></li>
	</ul>
    </div>
</template>
<?php 
    $base=THEMIFY_BUILDER_DIR . '/img/row-frame/';
    if(is_readable($base)){
	$frames=Themify_Builder_Model::get_frame_layout();
	foreach($frames as $fr){
	?>
	<?php if($fr['value']!==''):?>
	    <?php  
		$path=pathinfo($fr['img']);
		if($path['extension']!=='svg'){
		    continue;
		}
		$f=$base.$path['filename'];
	    ?>
	    <script type="text/template" id="tmpl-frame_<?php echo $fr['value']?>">
		<?php echo file_get_contents($f.'.'.$path['extension']);?>
	    </script>
	    <script type="text/template" id="tmpl-frame_<?php echo $fr['value']?>-l">
		<?php echo file_get_contents($f.'-l.'.$path['extension']);?>
	    </script>
	<?php endif;?>
	<?php 
	}
    $frames=$base=null;
    }
	$eye= $clipboard=$files=$settings=$brush=$import=$export=$window=null;
