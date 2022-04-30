<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Blogtory
 */

$page_layout = blogtory_get_page_layout();
if( 'no-sidebar' != $page_layout ){
    ?>
    <div id="secondary" class="sidebar-area style_1 be-left">
        <div class="theiaStickySidebar">
            <?php
            if(is_front_page()){
                if( is_active_sidebar( 'home-page-sidebar' ) ) {
                    ?>
                    <aside class="widget-area">
                        <?php dynamic_sidebar('home-page-sidebar'); ?>
                    </aside>
                    <?php
                }
            }else{
                if(is_active_sidebar('sidebar-1')){
                    ?>
                    <aside class="widget-area">
                        <?php dynamic_sidebar( 'sidebar-1' ); ?>
                    </aside>
                    <?php
                }
            }
            ?>
        </div>
    </div>
    <?php
}