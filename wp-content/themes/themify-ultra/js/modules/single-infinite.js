/* Themify Single Infinite Scroll*/
(function ($,Themify ) {
	'use strict';
        let isRemoved=false;
        const content=document.getElementById('body');
        if(content){
                const getCss=function(doc){
                        const vars = doc.getElementById('tf_infinity_css');
                        if(vars){
                                const temp = doc.createElement('div');
                                temp.appendChild(vars.content);
                                return JSON.parse(temp.innerHTML);
                        }
                        return {};
                };
                const loadedCss={},
                css=getCss(document);
                for(let i in css){
                        if(!css[i].m){
                                loadedCss[i]=true;
                        }
                }
                $(content).on('infinitebeforeloaded.themify',function(e, doc){

					/* prevent duplicate "id" attributes in the #commentform */
					var $doc = $( doc );
					if ( $doc.find( '#commentform' ).length ) {
						var post_id = $doc.find( 'input[name="comment_post_ID"]' ).val();
						$.each( [ 'comment', 'author', 'email', 'url' ], function( i, v ) {
							$doc.find( '#' + v ).attr( 'id', v + '-' + post_id );
							$doc.find( 'label[for="' + v + '"]' ).attr( 'for', v + '-' + post_id );
						} );
					}

                        if(isRemoved===false){
                                isRemoved=true;
                                Themify.body[0].classList.remove('content-right','content-left','sidebar2','sidebar1','single-split-layout','sidebar-none');
                        }
                        const vals = getCss(doc),
                                len=Object.keys(vals).length,
                                item=doc.getElementsByClassName('tf_single_scroll_wrap')[0];
                        if(item){
                                item.classList.add('tf_opacity');
                                let found = false,
                                        j=0;
                                for(let i in vals){
                                        if(!loadedCss[i] && !vals[i].m){
                                                loadedCss[i]=true;
                                                found=true;
                                                Themify.LoadCss(vals[i].s,vals[i].v,null,null,function(){
                                                        if(j===len){
                                                                item.classList.remove('tf_opacity');
                                                        }
                                                });
                                        }
                                        ++j;
                                }
                                if(found===false){
                                        item.classList.remove('tf_opacity');
                                }
                        }
                });
                Themify.infinity(content,{
                        id:'#body',
                        scrollThreshold:true,
                        history:true
                });
        }

})(jQuery,Themify);
