<?php
global $post;
if (!is_object($post))
    return;
?>
<template id="tmpl-builder_module_item">
    <div class="tb_action_wrap tb_module_action"></div>
    <div class="module module-{{ data.slug }} tb_{{ data.element_id }}">
		<div class="tb_visibility_hint"><?php echo themify_get_icon('eye','ti');?></div>
		<div class="module_label">
		{{{ data.icon }}}
			<span class="module_name">{{ data.name }}</span>
			<em class="module_excerpt">{{ data.excerpt }}</em>
		</div>
	</div>
</template>
<template id="tmpl-builder_admin_canvas_block">
    <div class="themify_builder themify_builder_admin tf_clearfix">
        <?php include_once THEMIFY_BUILDER_INCLUDES_DIR . '/themify-builder-module-panel.php'; ?>
        <div class="tb_row_panel tf_clearfix">
            <div id="tb_row_wrapper" class="tb_row_js_wrapper tb_editor_wrapper tb_active_builder" data-postid="<?php echo $post->ID; ?>"></div>
        </div>
    </div>
</template>
