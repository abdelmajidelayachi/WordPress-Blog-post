!(function ($) {
  "use strict";
  var UNFOLD = UNFOLD || {};
  var iScrollPos = 0;

  var prevScrollPos = window.pageYOffset;

  var navBar = $(".be-header-menu-wrap");
  var navOffset = navBar.offset().top;
  if ($("header").hasClass("header_style_4")) {
    navOffset = navOffset + navBar.height() + 30;
  }
  /*Used for ajax loading posts*/
  var loadType,
    loadButtonContainer,
    loadBtn,
    loader,
    pageNo,
    loading,
    morePost,
    scrollHandling;
  /**/

  /* --------------- Sticky Menu ---------------*/
  (UNFOLD.stickyMenu = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      if (navOffset > currentScrollPos || currentScrollPos === 0) {
        navBar.removeClass("be-nav-affix");
      } else {
        navBar.addClass("be-nav-affix");
      }
    } else {
      navBar.removeClass("be-nav-affix");
    }
    prevScrollPos = currentScrollPos;
  }),
    /* --------------- Sticky Sidebar ---------------*/
    (UNFOLD.stickySidebar = function () {
      var stickySidebarGlobal = blogTory.stickySidebarGlobal;
      var stickySidebarFrontPage = blogTory.stickySidebarFrontPage;

      if (stickySidebarFrontPage || stickySidebarGlobal) {
        if (stickySidebarFrontPage && !stickySidebarGlobal) {
          if ($("body").hasClass("be-home")) {
            jQuery("body.home #secondary.sidebar-area").theiaStickySidebar({
              containerSelector: ".wrapper",
              additionalMarginTop: 70,
              additionalMarginBottom: 0,
            });
          }
        } else if (!stickySidebarFrontPage && stickySidebarGlobal) {
          if (!$("body").hasClass("be-home")) {
            jQuery("#secondary.sidebar-area").theiaStickySidebar({
              containerSelector: ".wrapper",
              additionalMarginTop: 70,
              additionalMarginBottom: 0,
            });
          }
        } else {
          jQuery("#secondary.sidebar-area").theiaStickySidebar({
            containerSelector: ".wrapper",
            additionalMarginTop: 70,
            additionalMarginBottom: 0,
          });
        }
      }
    }),
    /* --------------- Mobile Menu ---------------*/
    (UNFOLD.mobileMenu = {
      init: function () {
        this.toggleMenu(), this.menuMobile(), this.menuArrow();
      },
      toggleMenu: function () {
        $("#masthead").on("click", ".toggle-menu", function (event) {
          var ethis = $(".main-navigation .menu .menu-mobile");
          if (ethis.css("display") == "block") {
            ethis.slideUp("300");
            $("#masthead").removeClass("mmenu-active");
          } else {
            ethis.slideDown("300");
            $("#masthead").addClass("mmenu-active");
          }
          $(".ham").toggleClass("exit");
        });
        $("#masthead .main-navigation ").on(
          "click",
          ".menu-mobile a i",
          function (event) {
            event.preventDefault();
            var ethis = $(this),
              eparent = ethis.closest("li"),
              esub_menu = eparent.find("> .sub-menu");
            if (esub_menu.css("display") == "none") {
              esub_menu.slideDown("300");
              ethis.addClass("active");
            } else {
              esub_menu.slideUp("300");
              ethis.removeClass("active");
            }
            return false;
          }
        );
      },
      menuMobile: function () {
        if ($(".main-navigation .menu > ul").length) {
          var ethis = $(".main-navigation .menu > ul"),
            eparent = ethis.closest(".main-navigation"),
            pointbreak = eparent.data("epointbreak"),
            window_width = window.innerWidth;
          if (typeof pointbreak == "undefined") {
            pointbreak = 991;
          }
          if (pointbreak >= window_width) {
            ethis.addClass("menu-mobile").removeClass("menu-desktop");
            $(".main-navigation .toggle-menu").css("display", "block");
          } else {
            ethis
              .addClass("menu-desktop")
              .removeClass("menu-mobile")
              .css("display", "");
            $(".main-navigation .toggle-menu").css("display", "");
          }
        }
      },
      menuArrow: function () {
        if ($("#masthead .main-navigation div.menu > ul").length) {
          $("#masthead .main-navigation div.menu > ul .sub-menu")
            .parent("li")
            .find("> a")
            .append('<i class="fas fa-angle-down"></i>');
        }
      },
    }),
    /* --------------- Search Reveal ---------------*/
    (UNFOLD.searchReveal = function () {
      $(".search-overlay .search-icon").on("click", function () {
        $(this).parent().toggleClass("reveal-search");
        return false;
      });
    }),
    /* --------------- Background Image ---------------*/
    (UNFOLD.dataBackground = function () {
      $(".be-bg-image").each(function () {
        var src = $(this).find("img").attr("src");
        if (src) {
          $(this)
            .css("background-image", "url(" + src + ")")
            .find("img")
            .hide();
        }
      });
    }),
    // Marquee
    (UNFOLD.jQueryMarquee = function () {
      $(".marquee").marquee({
        duration: 60000,
        gap: 0,
        delayBeforeStart: 0,
        direction: "left",
        duplicated: true,
        pauseOnHover: true,
        startVisible: true,
      });
    }),
    //-------------Tab Items-------------------
    (UNFOLD.tabItems = function () {
      $(".blogtory_tab_posts li").on("click", function () {
        $(".blogtory_tab_posts li").removeClass("active");
        $(this).addClass("active");
        var currentTab = $(this).attr("data-tab");
        if (currentTab) {
          $(".blogtory_tab_posts .unfold-tab-content div").removeClass(
            "active"
          );
          $("." + currentTab).addClass("active");
        }
      });
    }),
    /* --------------- Owl Carousel ---------------*/
    (UNFOLD.bannerCarousel = function () {
      $(".be-owl-banner-carousel").each(function () {
        var $this = $(this),
          $items = 1,
          $margin = 0,
          $auto = true,
          $dots = false,
          $speed = 750,
          $center = false,
          $nav = true,
          $loop = true,
          $desktop_items = 1,
          $tab_items = 1,
          $small_tab_items = 1;

        if ($this.attr("data-margin")) {
          $margin = parseInt($this.attr("data-margin"));
        }
        if ($this.attr("data-dots")) {
          $dots = true;
        }
        if ($this.attr("data-nav")) {
          $nav = false;
        }
        if ($this.attr("data-loop")) {
          $loop = false;
        }
        if ($this.attr("data-auto")) {
          $auto = false;
        }
        if ($this.attr("data-center")) {
          $center = true;
        }
        if ($this.attr("data-desktop")) {
          $desktop_items = parseInt($this.attr("data-desktop"));
        }
        if ($this.attr("data-tab")) {
          $tab_items = parseInt($this.attr("data-tab"));
        }
        if ($this.attr("data-smalltab")) {
          $small_tab_items = parseInt($this.attr("data-smalltab"));
        }
        if ($this.attr("data-items")) {
          $items = parseInt($this.attr("data-items"));
        }
        if ($this.attr("data-speed")) {
          $speed = parseInt($this.attr("data-speed"));
        }

        var owl_args = {
          loop: $loop,
          margin: $margin,
          items: $items,
          nav: $nav,
          dots: $dots,
          center: $center,
          navText: [blogTory.owl_svg_prev, blogTory.owl_svg_next],
          autoplay: $auto,
          autoHeight: false,
          autoplayHoverPause: true,
          smartSpeed: $speed,
          responsive: {
            0: {
              items: 1,
            },
            480: {
              items: $small_tab_items,
            },
            768: {
              items: $tab_items,
            },
            1170: {
              items: $desktop_items,
            },
          },
        };

        $this.owlCarousel(owl_args);
      });
    }),
    /* --------------- Owl Slider  ---------------*/
    (UNFOLD.owlSlider = function () {
      $(".be-owl-carousel-slider").each(function () {
        var $this = $(this),
          $items = 1,
          $auto = true,
          $dots = false,
          $nav = true,
          $loop = true,
          $speed = 750,
          $desktop_items = 1,
          $tab_items = 1,
          $small_tab_items = 1,
          $animateIn = "",
          $animateOut = "";

        if ($this.attr("data-dots")) {
          $dots = true;
        }
        if ($this.attr("data-nav")) {
          $nav = false;
        }
        if ($this.attr("data-loop")) {
          $loop = false;
        }
        if ($this.attr("data-auto")) {
          $auto = false;
        }
        if ($this.attr("data-desktop")) {
          $desktop_items = parseInt($this.attr("data-desktop"));
        }
        if ($this.attr("data-tab")) {
          $tab_items = parseInt($this.attr("data-tab"));
        }
        if ($this.attr("data-smalltab")) {
          $small_tab_items = parseInt($this.attr("data-smalltab"));
        }
        if ($this.attr("data-items")) {
          $items = parseInt($this.attr("data-items"));
        }
        if ($this.attr("data-animatein")) {
          $animateIn = $this.attr("data-animatein").toString();
        }
        if ($this.attr("data-animateout")) {
          $animateOut = $this.attr("data-animateout").toString();
        }
        if ($this.attr("data-speed")) {
          $speed = parseInt($this.attr("data-speed"));
        }

        var owl_args = {
          animateOut: $animateOut,
          animateIn: $animateIn,
          loop: $loop,
          margin: 0,
          items: $items,
          slideBy: $items,
          nav: $nav,
          dots: $dots,
          navText: [blogTory.owl_svg_prev, blogTory.owl_svg_next],
          autoplay: $auto,
          autoHeight: false,
          autoplayHoverPause: true,
          smartSpeed: $speed,
          responsive: {
            0: {
              items: 1,
              slideBy: 1,
            },
            480: {
              items: $small_tab_items,
              slideBy: $small_tab_items,
            },
            768: {
              items: $tab_items,
              slideBy: $tab_items,
            },
            1170: {
              items: $desktop_items,
              slideBy: $desktop_items,
            },
          },
        };

        if ($this.hasClass("be-trending-now-posts")) {
          owl_args["animateOut"] = "slideOutUp";
          owl_args["animateIn"] = "slideInUp";
        }

        $this.owlCarousel(owl_args);
      });
    }),
    /* --------------- Fix margin for top bar trending posts ---------------*/
    (UNFOLD.trendingMargin = function () {
      var $trending_title = $(".be-trending-posts .trending-now-title");
      if ($trending_title.length) {
        var $trending_title_w = $trending_title.outerWidth() + 64;
        $(".be-trending-now-posts").css(
          "margin-left",
          $trending_title_w + "px"
        );
      }
    }),
    /* --------------- Scroll To Top ---------------*/
    (UNFOLD.scrollTop = {
      scrollClick: function () {
        $("#scroll-up").on("click", function () {
          $("html, body").animate(
            {
              scrollTop: 0,
            },
            800
          );
          return false;
        });
      },
      onScroll: function () {
        if ($(window).scrollTop() > $(window).height() / 2) {
          $("#scroll-up").fadeIn(300);
        } else {
          $("#scroll-up").fadeOut(300);
        }
      },
    }),
    $(document).ready(function () {
      UNFOLD.mobileMenu.init();
      UNFOLD.searchReveal();
      UNFOLD.dataBackground();
      UNFOLD.jQueryMarquee();
      UNFOLD.bannerCarousel();
      UNFOLD.tabItems();
      UNFOLD.owlSlider();
      UNFOLD.trendingMargin();
      UNFOLD.stickySidebar();
      UNFOLD.scrollTop.scrollClick();
    });
  $(window).load(function () {
    $(".preloader").fadeOut("slow");
  });
  $(window).scroll(function () {
    UNFOLD.stickyMenu();
    UNFOLD.scrollTop.onScroll();
  });
  $(window).resize(function () {
    UNFOLD.mobileMenu.menuMobile();
  });
})(jQuery);
