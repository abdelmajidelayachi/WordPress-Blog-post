(function ($) {

    function visionwploadMorePosts() {
        var page = 2;
        jQuery( document ).on( 'click', 'a.visionwp-load-more', function( e ) {
            e.preventDefault();
            var button = jQuery(this);
            var load_more_text = $( this ).text();
            var max_num_pages = $( this ).data( 'maxpage' );
            jQuery.ajax({
                type: 'POST',
                url: VISIONWPLOADMORE.admin_url,
                data: {
                    nonce: VISIONWPLOADMORE.nonce,
                    action: 'view_more_posts',
                    query: VISIONWPLOADMORE.posts,
                    page: page,
                },  
                beforeSend: function() {
                    button.html( '<i class="fa fa-spinner fa-spin"></i>&nbsp; Loading' );
                },
                success:function( data ) {
                    if( data ) {
                        jQuery( "#visionwp-main-content" ).append( data );
                        $( button ).text( load_more_text );            
                        if( page == max_num_pages ) {
                            button.remove();
                        }                    
                        page++;
                    } else {
                        button.remove();
                    }
                }
            });
        });
    }
    
    // mobile menu plugin
    const classToggler = function (param) {

        this.animation = param.animation,
            this.toggler = param.toggler,
            this.className = param.className,
            this.exceptions = param.exceptions;

        this.init = function () {
            var that = this;
            // for stop propagation
            var stopToggler = this.implode(this.exceptions);
            if ( typeof stopToggler !== 'undefined' ) {
                $( document ).on('click', stopToggler, function (e) {
                    e.stopPropagation();
                });
            }

            // for toggle class
            var toggler = this.implode(this.toggler);
            if (typeof toggler !== 'undefined') {

                $(document).on('click', toggler, function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    that.toggle();
                });
            }
        }

        //class toggler
        this.toggle = function () {
            var selectors = this.implode(this.animation);
            if (typeof selectors !== 'undefined') {
                $(selectors).toggleClass(this.className);
                if ($(selectors).hasClass(this.className)) {
                    $('.visionwp-menu-list > li:first-child a').focus();
                } else {
                    $('#menu-icon').focus();
                }
            }
        }

        // array selector maker
        this.implode = function (arr, imploder) {

            // checking arg is array or not
            if (!(arr instanceof Array)) {
                return arr;
            }
            // setting default imploder
            if (typeof imploder == 'undefined') {
                imploder = ',';
            }

            // making selector
            var data = arr;
            var ele = '';
            for (var j = 0; j < arr.length; j++) {
                ele += arr[j];
                if (j !== arr.length - 1) {
                    ele += imploder;
                }
            }
            data = ele;
            return data;
        }
    } //End mobileMenu

    $.fn.visionwpMobileMenu = function (config) {

        /* defining default config*/
        var defaultConfig = {
            icon: '#menu-icon',
            closeIcon: true,
            overlay: true
        }
        $.extend(defaultConfig, config);
        var wrapperId = '#' + this.attr('id');
        if (!$(wrapperId).length) {
            console.error('Selected Element not found in DOM (Mobile menu plugin)');
            return this;
        }

        var _this = this;
        var shiftMenu = function () {

            var mobileMenuHTML = '<div>' + $(wrapperId).html() + '</div>',
                that = this;

            mobileMenuHTML = $(mobileMenuHTML).find('*').each(function (index, value) {
                var id = $(value).attr('id');
                if (id) {
                    $(value).attr('id', 'visionwp-' + id);
                }
            });

            /* constructor function */
            this.init = function () {
                $(document).ready(function () {
                    that.createMenu();
                    that.addDownArrow();
                    that.toggleSubUl();
                    that.menuToggler();
                    that.addClassOnFirstUl();
                });
            };

            this.createMenu = function () {
                var closeHTML = defaultConfig.closeIcon ? this.closeMenuIcon() : null,
                    overlayHTML = defaultConfig.overlay ? this.addOverlay() : null;
                $('body').append('<div class="visionwp-mobile-menu" id="visionwp-mobile-menu">' + closeHTML + '<ul class="visionwp-menu-list">' + mobileMenuHTML.html() + '</ul><button class="circular-focus screen-reader-text" data-goto=".visionwp-inner-box">Circular focus</button></div>' + overlayHTML)
            };

            this.closeMenuIcon = function () {
                return ('<div class="visionwp-close-wrapper"><button data-goto=".visionwp-menu-list > li:last-child a" class="circular-focus screen-reader-text">circular focus</button> <button tabindex="0" class="visionwp-inner-box" id="visionwp-close"><span class="screen-reader-text">close</span><span class="visionwp-inner"></span></button> </div>');
            };

            this.addOverlay = function () {
                return ('<div class="visionwp-mobile-menu-overlay"></div>');
            };

            this.addClassOnFirstUl = function () {
                if ($('#visionwp-mobile-menu ul').first().hasClass('menu') ) { } else {
                    $('#visionwp-mobile-menu ul').first().addClass('menu');
                }
            }

            this.addDownArrow = function () {
                var $mobileMenu = $('#visionwp-mobile-menu'),
                    $hasSubUl = $('#visionwp-mobile-menu .menu-item-has-children'),
                    haveClassOnLi = $mobileMenu.find('.menu-item-has-children');

                if ( haveClassOnLi.length > 0 ) {
                    $hasSubUl.children( 'a' ).append( '<a href="#" class="visionwp-arrow-box"><span class="visionwp-down-arrow"></span></a>');
                } else {
                    $('#visionwp-mobile-menu ul li:has(ul)').children('a').append('<a href="#" class="visionwp-arrow-box"><span class="visionwp-down-arrow"></span></a>');
                }
            };

            this.toggleSubUl = function () {
                $(document).on('click', '.visionwp-arrow-box', toggleSubMenu);

                function toggleSubMenu(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).toggleClass('open').parent().next().slideToggle();
                }
            };

            this.menuToggler = function () {
                var menuConfig = {
                    animation: ['.visionwp-mobile-menu-overlay', '#visionwp-mobile-menu', 'body', '#menu-icon'],
                    exceptions: ['#visionwp-mobile-menu'],
                    toggler: ['#menu-icon', '.visionwp-mobile-menu-overlay', '#visionwp-close'],
                    className: 'visionwp-menu-open'
                };
                new classToggler(menuConfig).init();
            };

        }; /* End shiftMenu */

        /* instance of shiftmenu */
        new shiftMenu().init();

    };

    //banner slider
    $(document).ready(function () {       

        $(window).on( 'scroll', function () {
            if ($(window).scrollTop() > 50) {
                $( 'body' ).addClass( 'visionwp-scrolled-down' );
            } else {
                $( 'body' ).removeClass('visionwp-scrolled-down' );
            }
        });

        $( '.visionwp-scroll-top' ).click(function( e ) {
            e.preventDefault();
            $( 'body, html' ).animate({
                scrollTop: 0,
            }, 500 );
            return false;
        }); 

        /* sticky button on footer */

        $( window ).on( "scroll", function () {
            if ($( window ).scrollTop() > 150) {
                $( 'body' ).addClass( 'show-header-button' );
            } else {
                $( 'body' ).removeClass( 'show-header-button' );
            }
        });

        //sticky js
        $( '.visionwp-sticky-header  .visionwp-header-wrapper' ).sticky({
            topSpacing: 0
        });

        //load more posts
        visionwploadMorePosts();

        //mobile menu init
        $('#site-navigation').visionwpMobileMenu();

        jQuery( document ).on( 'focus', '.circular-focus', function () {
            jQuery( jQuery( this ).data( "goto" ) ).focus();
        });

        jQuery( document ).on( 'click', '.visionwp-mobile-menu ul li:not(".menu-item-has-children") a', function () {
            jQuery( 'button#visionwp-close' ).trigger( 'click' );
        });
    });   

})(jQuery)