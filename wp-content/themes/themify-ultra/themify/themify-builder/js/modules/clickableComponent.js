((Themify) =>{

    Themify.on( 'builder_load_module_partial', ( el, type, isLazy)=>{
        if ( Themify.is_builder_active || ( isLazy === true && ! el[0].dataset.tb_link ) ) {
            return;
        }
        const items = Themify.selectWithParent( '[data-tb_link]', el );
        for ( let i = items.length-1; i > -1; --i ) {

			items[i].addEventListener( 'click', function( e ){
				if ( e.target.tagName === 'A' || e.target.closest( 'a' ) ) {
					return;
				}
				e.preventDefault();
				e.stopPropagation();
				const link = document.createElement('a');
				link.href = this.dataset.tb_link;
				link.click();
			} );

		}
	} );

})(Themify);
