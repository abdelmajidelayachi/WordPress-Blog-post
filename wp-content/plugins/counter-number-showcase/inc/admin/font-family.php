<select name="font_family" id="font_family" class="standard-dropdown" onchange="get_font_group()"  style="width:100%" >
	<optgroup label="Default Fonts">
		<option value="Arial"       <?php if($font_family == 'Arial' ) { echo "selected"; } ?>><?php esc_html_e('Arial',wpshopmart_cns_text_domain); ?></option>
		<option value="Arial Black" <?php if($font_family == 'Arial Black' ) { echo "selected"; } ?>><?php esc_html_e('Arial Black',wpshopmart_cns_text_domain); ?></option>
		<option value="Courier New" <?php if($font_family == 'Courier New' ) { echo "selected"; } ?>><?php esc_html_e('Courier New',wpshopmart_cns_text_domain); ?></option>
		<option value="Georgia"     <?php if($font_family == 'Georgia' ) { echo "selected"; } ?>><?php esc_html_e('Georgia',wpshopmart_cns_text_domain); ?></option>
		<option value="Grande"      <?php if($font_family == 'Grande' ) { echo "selected"; } ?>><?php esc_html_e('Grande',wpshopmart_cns_text_domain); ?></option>
		<option value="Helvetica" 	<?php if($font_family == 'Helvetica' ) { echo "selected"; } ?>><?php esc_html_e('Helvetica Neue',wpshopmart_cns_text_domain); ?></option>
		<option value="Impact"         <?php if($font_family == 'Impact' ) { echo "selected"; } ?>><?php esc_html_e('Impact',wpshopmart_cns_text_domain); ?></option>
		<option value="Lucida"         <?php if($font_family == 'Lucida' ) { echo "selected"; } ?>><?php esc_html_e('Lucida',wpshopmart_cns_text_domain); ?></option>
		<option value="Lucida Grande"  <?php if($font_family == 'Lucida Grande' ) { echo "selected"; } ?>><?php esc_html_e('Lucida Grande',wpshopmart_cns_text_domain); ?></option>
		<option value="Open Sans"      <?php if($font_family == 'Open Sans' ) { echo "selected"; } ?>><?php esc_html_e('Open Sans',wpshopmart_cns_text_domain); ?></option>
		<option value="OpenSansBold"   <?php if($font_family == 'OpenSansBold' ) { echo "selected"; } ?>><?php esc_html_e('OpenSansBold',wpshopmart_cns_text_domain); ?></option>
		<option value="Palatino Linotype" <?php if($font_family == 'Palatino Linotype' ) { echo "selected"; } ?>><?php esc_html_e('Palatino',wpshopmart_cns_text_domain); ?></option>
		<option value="Sans"           <?php if($font_family == 'Sans' ) { echo "selected"; } ?>><?php esc_html_e('Sans',wpshopmart_cns_text_domain); ?></option>
		<option value="sans-serif"     <?php if($font_family == 'sans-serif' ) { echo "selected"; } ?>><?php esc_html_e('Sans-Serif',wpshopmart_cns_text_domain); ?></option>
		<option value="Tahoma"         <?php if($font_family == 'Tahoma' ) { echo "selected"; } ?>><?php esc_html_e('Tahoma',wpshopmart_cns_text_domain); ?></option>
		<option value="Times New Roman" <?php if($font_family == 'Times New Roman' ) { echo "selected"; } ?>><?php esc_html_e('Times New Roman',wpshopmart_cns_text_domain); ?></option>
		<option value="Trebuchet"      <?php if($font_family == 'Trebuchet' ) { echo "selected"; } ?>><?php esc_html_e('Trebuchet',wpshopmart_cns_text_domain); ?></option>
		<option value="Verdana"        <?php if($font_family == 'Verdana' ) { echo "selected"; } ?>><?php esc_html_e('Verdana',wpshopmart_cns_text_domain); ?></option>
	</optgroup>
</select>