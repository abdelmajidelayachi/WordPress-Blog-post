<?php global $themify;
	  $is_portfolio =  is_singular('portfolio');
 ?>
<div class="post-content">

	<?php if ( $is_portfolio===false && $themify->hide_date !== 'yes' ) : ?>
		<?php themify_theme_post_date(); ?>
	<?php endif; //post date ?>

	<?php if ( $is_portfolio===true && $themify->hide_meta !== 'yes' &&  $themify->hide_meta_category !== 'yes'): ?>
		<p class="post-meta entry-meta">
			<?php the_terms( get_the_id(), get_post_type() . '-category', '<span class="post-category">', ' <span class="separator">/</span> ', ' </span>' ) ?>
		</p>
	<?php endif; //post meta ?>
	<?php themify_post_title(); ?>

	<?php if ( $themify->hide_meta !== 'yes' && ($is_portfolio===false || ($is_portfolio===true && themify_check( 'setting-portfolio_comments',true ))) ) : ?>
		<p class="post-meta entry-meta">
			<?php if($is_portfolio===false): ?>
				<?php if ($themify->hide_meta_author !== 'yes' ): ?>
                    <span class="post-author"><?php echo themify_get_author_link() ?></span>
				<?php endif; ?>
				<?php if ($themify->hide_meta_category !== 'yes' ): ?>
					<?php the_terms( get_the_id(), 'category', ' <span class="post-category">', ', ', '</span>' ); ?>
				<?php endif; // meta category ?>
				<?php if ( $themify->hide_meta_tag !== 'yes' ): ?>
					<?php the_terms( get_the_id(), 'post_tag', ' <span class="post-tag">', ', ', '</span>' ); ?>
				<?php endif; // meta tag ?>
            <?php endif; ?>
			<?php themify_comments_popup_link(array('icon'=>'fas comment'));?>
		</p>
		<!-- /post-meta -->
	<?php endif; //post meta ?>

	<?php if ( 'below' === $themify->media_position && $themify->post_layout_type === 'classic' ) themify_post_media(); ?>
	<?php if (!is_singular() && ! is_attachment() && has_excerpt()) : ?>
		<div class="entry-content">
			<?php the_excerpt(); ?>
		</div><!-- /.entry-content -->
	<?php endif; ?>
	<?php if ( ( $is_portfolio===true && $themify->post_layout_type !== 'classic' ) || $is_portfolio===false ) : ?>
		<?php edit_post_link(__('Edit', 'themify'), '<span class="edit-button">[', ']</span>'); ?>
	<?php endif; ?>
</div>
