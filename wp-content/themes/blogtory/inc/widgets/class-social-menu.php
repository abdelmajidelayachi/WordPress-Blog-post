<?php

if (!defined('ABSPATH')) {
    exit;
}

class Blogtory_Social_Menu extends Blogtory_Widget_Base
{

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->widget_cssclass = 'blogtory widget_social_menu';
        $this->widget_description = __("Displays social menu if you have set it(social menu)", 'blogtory');
        $this->widget_id = 'blogtory_social_menu';
        $this->widget_name = __('BT: Social Menu', 'blogtory');
        $this->settings = array(
            'title' => array(
                'type' => 'text',
                'label' => __('Title', 'blogtory'),
            ),
        );

        parent::__construct();
    }

    /**
     * Output widget.
     *
     * @see WP_Widget
     *
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance)
    {
        ob_start();

        $this->widget_start($args, $instance);

        do_action( 'blogtory_before_social_menu');

        ?>
        <div class="blogtory_social_menu_widget social-widget-menu">
            <?php

            if ( has_nav_menu( 'social-menu' ) ) {
                wp_nav_menu(array(
                    'theme_location' => 'social-menu',
                    'link_before' => '<span class="screen-reader-text">',
                    'link_after' => '</span>',
                    'fallback_cb' => false,
                    'depth' => 1,
                    'menu_class' => false
                ) );
            }else{
                esc_html_e( 'Social menu is not set. You need to create menu and assign it to Social Menu on Menu Settings.', 'blogtory' );

            }
            ?>
        </div>
        <?php

        do_action( 'blogtory_after_social_menu');

        $this->widget_end($args);

        echo ob_get_clean();
    }
}