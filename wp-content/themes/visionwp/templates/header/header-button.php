<?php
/**
 * Template for header button
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */ 
$contact_new_tab = esc_html( visionwp_get ( 'header_btn_target' ) );
    if( $contact_new_tab) :
        $style = 'target="_blank" ';
    else :
        $style = '';
    endif;
?>
<div class="visionwp-site-button visionwp-header-button">
    <a href="<?php echo esc_html(visionwp_get( 'header_btn_link' ) ) ; ?>" target="<?php echo esc_html( $contact_new_tab ); ?>" class="visionwp-primary-button"> <?php  echo esc_html( visionwp_get( 'button_options' ) ); ?> </a>
</div>