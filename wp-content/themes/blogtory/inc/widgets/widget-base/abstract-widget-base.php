<?php

/**
 * Abstract Base widget class that can be used to create widgets
 *
 * @author   Unfoldwp
 * @category Widgets
 *
 * @since 1.0.0
 *
 * @extends  WP_Widget
 */
abstract class Blogtory_Widget_Base extends WP_Widget {

    /**
     * CSS class.
     *
     * @var string
     */
    public $widget_cssclass;

    /**
     * Widget description.
     *
     * @var string
     */
    public $widget_description;

    /**
     * Widget ID.
     *
     * @var string
     */
    public $widget_id;

    /**
     * Widget name.
     *
     * @var string
     */
    public $widget_name;

    /**
     * Settings.
     *
     * @var array
     */
    public $settings;

    /**
     * Attributes.
     *
     * @var array
     */
    public $attrs;

    /**
     * Constructor.
     */
    public function __construct() {

        $widget_ops = array(
            'classname'   => $this->widget_cssclass,
            'description' => $this->widget_description,
            'customize_selective_refresh' => true,
        );

        $this->attrs = apply_filters( 'blogtory_widget_base_attr_arr', array(
                'type' => 'text',
                'class' => '',
                'wrapper_class' => '',
                'label' => '',
                'css' => '',
                'std' => '',
                'min' => 1,
                'max' => 10,
                'step' => 1,
                'rows' => 4,
                'placeholder' => '',
                'options' => '',
                'desc' => '',
                'separator' => false,
                'readonly' => false,
                'args' => array(),
            )
        );

        parent::__construct( $this->widget_id, $this->widget_name, $widget_ops );

        /*Load Require Styles and scripts*/
        add_action('admin_enqueue_scripts', array($this,'blogtory_widget_scripts'));
        /**/

    }

