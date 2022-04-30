<?php
/**
 * @var $icon_fonts
 */
$isFirst=true;
?>
<div id="themify_lightbox_fa" class="themify-admin-lightbox tf_clearfix">
	<input type="text" id="themify-search-icon-input" placeholder="<?php _e( 'Search', 'themify' ); ?>" />
	<h3 class="themify_lightbox_title"><?php _e( 'Choose icon', 'themify' ); ?></h3>
	<a href="#" class="close_lightbox tf_close"></a>

	<div class="tf-icon-group-select">
		<?php foreach( $icon_fonts as $id => $font ) : ?>
			<label><input name="icon-font-group" type="radio" value="<?php echo $id; ?>"<?php if($isFirst===true):?> checked="checked"<?php $isFirst=false;endif;?> ><?php echo $font->get_label(); ?></input></label> 
		<?php endforeach; ?>
	</div>

	<div class="lightbox_container tf_scrollbar">
		
		<?php foreach( $icon_fonts as $id => $font ) : ?>
			<?php 
				$categories=$font->get_categories();
				$isFirst=true;
			?>
			<div class="tf-font-group" data-group="<?php echo $id; ?>">
				<?php if(!empty($categories)):?>
					<ul class="themify-lightbox-icon">
						<?php foreach( $categories as $k=>$v ) : ?>
							<li data-id="<?php echo $id,'-',$k; ?>">
								<span><?php echo $v; ?></span>
							</li>
							
						<?php endforeach; ?>
					</ul>
					<?php foreach( $categories as $k=>$v ) : ?>
						<section id="<?php echo $id,'-',$k; ?>">
							<h2 class="page-header"><?php echo $v; ?></h2>
							<div class="row"></div>
						</section>
					<?php endforeach; ?>
				<?php endif;?>
			</div>
		<?php endforeach; ?>

	</div><!-- .lightbox_container -->
</div>
<div id="themify_lightbox_overlay"></div>