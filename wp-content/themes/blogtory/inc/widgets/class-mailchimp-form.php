<?php

if (!defined('ABSPATH')) {
    exit;
}

class Blogtory_Mailchimp_Form extends Blogtory_Widget_Base
{

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->widget_cssclass = 'blogtory widget_mailchimp_form';
        $this->widget_description = __("Displays MailChimp form if you have any", 'blogtory');
        $this->widget_id = 'blogtory_mailchimp_form';
        $this->widget_name = __('BT: MailChimp Form', 'blogtory');
        $this->settings = array(
            'title' => array(
                'type' => 'text',
                'label' => __('Title', 'blogtory'),
            ),
            'desc' => array(
                'type' => 'textarea',
                'label' => __('Description', 'blogtory'),
                'rows' => 10,
            ),
            'form_shortcode' => array(
                'type' => 'text',
                'label' => __('MailChimp Form Shortcode', 'blogtory'),
            ),
            'msg' => array(
                'type' => 'message',
                'label' => sprintf( __( 'You can edit your sign-up form in the <a href="%s">MailChimp for WordPress form settings</a>.', 'blogtory' ), admin_url( 'admin.php?page=mailchimp-for-wp-forms' )),
                'separator' => true,
            ),
            'bg_image'  => array(
                'type'  => 'image',
                'label' => __( 'Background Image', 'blogtory' ),
                'desc' => __( 'Don\'t upload any image if you do not want to show the background image.', 'blogtory' ),
            ),
            'bg_img_padding' => array(
                'type' => 'number',
                'step' => 1,
                'min' => 0,
                'max' => 200,
                'std' => 60,
                'label' => __('Background Image padding', 'blogtory'),
            ),
            'enable_bg_overlay' => array(
                'type' => 'checkbox',
                'label' => __('Enable Image Overlay', 'blogtory'),
                'std' => true,
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
        if (!empty($instance['form_shortcode'])) {

            ob_start();

            $img_div = $class = $bg_img_padding = '';

            $this->widget_start($args, $instance);

            /*Background Image*/
            if($instance['bg_image'] && 0 != $instance['bg_image']){
                $image_url = wp_get_attachment_url($instance['bg_image']);
                if($image_url){

                    $bg_img_padding = 'padding:'.absint($instance['bg_img_padding']).'px 0px';

                    $class = 'be-bg-image';
                    if ($instance['enable_bg_overlay'] == 1) {
                        $class .= ' bg-overlay';
                    }
                    $img_div = '<img src="'.esc_url($image_url).'">';
                }
            }

            do_action( 'blogtory_before_mailchimp');

            ?>
            <div class="blogtory_mailchimp <?php echo esc_attr($class);?>" style="<?php echo esc_attr($bg_img_padding)?>">
                <?php echo wp_kses_post($img_div);?>
                <div class="unfold-desc-wrapper">
                    <?php
                    if ($instance['desc']) {
                        echo wpautop(wp_kses_post($instance['desc']));
                    }
                    ?>
                </div>
                <?php echo do_shortcode($instance['form_shortcode']); ?>
            </div>

            <?php

            do_action( 'blogtory_after_mailchimp');

            $this->widget_end($args);

            echo ob_get_clean();
        }
    }
}