    /**
     * Output the html at the start of a widget.
     *
     * @param array $args
     * @param array $instance
     */
    public function widget_start( $args, $instance ) {
        echo $args['before_widget'];

        if ( $title = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base ) ) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
    }

    /**
     * Output the html at the end of a widget.
     *
     * @param  array $args
     */
    public function widget_end( $args ) {
        echo $args['after_widget'];
    }


    /**
     * Updates a particular instance of a widget.
     *
     * @see    WP_Widget->update
     * @param  array $new_instance
     * @param  array $old_instance
     * @return array
     */
    public function update( $new_instance, $old_instance ) {
        $instance = $old_instance;
        if ( empty( $this->settings ) ) {
            return $instance;
        }

        // Loop settings and get values to save.
        foreach ( $this->settings as $key => $setting ) {
            if ( ! isset( $setting['type'] ) ) {
                continue;
            }

            switch ( $setting['type'] ) {
                case 'text':
                    $instance[$key] = sanitize_text_field( $new_instance[ $key ] );
                    break;
                case 'url':
                    $instance[$key] = esc_url_raw( $new_instance[ $key ] );
                    break;
                case 'email':
                    $instance[$key] = sanitize_email( $new_instance[ $key ] );
                    break;
                case 'number':
                    $instance[ $key ] = absint( $new_instance[ $key ] );
                    if ( isset( $setting['min'] ) && '' !== $setting['min'] ) {
                        $instance[ $key ] = max( $instance[ $key ], $setting['min'] );
                    }
                    if ( isset( $setting['max'] ) && '' !== $setting['max'] ) {
                        $instance[ $key ] = min( $instance[ $key ], $setting['max'] );
                    }
                    break;
                case 'checkbox':
                    $instance[ $key ] = empty( $new_instance[ $key ] ) ? 0 : 1;
                    break;
                case 'select':
                case 'radio':
                    $input = $new_instance[ $key ];
                    $choices = $setting['options'];
                    $instance[$key] = array_key_exists( $input, $choices ) ? $input : $setting['std'];
                    break;
                case 'textarea':
                    $instance[ $key ] = wp_kses( trim( wp_unslash( $new_instance[ $key ] ) ), wp_kses_allowed_html( 'post' ) );
                    break;
                case 'color':
                    $instance[$key] = sanitize_hex_color( $new_instance[ $key ] );
                    break;
                case 'image':
                    $instance[$key] = absint( $new_instance[ $key ] );
                    break;
                case 'dropdown-pages':
                    $page_id = absint( $new_instance[ $key ] );
                    $instance[$key] = ( 'page' === get_post_type( $page_id ) && 'publish' === get_post_status( $page_id ) ) ? $page_id : $setting['std'];
                    break;
                case 'dropdown-taxonomies':
                    $instance[$key] = ( -1 == $new_instance[ $key ] ) ? -1 : absint( $new_instance[ $key ] );
                    break;
                case 'multi-select':
                    $output = array();
                    $input = $new_instance[ $key ];
                    $choices = $setting['options'];
                    foreach ($input as $k => $v){
                        if( array_key_exists( $v, $choices ) ){
                            $output[] = $v;
                        }
                    }
                    $instance[$key] = $output;
                    break;
                case 'multi-checkbox':
                    $output = array();
                    $input = $new_instance[ $key ];
                    $choices = $setting['options'];
                    foreach ($input as $k => $v){
                        if( array_key_exists( $v, $choices ) ){
                            $output[] = $v;
                        }
                    }
                    $instance[$key] = $output;
                    break;
                default:
                    $instance[ $key ] = sanitize_text_field( $new_instance[ $key ] );
                    break;
            }

            /**
             * Sanitize the value of a setting.
             */
            $instance[ $key ] = apply_filters( 'blogtory_widget_settings_sanitize_option', $instance[ $key ], $new_instance, $key, $setting );
        }

        return $instance;
    }

    /**
     * Output the Back-end widget form.
     *
     * @param array $instance Current settings.
     *
     * @return void
     */
    public function form($instance) {

        if ( empty( $this->settings ) ) {
            return;
        }

        foreach ($this->settings as $key => $setting) {
            $attr = array_merge($this->attrs, $setting);
            $value = isset( $instance[ $key ] ) ? $instance[ $key ] : $attr['std'];

            $desc = $separator = '';
            if( $attr['desc'] ) {
                $desc = '<span style="clear:both;display:block;"><em>'.esc_html($attr['desc']).'</em></span>';
            }
            if( $attr['separator'] ) {
                $separator = '<hr style="border:1px #CCC solid;"/>';
            }

            switch ( $setting['type'] ) {
                case 'text':
                case 'url':
                case 'email':
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) );?>">
                            <span class="field-label">
                                <?php echo esc_html( $attr['label'] ); ?>
                            </span>
                            </label>
                            <input
                                    class="widefat <?php echo esc_attr( $attr['class'] ); ?>"
                                    id="<?php echo esc_attr( $this->get_field_id( $key ) ) ?>"
                                    name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>"
                                    type="<?php echo esc_attr( $setting['type'] ); ?>"
                                    value="<?php echo esc_attr( $value ); ?>"
                                    style="<?php echo esc_attr( $attr['css'] ); ?>"
                                    placeholder="<?php echo esc_attr( $attr['placeholder'] ); ?>"
                                <?php echo ( true === $attr['readonly'] ) ? ' readonly ' : '' ; ?>
                            />
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'number':
                    $value = $value ? absint($value) : absint( $attr['min'] );
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label">
                                    <?php echo esc_html( $attr['label'] ); ?>
                                </span>
                            </label>
                            <input
                                    type="number"
                                    id="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>"
                                    name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>"
                                    value="<?php echo esc_attr( $value ); ?>"
                                    class="widefat <?php echo esc_attr( $attr['class'] ); ?>"
                                    style="<?php echo esc_attr( $attr['css'] ); ?>"
                                    min="<?php echo esc_attr( $attr['min'] ); ?>"
                                    max="<?php echo esc_attr( $attr['max'] ); ?>"
                                    step="<?php echo esc_attr( $attr['step'] ); ?>"
                                <?php echo ( true === $attr['readonly'] ) ? ' readonly ' : '' ; ?>
                            />
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'checkbox':
                    $value = $value ? (bool) $value : false;
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <input type="checkbox"
                                   class="checkbox <?php echo esc_attr( $attr['class'] ); ?>"
                                   id="<?php echo esc_attr( $this->get_field_id( $key ) ) ?>"
                                   name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>"
                                   value="1"
                                <?php checked( $value, 1 ); ?>
                                <?php echo ( true === $attr['readonly'] ) ? ' disabled="disabled"  ' : '' ; ?>
                            />
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) );?>">
                                <span class="field-label">
                                    <?php echo esc_html( $attr['label'] ); ?>
                                </span>
                            </label>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'radio':
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label">
                                    <?php echo esc_html( $attr['label'] ); ?>
                                </span>
                            </label><br/>
                            <?php if ( ! empty( $attr['options'] ) ) : ?>
                                <?php foreach ( $attr['options'] as $k => $v ) : ?>
                                    <label for="<?php echo esc_attr( $this->get_field_id( $key ) . '-' . $k ); ?>">
                                        <input type="radio" name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( $key ) . '-' . $k ); ?>" value="<?php echo esc_attr( $k ); ?>" <?php checked( $k, $value ) ?> <?php echo ( true === $attr['readonly'] ) ? ' disabled="disabled"  ' : '' ; ?>/>
                                        <?php echo esc_html( $v ); ?>
                                    </label>&nbsp;&nbsp;
                                <?php endforeach; ?>
                            <?php endif ?>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'select':
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label">
                                    <?php echo esc_html( $attr['label'] ); ?>
                                </span>
                            </label>
                            <select
                                    id="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>"
                                    name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>"
                                    class="widefat <?php echo esc_attr( $attr['class'] ); ?>"
                                    style="<?php echo esc_attr( $attr['css'] ); ?>"
                                <?php echo ( true === $attr['readonly'] ) ? ' disabled ' : '' ; ?>
                            >
                                <?php if ( ! empty( $attr['options'] ) ) : ?>
                                    <?php foreach ( $attr['options'] as $option_key => $label ) : ?>
                                        <option value="<?php echo esc_attr( $option_key ); ?>" <?php selected( $option_key, $value ); ?>><?php echo esc_html( $label ); ?></option>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'textarea':
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label">
                                    <?php echo esc_html( $attr['label'] ); ?>
                                </span>
                            </label><br/>
                            <textarea
                                    rows="<?php echo absint( $attr['rows'] ); ?>"
                                    id="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>"
                                    name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>"
                                    class="widefat <?php echo esc_attr( $attr['class'] ); ?>"
                                    style="<?php echo esc_attr( $attr['css'] ); ?>"
                                    placeholder="<?php echo esc_attr( $attr['placeholder'] ); ?>"
                                <?php echo ( true === $attr['readonly'] ) ? ' readonly ' : '' ; ?>
                            ><?php echo esc_textarea( $value ); ?></textarea>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'color':
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label"><?php echo esc_html( $attr['label'] ); ?></span>
                            </label>
                            <input
                                    type="text"
                                    id="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>"
                                    name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>"
                                    value="<?php echo esc_attr( $value ); ?>"
                                    class="color-picker <?php echo esc_attr( $attr['class'] ); ?>"
                                <?php echo ( isset( $attr['std'] ) ) ? ' data-default-color="' . esc_attr( $attr['std'] ). '" ' : '' ; ?>
                            />
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'image':
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <div class="<?php echo esc_attr( $attr['class'] ); ?>" style="<?php echo esc_attr( $attr['css'] ); ?>">
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label"><?php echo esc_html( $attr['label'] ); ?></span>
                            </label><br/>
                            <?php $remove_button_style = ($value) ? 'display:inline-block' : 'display:none;';?>
                            <div class="image-field">
                                <div class="image-preview">
                                    <?php
                                    if ( ! empty( $value ) ) {
                                        $image_attributes = wp_get_attachment_image_src( $value );
                                        if($image_attributes){
                                            ?>
                                            <img src="<?php echo esc_url( $image_attributes[0] ); ?>" />
                                            <?php
                                        }
                                    }
                                    ?>
                                </div>
                                <p>
                                    <input type="hidden" class="img" name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>" value="<?php echo esc_attr( $value ); ?>" />
                                    <button type="button" class="upload_image_button button" data-uploader-title-txt="<?php esc_attr_e( 'Use Image', 'blogtory' ); ?>" data-uploader-btn-txt="<?php esc_attr_e( 'Choose an Image', 'blogtory' ); ?>">
                                        <?php _e( 'Upload/Add image', 'blogtory' ); ?>
                                    </button>
                                    <button type="button" class="remove_image_button button" style="<?php echo esc_attr($remove_button_style);?>"><?php _e( 'Remove image', 'blogtory' ); ?></button>
                                </p>
                            </div>
                        </div>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'heading':
                    $css = 'text-align:center;background-color:#f1f1f1;padding:5px 0;margin-top:5px;';
                    if ( ! empty( $attr['css'] ) ) {
                        $css = $attr['css'];
                    }
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <h4 class="widefat <?php echo esc_attr( $attr['class'] ); ?>" style="<?php echo esc_attr( $css ); ?>">
                            <span class="field-label"><strong><?php echo esc_html( $attr['label'] ); ?></strong></span>
                        </h4>
                        <?php echo wp_kses_post($separator);?>
                    </div>
                    <?php
                    break;

                case 'subtitle':
                    $css = 'padding:10px 0;color:#797b7d;';
                    if ( ! empty( $attr['css'] ) ) {
                        $css = $attr['css'];
                    }
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <span class="widefat <?php echo esc_attr( $attr['class'] ); ?>" style="<?php echo esc_attr( $css ); ?>">
                            <em><?php echo '( '. esc_html( $attr['label'] ). ' )'; ?></em>
                        </span>
                        <?php echo wp_kses_post($separator);?>
                    </div>
                    <?php
                    break;

                case 'message':
                    $css = 'padding:10px 0;';
                    if ( ! empty( $attr['css'] ) ) {
                        $css = $attr['css'];
                    }
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <div class="widefat field-message <?php echo esc_attr( $attr['class'] ); ?>" style="<?php echo esc_attr( $css ); ?>">
                            <?php echo wp_kses_data( $attr['label'] ); ?>
                        </div>
                        <?php echo wp_kses_post($separator);?>
                    </div>
                    <?php
                    break;

                case 'dropdown-taxonomies':
                    $args = $attr['args'];
                    $args['selected'] = esc_attr( $value );
                    $args['name'] = esc_attr( $this->get_field_name( $key ) );
                    $args['id'] = esc_attr( $this->get_field_id( $key ) );
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label"><?php echo esc_html( $attr['label'] ); ?></span>
                            </label>
                            <?php wp_dropdown_categories( $args ); ?>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'dropdown-pages':
                    $args = $attr['args'];
                    $args['selected'] = esc_attr($value);
                    $args['name'] = esc_attr( $this->get_field_name( $key ) );
                    $args['id'] = esc_attr( $this->get_field_id( $key ) );
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label"><?php echo esc_html( $attr['label'] ); ?></span>
                            </label>
                            <?php wp_dropdown_pages( $args ); ?>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'multi-select':
                    if(empty($value)){
                        $value = array();
                    }
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <p>
                            <label for="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>">
                                <span class="field-label">
                                    <?php echo esc_html( $attr['label'] ); ?>
                                </span>
                            </label>
                            <?php if ( ! empty( $attr['options'] ) ) : ?>
                                <select multiple
                                        id="<?php echo esc_attr( $this->get_field_id( $key ) ); ?>"
                                        name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>[]"
                                        class="widefat <?php echo esc_attr( $attr['class'] ); ?>"
                                        style="<?php echo esc_attr( $attr['css'] ); ?>"
                                    <?php echo ( true === $attr['readonly'] ) ? ' disabled ' : '' ; ?>
                                    >
                                        <?php
                                        foreach ( $attr['options'] as $option_key => $label ) :
                                            $isSelected = in_array( $option_key, $value ) ? "selected='selected'" : "";
                                            ?>
                                            <option value="<?php echo esc_attr( $option_key ); ?>" <?php echo esc_html($isSelected); ?>><?php echo esc_html( $label ); ?></option>
                                        <?php endforeach; ?>
                                </select>
                            <?php endif; ?>
                        </p>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                case 'multi-checkbox':
                    if(empty($value)){
                        $value = array();
                    }
                    ?>
                    <div class="<?php echo esc_attr( $attr['wrapper_class'] );?>">
                        <span><?php echo esc_html( $attr['label'] ); ?></span>
                        <?php if(!empty($attr['options'])):?>
                            <ul>
                                <?php
                                $i = 1;
                                foreach ($attr['options'] as $option_key => $label ){
                                    $id = $this->get_field_id( $key ).'-'.$i;
                                    $isChecked = in_array( $option_key, $value ) ? "checked='checked'" : "";
                                    ?>
                                    <li>
                                        <label for="<?php echo esc_attr( $id );?>">
                                            <input type="checkbox"
                                                   class="checkbox <?php echo esc_attr( $attr['class'] ); ?>"
                                                   id="<?php echo esc_attr( $id ) ?>"
                                                   name="<?php echo esc_attr( $this->get_field_name( $key ) ); ?>[]"
                                                   value="<?php echo esc_attr( $option_key ) ?>"
                                                    <?php echo esc_html($isChecked); ?>
                                            />
                                            <?php echo esc_html( $label ); ?>
                                        </label>
                                    </li>
                                    <?php
                                    $i++;
                                }
                                ?>
                            </ul>
                        <?php endif;?>
                        <?php
                        echo wp_kses_post($desc);
                        echo wp_kses_post($separator);
                        ?>
                    </div>
                    <?php
                    break;

                default:
                    do_action( 'blogtory_widget_field_' . $setting['type'], $key, $value, $setting, $instance );
                    break;
            }
        }
    }

    /**
     * Enqueues necessary css and js files
     *
     * @param string $hook
     * @return void
     */
    public function blogtory_widget_scripts($hook){
        if ('widgets.php' === $hook) {
            wp_enqueue_style( 'wp-color-picker' );
            wp_enqueue_media();
            wp_enqueue_script('blogtory_widgets', get_template_directory_uri() . '/inc/widgets/widget-base/js/widgets.js', array('jquery','wp-color-picker'), '1.0.0', true);
        }
    }

}