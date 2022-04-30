<?php
/**
 * Template for Main Sidebar
 * @package themify
 * @since 1.0.0
 */
?>
<?php if(!post_password_required()):?>
    <?php themify_sidebar_before(); // hook ?>

    <aside id="sidebar" class="tf_box" itemscope="itemscope" itemtype="https://schema.org/WPSidebar">

        <?php themify_sidebar_start(); // hook 

	dynamic_sidebar( 'sidebar-main' ); 

        themify_sidebar_end(); // hook ?>

    </aside>
    <!-- /#sidebar -->

    <?php themify_sidebar_after(); // hook ?>
<?php endif;