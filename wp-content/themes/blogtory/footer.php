<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Blogtory
 */

?>

	</div><!-- #content -->

    <?php
    /**
     * Functions hooked in to blogtory_before_footer
     *
     * @hooked blogtory_before_footer_widget_region - 10
     */
    do_action( 'blogtory_before_footer' );
    ?>
    
	<footer id="colophon" class="site-footer style_8 be-center" role="contentinfo">
            <?php
            /**
             * Functions hooked into blogtory_footer action
             *
             * @hooked blogtory_footer_start - 10
             * @hooked blogtory_footer_content - 20
             * @hooked blogtory_footer_end - 30
             */
            do_action( 'blogtory_footer');
            ?>
	</footer>

    <?php
    /**
     * Functions hooked in to blogtory_after_footer
     *
     * @hooked blogtory_after_footer_widget_region - 10
     */
    do_action( 'blogtory_after_footer' );
    ?>

    <div class="menu-modal cover-modal header-footer-group" data-modal-target-string=".menu-modal">
        <div class="menu-modal-inner modal-inner">
            <div class="menu-wrapper section-inner">
                <div class="menu-top">
                    <button class="toggle close-nav-toggle fill-children-current-color" data-toggle-target=".menu-modal" data-toggle-body-class="showing-menu-modal" aria-expanded="false" data-set-focus=".menu-modal">
                        <span class="toggle-text"><?php _e( 'Close Menu', 'blogtory' ); ?></span>
                        <?php blogtory_the_theme_svg( 'cross' ); ?>
                    </button><!-- .nav-toggle -->
                    <?php $mobile_menu_location = 'primary-menu';?>
                    <nav class="mobile-menu" aria-label="<?php echo esc_attr_x( 'Mobile', 'menu', 'blogtory' ); ?>">
                        <ul class="modal-menu reset-list-style">
                            <?php
                            wp_nav_menu(
                                array(
                                    'container'      => '',
                                    'items_wrap'     => '%3$s',
                                    'show_toggles'   => true,
                                    'theme_location' => $mobile_menu_location,
                                )
                            );
                            ?>
                        </ul>
                    </nav>
                </div><!-- .menu-top -->

                <div class="menu-bottom">
                    <?php if ( has_nav_menu( 'social-menu' ) ) { ?>
                        <div class="unfold-components-socialnav">
                            <nav aria-label="<?php esc_attr_e( 'Expanded Social links', 'blogtory' ); ?>">
                                <ul class="uf-social-menu reset-list-style uf-social-icons fill-children-current-color">
                                    <?php
                                    wp_nav_menu(
                                        array(
                                            'theme_location'  => 'social-menu',
                                            'container'       => '',
                                            'container_class' => '',
                                            'items_wrap'      => '%3$s',
                                            'menu_id'         => '',
                                            'menu_class'      => '',
                                            'depth'           => 1,
                                            'link_before'     => '<span class="screen-reader-text">',
                                            'link_after'      => '</span>',
                                            'fallback_cb'     => '',
                                        )
                                    );
                                    ?>
                                </ul>
                            </nav>
                        </div>
                    <?php } ?>
                </div><!-- .menu-bottom -->

            </div><!-- .menu-wrapper -->
        </div><!-- .menu-modal-inner -->
    </div><!-- .menu-modal -->

</div><!-- #page -->
<a id="scroll-up" class="primary-bg">
    <?php blogtory_the_theme_svg('arrow-up');?>
</a>
<?php wp_footer(); ?>

</body>
</html>