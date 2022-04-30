<?php
/*Register custom section and control types for upselling.*/
$wp_customize->register_section_type( 'Blogtory_Customize_Section_Upsell' );

/*Register sections.*/
$wp_customize->add_section(
    new Blogtory_Customize_Section_Upsell(
        $wp_customize,
        'theme_upsell',
        array(
            'title'    => esc_html__( 'Blogtory Pro', 'blogtory' ),
            'pro_text' => esc_html__( 'Buy Pro', 'blogtory' ),
            'pro_url'  => 'https://unfoldwp.com/products/blogtory-pro/',
            'priority'  => 1,
        )
    )
);