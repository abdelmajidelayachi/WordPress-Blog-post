<?php
/*Get the footer column from the customizer*/
$footer_column_layout = blogtory_get_option('footer_column_layout');
$footer_class = 'column-3';

if($footer_column_layout){
    switch ($footer_column_layout) {
        case "footer_layout_1":
            $footer_column = 4;
            $footer_class = 'column-3';
            break;
        case "footer_layout_2":
            $footer_column = 3;
            $footer_class = 'column-4';
            break;
        case "footer_layout_3":
            $footer_column = 2;
            $footer_class = 'column-6';
            break;
        default:
            $footer_column = 4;
            $footer_class = 'column-3';
    }
}else{
    $footer_column = 4;
    $footer_class = 'column-3';
}

$cols = intval( apply_filters( 'blogtory_footer_widget_columns', $footer_column) );

// Defines the number of active columns in this footer row.
for ( $j = $cols; 0 < $j; $j-- ) {
    if ( is_active_sidebar( 'footer-' . strval( $j ) ) ) {
        $columns = $j;
        break;
    }
}

if ( isset( $columns ) ) : ?>
    <div class="unfold-footer-widgets">
        <div class="wrapper">
            <div class="column-row">
                <?php
                for ( $column = 1; $column <= $columns; $column++ ) :
                    if ( is_active_sidebar( 'footer-' . strval( $column ) ) ) :
                        // Get the proper column class
                        if(is_array($footer_class)){
                            $footer_display_class = $footer_class[$column - 1];
                        }else{
                            $footer_display_class = $footer_class;
                        }
                        ?>
                        <div class="column footer-common-widget column-sm-12 footer-widget-<?php echo strval( $column ); ?> <?php echo $footer_display_class;?>">
                            <?php dynamic_sidebar( 'footer-' . strval( $column ) ); ?>
                        </div><!-- .footer-widget-<?php echo strval( $column ); ?> -->
                        <?php
                    endif;
                endfor;
                ?>
            </div>
        </div>
    </div>
    <?php
    unset( $columns );
endif;

?>

<?php
$copyright_text = blogtory_get_option('copyright_text');
$enable_footer_nav = blogtory_get_option('enable_footer_nav');
$enable_footer_credit = blogtory_get_option('enable_footer_credit');

if($copyright_text || $enable_footer_nav || $enable_footer_credit){
    ?>
    <div class="unfold-footer-siteinfo">
        <div class="wrapper">
            <div class="column-row">
                <div class="column column-6 column-sm-12">
                    <div class="site-copyright">
                        <span>
                            <?php
                            if($copyright_text){ echo wp_kses_post($copyright_text); }
                            ?>
                        </span>
                        <?php
                        if($enable_footer_credit){
                            printf(esc_html__('Theme: %1$s by %2$s', 'blogtory'), '<a href="https://unfoldwp.com/products/blogtory" target = "_blank" rel="designer">Blogtory</a>', '<a href="https://unfoldwp.com/" target = "_blank" rel="designer">Unfoldwp</a>');
                        }
                        ?>
                    </div>
                </div>

                <?php
                if($enable_footer_nav){
                    ?>
                    <div class="column column-6 column-sm-12">
                        <div class="site-footer-menu">
                            <?php wp_nav_menu(array(
                                'theme_location' => 'footer-menu',
                                'container_class' => 'footer-navigation',
                                'fallback_cb' => false,
                                'depth' => 1,
                                'menu_class' => false
                            ) )?>
                        </div>
                    </div>

                    <?php
                }
                ?>
            </div>
        </div>
    </div>
    <?php
}
