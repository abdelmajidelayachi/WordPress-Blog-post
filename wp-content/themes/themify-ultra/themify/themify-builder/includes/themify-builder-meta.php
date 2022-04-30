<?php

defined( 'ABSPATH' ) || exit;

/**
 * Builder Main Meta Box HTML
 */
global $post;
?>

<div class="themify_builder themify_builder_admin tf_clearfix">
	
	<?php include_once THEMIFY_BUILDER_INCLUDES_DIR . '/themify-builder-module-panel.php'; ?>
	<!-- /themify_builder_module_panel -->

	<div class="tb_row_panel tf_clearfix">

		<div id="tb_row_wrapper" class="tb_row_js_wrapper tb_editor_wrapper tb_active_builder" data-postid="<?php echo $post->ID; ?>"></div> <!-- /#tb_row_wrapper - Load by js later -->

	</div>
	<!-- /tb_row_panel -->

	<div style="display: none;">
		<?php
			wp_editor( ' ', 'tb_lb_hidden_editor' );
		?>
	</div>

</div>
<!-- /themify_builder -->