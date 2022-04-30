<?php

defined( 'ABSPATH' ) || exit;
?>

<div class="tb_options_tab_wrapper tf_scrollbar">
	<div class="tb_options_tab_content">
		<form id="tb_load_template_form" method="POST">
			<?php if ( !empty( $this->provider_instances )): ?>
                            <?php $first = true;$instances = array();?>
                            <div id="tb_options_styling">
                                    <div class="tb_tabs">
                                            <ul class="tb_tab_wrapper tf_clearfix">
						<?php foreach( $this->provider_instances as $provider => $instance ) : ?>
							<?php if( $instance->has_layouts() ) : ?>
							    <?php $instances[] = $instance;?>
							    <li class="title<?php if($first): $first = false;?> current<?php endif;?>"><a href="#tb_tabs_<?php echo $provider; ?>"><?php echo $instance->get_label(); ?></a></li>
							<?php endif; ?>
						<?php endforeach; ?>
                                            </ul>
                                            <?php  foreach($instances as $instance ) : ?>
                                                    <?php $instance->get_list_output();
                                                        $instance->print_template_form(); 
                                                    ?>
                                            <?php endforeach; ?>
                                    </div>
                            </div>
			<?php endif; ?>
			<div class="tf_clearfix"></div>
			<a href="<?php echo admin_url('post-new.php?post_type=' . self::LAYOUT_SLUG); ?>" target="_blank" class="add_new tf_plus_icon tb_icon_btn">
                <?php _e('Add New', 'themify') ?>
			</a>
			<a href="<?php echo admin_url('edit.php?post_type=' . self::LAYOUT_SLUG); ?>" target="_blank" class="tb_icon_btn">
				<?php echo themify_get_icon('folder','ti');?>
                <?php _e('Manage Layouts', 'themify') ?>
			</a>

		</form>
	</div>
</div>
