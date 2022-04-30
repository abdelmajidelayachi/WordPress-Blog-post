<?php
/**
 * Additional Sidebar Template
 * @package themify
 * @since 1.0.0
 */

themify_sidebar_alt_before(); //hook ?>

<aside id="sidebar-alt" itemscope="itemscope" itemtype="https://schema.org/WPSideBar">

	<?php themify_sidebar_alt_start(); // hook ?>

	<?php dynamic_sidebar('sidebar-alt'); ?>

	<?php themify_sidebar_alt_end(); // hook ?>

</aside>

<?php themify_sidebar_alt_after(); // hook ?>