<div <?php blogtory_header_styles(); ?>>
    <div class="wrapper header-wrapper">
        <div class="unfold-header-areas header-areas-left">
            <?php blogtory_site_brand();?>
        </div>
        <div class="unfold-header-areas header-areas-right">
            <div class="unfold-ad-space">
                <?php
                $ad_banner_image = blogtory_get_option('ad_banner_image');
                $ad_banner_link = blogtory_get_option('ad_banner_link');
                if ($ad_banner_image) {
                    $ad_banner_image_html = '<img src="' . esc_url($ad_banner_image) . '">';
                    $ad_banner_link_open = $ad_banner_link_close = '';
                    if ($ad_banner_link) {
                        $ad_banner_link_open = '<a href="' . esc_url($ad_banner_link) . '" target="_blank" class="border-overlay">';
                        $ad_banner_link_close = '</a>';
                    }
                    echo wp_kses_post($ad_banner_link_open . $ad_banner_image_html . $ad_banner_link_close);
                }
                ?>
            </div>
        </div>
    </div>
</div>
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
                    if ($enable_search) {
                        blogtory_search_icon();
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

</div>