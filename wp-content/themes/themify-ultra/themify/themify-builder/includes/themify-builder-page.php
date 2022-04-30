<form id="tb_builder_page">

	<div class="tbbp_top">
		<input type="submit" class="button button-primary button-large" value="<?php _e( 'Publish', 'themify' ); ?>">
		<div class="tbbp_close tf_close"><span><?php _e( 'Cancel', 'themify' ); ?></span></div>
	</div>

	<div class="tbbp_options tf_scrollbar">

		<div class="tbbp_attributes">
			<div class="tbbp_title">
				<input type="text" value="" id="title" spellcheck="true" autocomplete="off" placeholder="<?php _e( 'Add title', 'themify' ); ?>" required="required">
			</div>
			<div class="tbbp_parent">
				<?php wp_dropdown_pages( [
					'post_type'        => 'page',
					'name'             => 'tbbp_parent',
					'show_option_none' => __( '(no parent)', 'themify' ),
					'sort_column'      => 'menu_order, post_title',
				] ); ?>
			</div>
		</div>

		<div class="tbbp_filter">
			<div class="tbbp_search_container">
				<input type="text" placeholder="Search" data-search="true" autofocus="">
			</div>
			<div class="tbbp_category">
				<span class="tbbp_category_label" tabindex="-1"><?php _e( 'All', 'themify' ); ?></span>
				<ul class="tf_scrollbar">
					<li class="all"><?php _e( 'All', 'themify' ); ?></li>
				</ul>
			</div>
		</div>

		<ul class="tbbp_layout_lists">
			<li class="blank selected">
				<div class="tbbp_preview" data-slug="">
					<div class="tbbp_thumbnail">
						<img src="<?php echo THEMIFY_BUILDER_URI; ?>/img/blank-layout.png" alt="">
					</div>
					<div class="tbbp_layout_title"><?php _e( 'Blank', 'themify' ); ?></div>
					<a class="tbbp_preview_link"><?php echo themify_get_icon( 'search','ti' )?></a>
				</div>
			</li>
		</ul>

	</div>

	<span class="tbbp_search_icon" style="display: none"><?php echo themify_get_icon( 'search','ti' )?></span>
	<?php Themify_Enqueue_Assets::loadIcons(); ?>
</form>