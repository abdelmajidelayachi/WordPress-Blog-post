<template id="tmpl-small_toolbar">
    <div class="tb_disable_sorting" id="tb_small_toolbar">
        <ul class="tb_toolbar_menu">
            <li class="tb_toolbar_undo"><a href="#" class="tb_tooltip tb_undo_redo tb_undo_btn tb_disabled"><?php echo themify_get_icon('back-left','ti')?><span><?php _e('Undo (CTRL+Z)', 'themify'); ?></span></a></li>
            <li class="tb_toolbar_redo"><a href="#" class="tb_tooltip tb_undo_redo tb_redo_btn tb_disabled"><?php echo themify_get_icon('back-right','ti')?><span><?php _e('Redo (CTRL+SHIFT+Z)', 'themify'); ?></span></a></li>
            <li class="tb_toolbar_divider"></li>
            <li class="tb_toolbar_import"><a href="javascript:void(0);" tabindex="-1" class="tb_tooltip"><?php echo themify_get_icon('import','ti')?><span><?php _e('Import', 'themify'); ?></span></a>
                <ul>
                    <li><a href="#" data-component="file"><?php _e('Import From File', 'themify'); ?></a></li>
                    <li><a href="#" data-component="page"><?php _e('Import From Page', 'themify'); ?></a></li>
                    <li><a href="#" data-component="post"><?php _e('Import From Post', 'themify'); ?></a></li>
                </ul>
            </li>
            <li class="tb_toolbar_export"><a href="<?php echo wp_nonce_url('?themify_builder_export_file=true', 'themify_builder_export_nonce') ?>&postid=#postID#" class="tb_tooltip tb_export_link"><?php echo themify_get_icon('export','ti')?><span><?php _e('Export', 'themify'); ?></span></a></li>
            <li class="tb_toolbar_divider"></li>
            <li><a href="javascript:void(0);" tabindex="-1" class="tb_tooltip"><?php echo themify_get_icon('layout','ti')?><span><?php _e('Layout', 'themify'); ?></span></a>
                <ul>
                    <li><a href="#" class="tb_load_layout"><?php _e('Load Layout', 'themify'); ?></a></li>
                    <li><a href="#" class="tb_save_layout"><?php _e('Save as Layout', 'themify'); ?></a></li>
                </ul>
            </li>
        </ul>
        <div class="tb_toolbar_save_wrap">
            <div class="tb_toolbar_close">
                <a href="#" class="tb_tooltip tb_toolbar_close_btn tf_close" title="<?php _e('ESC', 'themify') ?>"><span><?php _e('Close', 'themify'); ?></span></a>
            </div>
            <div class="tb_toolbar_save_btn">
                <a href="#" class="tb_toolbar_save" title="<?php _e('Ctrl + S', 'themify') ?>"><?php _e('Save', 'themify'); ?></a>
            </div>
        </div>
    </div>
