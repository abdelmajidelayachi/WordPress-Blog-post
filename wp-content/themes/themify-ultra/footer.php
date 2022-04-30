<?php
/**
 * Template for site footer
 * @package themify
 * @since 1.0.0
 */?>
    <?php themify_layout_after(); // hook ?>
</div><!-- /body -->
<?php if(themify_theme_is_single_infinite_enabled()):?>
	<div class="load-more-button tf_hidden tf_block">
		<?php echo themify_theme_prev_single_post();?>
	</div>
<?php endif;?>
<?php
$backTop='';
$footer_enable=themify_theme_show_area( 'footer' ) && themify_theme_do_not_exclude_all( 'footer' );
if(themify_theme_show_area( 'footer_back' )){
    $is_float=themify_get( 'setting-use_float_back', 'on',true) === 'on';
    if($is_float===true || $footer_enable===true){
	    Themify_Enqueue_Assets::loadThemeStyleModule('back-top');
	    $backTop=sprintf( '<div class="back-top tf_textc tf_clearfix %s"><div class="arrow-up"><a aria-label="%s" href="#header"><span class="screen-reader-text">%s</span></a></div></div>'
		    , $is_float ? 'back-top-float back-top-hide' : '',
		    __('Back to top','themify'),
		    __('Back To Top','themify')
	    );
    }
}
?>
<?php if ( $footer_enable===true) : ?>
<div id="footerwrap" class="tf_box tf_clear <?php if(themify_theme_is_fullpage_scroll()):?> <?php echo themify_theme_is_footer_fullpage_scroll()?'module_row':'tf_scrollbar'?><?php endif;?>">
		<?php themify_footer_before(); // hook 
		    Themify_Enqueue_Assets::loadThemeStyleModule('footer');
		    $header_design=  themify_theme_get_header_design();
		    $footer_position = themify_theme_show_area( 'footer_widgets' )?themify_get_both( 'footer_widget_position','setting-footer_widget_position',false ):false;
		?>
		<footer id="footer" class="tf_box pagewidth tf_scrollbar tf_rel tf_clearfix" itemscope="itemscope" itemtype="https://schema.org/WPFooter">
			<?php
				themify_footer_start(); // hook
				if ($backTop!=='' && $header_design!=='header-bottom') {
				    echo $backTop;
				}
			?>

			<div class="main-col first tf_clearfix">
				<div class="footer-left-wrap first">
					<?php if ( themify_theme_show_area( 'footer_site_logo' ) ) : ?>
						<?php Themify_Enqueue_Assets::loadThemeStyleModule('footer-logo');?>
						<div class="footer-logo-wrapper tf_clearfix">
							<?php echo themify_logo_image( 'footer_logo', 'footer-logo' ); ?>
							<!-- /footer-logo -->
						</div>
					<?php endif; ?>

					<?php if ( is_active_sidebar( 'footer-social-widget' ) ) : ?>
						<div class="social-widget tf_inline_b tf_vmiddle">
							<?php dynamic_sidebar( 'footer-social-widget' ); ?>
						</div>
						<!-- /.social-widget -->
					<?php endif; ?>
				</div>

				<div class="footer-right-wrap">
					<?php if ( themify_theme_show_area( 'footer_menu_navigation' ) ) : ?>
						<?php Themify_Enqueue_Assets::loadThemeStyleModule('footer-nav');?>
						<div class="footer-nav-wrap">
							<?php themify_menu_nav( array(
								'theme_location' => 'footer-nav',
								'fallback_cb'	 => '',
								'container'		 => '',
								'menu_id'		 => 'footer-nav',
								'menu_class'	 => 'footer-nav'
							) ); ?>
						</div>
						<!-- /.footer-nav-wrap -->
					<?php endif; // exclude menu navigation ?>

					<?php if( $footer_position !== 'top' ) : ?>
						<div class="footer-text tf_clear tf_clearfix">
							<div class="footer-text-inner">
								<?php if ( themify_theme_show_area( 'footer_texts' ) ){
									themify_the_footer_text(); 
									themify_the_footer_text( 'right' );
								} ?>
							</div>
						</div>
						<!-- /.footer-text -->
					<?php endif;?>
				</div>
			</div>

			<?php if( themify_theme_show_area( 'footer_widgets' ) ) : ?>
				<?php if( $footer_position === 'top' ) : ?>
					<div class="section-col tf_clearfix">
						<div class="footer-widgets-wrap">
							<?php get_template_part( 'includes/footer-widgets'); ?>
							<!-- /footer-widgets -->
						</div>
					</div>
					<div class="footer-text tf_clear tf_clearfix">
						<div class="footer-text-inner">
							<?php 
								if( themify_theme_show_area( 'footer_texts' ) ) {
									themify_the_footer_text();
									themify_the_footer_text( 'right' );
								}
							?>
						</div>
					</div>
					<!-- /.footer-text -->
				<?php else : ?>
					<div class="section-col tf_clearfix">
						<div class="footer-widgets-wrap">
							<?php get_template_part( 'includes/footer-widgets'); ?>
							<!-- /footer-widgets -->
						</div>
					</div>
				<?php endif;?>
			<?php endif;?>

			<?php themify_footer_end(); // hook ?>
		</footer><!-- /#footer -->
		<?php if($header_design==='header-bottom'):?>
		    <div tabindex="0" class="footer-tab back-top back-top-float tf_box"></div>
		<?php endif;?>
		<?php themify_footer_after(); // hook ?>

	</div><!-- /#footerwrap -->
<?php 
if ($header_design==='header-bottom' && $backTop!=='') {
	echo $backTop;
}
?>
<?php
elseif ($backTop!==''):
    echo $backTop;
endif; // exclude footer
?>
</div><!-- /#pagewrap -->
<?php themify_body_end(); // hook ?>
<!-- wp_footer -->
<?php wp_footer(); ?>
	</body>
</html>
