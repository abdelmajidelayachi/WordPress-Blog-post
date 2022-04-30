<?php
/**
 * Wrapper class for Create Custom Fields
 * 
 * @since 1.0.0
 * 
 * @package VisionWP WordPress Theme
 */
if( !class_exists( 'VisionWP_CCF' ) ){
    class VisionWP_CCF{

        public $post_type = null;

        public function __construct( $post_type ){

            if( empty( $post_type ) || !$this->is_compatable() ){
                return;
            }

            $this->post_type = new Rise_Blocks_Custom_Fields\Post_Type( $post_type );
        }

        public function is_compatable(){
            return class_exists( 'Rise_Blocks_Custom_Fields\Post_Type' );
        }

        public function add_metabox( $fields ){
            if( $this->post_type ){
                $this->post_type->add_fields( esc_html__( 'Vision WP Options', 'visionwp' ), $fields );
            }
        }
    }
}