</template>
<template id="tmpl-builder_inline_editor">
	<div id="tb_editor" class="tf_abs tf_hide tf_opacity">
		<div id="tb_editor_link_edit" class="tf_hide">
			<button type="button" id="tb_editor_link_value" class="tb_editor_action tf_rel" data-type="link"><span></span><span class="themify_tooltip"><?php _e('Click To Edit', 'themify') ?></span></button>
			<a href="#" class="tf_rel" target="_blank"><?php echo themify_get_icon('new-window','ti')?><span class="themify_tooltip"><?php _e('Open in a new tab', 'themify') ?></span></a>
		</div>
		<form class="tb_editor_link_options tf_rel tf_hide">
			<div class="tb_editor_link_base">
				<div class="tf_rel">
					<div class="selectwrapper">
						<select id="tb_editor_link_type">
							<option><?php _e('Same Window','themify')?></option>
							<option value="_blank"><?php _e('New Window','themify')?></option>
							<option value="lightbox"><?php _e('Lightbox','themify')?></option>
						</select>
					</div>
					<span class="themify_tooltip"><?php _e('Open Link In','themify')?></span>
				</div>
				<input class="tb_editor_link_input" placeholder="<?php _e('URL','themify')?>" type="text" required="1">
				<button type="button" class="tb_editor_action tb_editor_unlink_icon" data-type="unlinkBack"><?php echo themify_get_icon('unlink','ti')?><span class="themify_tooltip"><?php _e('Unlink', 'themify') ?></span></button>
				<button type="submit" class="tf_hide"></button>
			</div>
			<fieldset class="tb_editor_lightbox_actions tf_box tf_width tf_hide">
				<legend><?php _e('Lightbox Options','themify')?></legend>
				<div class="tb_editor_lb_field tb_editor_lb_width">
					<label for="tb_editor_lb_w"><?php _e('Width','themify')?></label>
					<div id="tb_editor_lb_w_holder"></div>
				</div>
				<div class="tb_editor_lb_field tb_editor_lb_height">
					<label for="tb_editor_lb_h"><?php _e('Height','themify')?></label>
					<div id="tb_editor_lb_h_holder"></div>
				</div>
			</fieldset>
		</form>
		<div id="tb_editor_dialog"></div>
		<ul id="tb_editor_menu">
			<li>
				<span class="themify_tooltip"><?php _e('Link', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action tb_editor_unlink_icon" data-type="unlink"><?php echo themify_get_icon('unlink','ti')?><span class="themify_tooltip"><?php _e('Unlink', 'themify') ?></span></a>
				<a href="#" tabindex="0" class="tb_editor_action" data-type="link"><?php echo themify_get_icon('link','ti')?></a>
			</li>
			<li data-type="formatBlock">
				<span class="themify_tooltip"><?php _e('Paragraph', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-action="p"><?php echo themify_get_icon('paragraph','ti')?></a>
				<ul class="tb_editor_options">
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="p">P</a></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="h1">H1</a></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="h2">H2</a></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="h3">H3</a></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="h4">H4</a></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="h5">H5</a></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="h6">H6</a></li>
                    <li><a href="#" tabindex="0" class="tb_editor_action" data-action="pre"><?php echo themify_get_icon('fas code','fa')?></a><span class="themify_tooltip"><?php _e('Preformatted', 'themify') ?></span></li>
                    <li><a href="#" tabindex="0" class="tb_editor_action" data-action="blockquote"><?php echo themify_get_icon('fas quote-left','fa')?></a><span class="themify_tooltip"><?php _e('Quote', 'themify') ?></span></li>
				</ul>
			</li>
			<li data-type="text_align">
				<span class="themify_tooltip"><?php _e('Text Align', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-action="justifyLeft"><?php echo themify_get_icon('align-left','ti')?></a>
				<ul class="tb_editor_options">
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="justifyLeft"><?php echo themify_get_icon('align-left','ti')?></a><span class="themify_tooltip"><?php _e('Left', 'themify') ?></span></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="justifyCenter"><?php echo themify_get_icon('align-center','ti')?></a><span class="themify_tooltip"><?php _e('Center', 'themify') ?></span></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="justifyRight"><?php echo themify_get_icon('align-right','ti')?></a><span class="themify_tooltip"><?php _e('Right', 'themify') ?></span></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="justifyFull"><?php echo themify_get_icon('align-justify','ti')?></a><span class="themify_tooltip"><?php _e('Justify', 'themify') ?></span></li>
				</ul>
			</li>
			<li>
				<span class="themify_tooltip"><?php _e('Bold', 'themify') ?></span>
				<a type="button" class="tb_editor_action tb_editor_bold" href="#" tabindex="0" data-type="bold">B</a>
			</li>
			<li>
				<span class="themify_tooltip"><?php _e('Italic', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-type="italic"><?php echo themify_get_icon('Italic','ti')?></a>
			</li>
			<li>
				<span class="themify_tooltip"><?php _e('Text Decoration', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-type="underline"><?php echo themify_get_icon('underline','ti')?></a>
			</li>
			<li>
				<span class="themify_tooltip"><?php _e('Strikethrough', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action tb_editor_strike" data-type="strikethrough">S</a>
			</li>
			<li data-type="list">
				<span class="themify_tooltip"><?php _e('List Settings', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-action="insertUnorderedList"><?php echo themify_get_icon('list','ti')?></a>
				<ul class="tb_editor_options">
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="insertUnorderedList"><?php echo themify_get_icon('ti-list','ti')?></a><span class="themify_tooltip"><?php _e('Unordered List', 'themify') ?></span></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-action="insertOrderedList"><?php echo themify_get_icon('ti-list-ol','ti')?></a><span class="themify_tooltip"><?php _e('Ordered List', 'themify') ?></span></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-type="Indent"><?php echo themify_get_icon('control-skip-forward','ti')?></a><span class="themify_tooltip"><?php _e('Increase Indent', 'themify') ?></span></li>
					<li><a href="#" tabindex="0" class="tb_editor_action" data-type="Outdent"><?php echo themify_get_icon('control-skip-backward','ti')?></a><span class="themify_tooltip"><?php _e('Decrease Indent', 'themify') ?></span></li>
				</ul>
			</li>	
			<?php 
			/*				
			<li>
				<span class="themify_tooltip"><?php _e('Insert Image', 'themify') ?></span>					
				<button type="button" class="tb_editor_action" data-type="image"><?php echo themify_get_icon('image','ti')?></button>			
			</li>				
			*/			
			?>
			<li>
				<span class="themify_tooltip"><?php _e('Text Color', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-type="color"><?php echo themify_get_icon('paint-bucket','ti')?></a>
			</li>
			<li>
				<span class="themify_tooltip"><?php _e('Fonts', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-type="font"><?php echo themify_get_icon('text','ti')?></a>
			</li>
			<li>
				<span class="themify_tooltip"><?php _e('Expand', 'themify') ?></span>
				<a href="#" tabindex="0" class="tb_editor_action" data-type="expand"><?php echo themify_get_icon('new-window','ti')?></a>
			</li>
		</ul>
	</div>
</template>