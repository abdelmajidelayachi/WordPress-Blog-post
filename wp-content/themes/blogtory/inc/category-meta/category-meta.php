<?php
/*Category add form fields*/
if(!function_exists('blogtory_add_category_fields')):
    function blogtory_add_category_fields() {
        ?>
        <div class="form-field term-color-wrap">
            <label for="term-colorpicker"><?php _e( 'Category Color', 'blogtory' ); ?></label>
            <input name="category_color" class="colorpicker" id="term-colorpicker" />
            <p><?php _e('Select color for this category that will be displayed on the front end on many sections.','blogtory');?></p>
        </div>
        <?php
    }
endif;
add_action( 'category_add_form_fields', 'blogtory_add_category_fields'  );

/*Category edit form fields*/
if(!function_exists('blogtory_edit_category_fields')):
    function blogtory_edit_category_fields($term) {

        $color = get_term_meta( $term->term_id, 'category_color', true );
        ?>
        <tr class="form-field term-color-wrap">
            <th scope="row"><label for="term-colorpicker"><?php _e( 'Category Color', 'blogtory' ); ?></label></th>
            <td>
                <input name="category_color" value="<?php echo esc_attr($color); ?>" class="colorpicker" id="term-colorpicker" />
                <p class="description"><?php _e('Select color for this category that will be displayed on the front end on many sections.','blogtory');?></p>
            </td>
        </tr>
        <?php
    }
endif;
add_action( 'category_edit_form_fields', 'blogtory_edit_category_fields' , 10 );

/*Save Category fields*/
if(!function_exists('blogtory_save_category_fields')):
    function blogtory_save_category_fields($term_id) {

        if ( isset( $_POST['category_color'] ) && ! empty( $_POST['category_color']) ) {
            update_term_meta( $term_id, 'category_color', sanitize_hex_color( $_POST['category_color'] ) );
        }else{
            delete_term_meta( $term_id, 'category_color' );
        }
    }
endif;
add_action( 'created_category', 'blogtory_save_category_fields' , 10, 3 );
add_action( 'edited_category', 'blogtory_save_category_fields' , 10, 3 );

/* Category Image Js */
if(!function_exists('blogtory_admin_post_cat_js')):
    function blogtory_admin_post_cat_js($hook){
        if($hook != 'edit-tags.php' && $hook != 'term.php') {
            return;
        }
        
        wp_enqueue_style( 'wp-color-picker' );
        wp_enqueue_script( 'wp-color-picker' );

        wp_enqueue_script( 'post_cat_js', get_template_directory_uri().'/inc/category-meta/category.js','','',true );
    }
endif;
add_action( 'admin_enqueue_scripts', 'blogtory_admin_post_cat_js' );