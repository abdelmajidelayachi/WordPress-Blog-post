;( function(doc) {
    'use strict';
    /* loading spinner icon */
    window.addEventListener( 'load', () => {
            const links = doc.querySelectorAll( 'a[href="#tb_builder_page"]' ),
                    spinner = doc.createElement( 'div' ),
                    style = doc.createElement( 'style' );
            spinner.style.display = 'none';
            spinner.className= 'tbbp_spinner';
            style.innerText = ".tbbp_spinner{margin:-20px 0 0 -20px;width:62px;height:62px;background-color:rgba(0,0,0,.6);border-radius:50%;box-sizing:border-box;position:fixed;top:50%;left:50%;z-index:100001;line-height:62px}.tbbp_spinner:before{width:80%;height:80%;border:5px solid transparent;border-top-color:#fff;border-radius:50%;box-sizing:border-box;position:absolute;top:10%;left:10%;content:'';animation:circle-loader 1.4s infinite linear}@keyframes circle-loader{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}";
            doc.body.appendChild( style );
            doc.body.appendChild( spinner );
            for ( let i = links.length-1;i>-1; --i) {
                    links[ i ].addEventListener( 'click', ( e ) => {
                            e.preventDefault();
                            if ( window.ThemifyBuilderPage ) {
                                    ThemifyBuilderPage.showPanel();
                            } else {
                                    spinner.style.display = 'block';
                                    let script = doc.createElement( 'script' );
                                    script.onload = function() {
                                            ThemifyBuilderPage.spinner = spinner;
                                            ThemifyBuilderPage.run();
                                    };
                                    script.src = tbBuilderPage.script;
                                    doc.body.appendChild( script );
                            }
                    } );
            }
    }, { passive: true } );
} )(document);