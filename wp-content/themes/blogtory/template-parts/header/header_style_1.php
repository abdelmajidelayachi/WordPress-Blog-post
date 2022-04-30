<div id="unfold-header-navarea" class="be-header-menu-wrap">
    <div class="wrapper header-wrapper">
        <div class="unfold-header-areas header-areas-left">
            <div class="main-navigation">
                <?php blogtory_primary_menu();?>
                <button class="toggle nav-toggle mobile-nav-toggle" data-toggle-target=".menu-modal"  data-toggle-body-class="showing-menu-modal" aria-expanded="false" data-set-focus=".close-nav-toggle">
                    <span class="toggle-inner">
                        <span class="toggle-icon">
                            <?php blogtory_the_theme_svg( 'menu' ); ?>
                        </span>
                        <span class="toggle-text"><?php _e( 'Menu', 'blogtory' ); ?></span>
                    </span>
                </button><!-- .nav-toggle -->
            </div>
        </div>
        <div class="unfold-header-areas header-areas-right">
            <div class="secondary-navigation">
                
                <div class="cart-search">
                    <?php
                    if (blogtory_is_wc_active()) {
                        blogtory_woocommerce_header_cart();
                    }
                    $enable_search = blogtory_get_option('enable_search_on_header');
                    if($enable_search){
                        blogtory_search_icon();
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

    <div class="wrapper">
        <div class="column-row">
            <div class="column column-12">
                <div class="unfold-seperator"></div>
            </div>
        </div>
    </div>
</div>
<div <?php blogtory_header_styles(); ?>>
    <div class="wrapper header-wrapper">
        <?php blogtory_site_brand();?>
    </div>
</div>