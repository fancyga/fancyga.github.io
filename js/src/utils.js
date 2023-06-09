/* global NexT: true */

NexT.utils = NexT.$u = {
  /**
   * Wrap images with fancybox support.
   */
  wrapImageWithFancyBox: function () {
    $('.content img').not('.group-picture img').each(function () {

      var $image = $(this);
      var imageTitle = $image.attr('title');
      var $imageWrapLink = $image.parent('a');

      if ($imageWrapLink.size() < 1) {
        $imageWrapLink = $image.wrap('<a href="' + this.getAttribute('src') + '"></a>').parent('a');
      }

      $imageWrapLink.addClass('fancybox');
      $imageWrapLink.attr('rel', 'group');

      if (imageTitle) {
        $imageWrapLink.append('<p class="image-caption">' + imageTitle + '</p>');
        $imageWrapLink.attr('title', imageTitle); //make sure img title tag will show correctly in fancybox
      }
    });

    $('.fancybox').fancybox({
      helpers: {
        overlay: {
          locked: false
        }
      }
    });
  },

  lazyLoadPostsImages: function () {
    $('#posts').find('img').lazyload({
      placeholder: '/images/loading.gif',
      effect: 'fadeIn'
    });
  },

  //  registerBackToTop: function () {
  //    var THRESHOLD = 50;
  //    var $top = $('.back-to-top');
  //
  //    $(window).on('scroll', function () {
  //      $top.toggleClass('back-to-top-on', window.pageYOffset > THRESHOLD);
  //    });
  //
  //    $top.on('click', function () {
  //      $('body').velocity('scroll');
  //    });
  //  },

  // registerScrollPercent: function() {
  //   var THRESHOLD = 50;
  //   var backToTop = document.querySelector('.back-to-top');
  //   var readingProgressBar = document.querySelector('.reading-progress-bar');
  //   // For init back to top in sidebar if page was scrolled after page refresh.
  //   window.addEventListener('scroll', () => {
  //     if (backToTop || readingProgressBar) {
  //       var docHeight = document.querySelector('.container').offsetHeight;
  //       var winHeight = window.innerHeight;
  //       var contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight;
  //       var scrollPercent = Math.min(100 * window.scrollY / contentVisibilityHeight, 100);
  //       if (backToTop) {
  //         backToTop.classList.toggle('back-to-top-on', window.scrollY > THRESHOLD);
  //         backToTop.querySelector('span').innerText = Math.round(scrollPercent) + '%';
  //       }
  //       if (readingProgressBar) {
  //         readingProgressBar.style.width = scrollPercent.toFixed(2) + '%';
  //       }
  //     }
  //   });
  //
  //   backToTop && backToTop.addEventListener('click', () => {
  //     window.anime({
  //       targets  : document.scrollingElement,
  //       duration : 500,
  //       easing   : 'linear',
  //       scrollTop: 0
  //     });
  //   });
  // },

  registerMoonAndScroll: function () {
    // 顶部滚动
    var readingProgressBar = document.querySelector('.reading-progress-bar');
    const moonMenuListener = function() {
      // Get scroll percent
      const offsetHeight = document.documentElement.offsetHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      let percentRaw = scrollTop / (scrollHeight - offsetHeight) * 100;
      let percent = Math.round(percentRaw);
      if (percent > 100) percent = 100;

      const menuIcon = document.querySelector('.moon-menu-icon');
      const menuText = document.querySelector('.moon-menu-text');
      if (!percent) {
        percent = 0;
        menuIcon.style.display = 'block';
        menuText.style.display = 'none';
      } else {
        menuIcon.style.display = 'none';
        menuText.style.display = 'block';
        menuText.innerHTML = percent + '%';
      }

      // Update strokeDasharray
      const length = 196;
      document.querySelector('.moon-menu-border').style.strokeDasharray = percent * length / 100 + ' ' + length;

      if (readingProgressBar) {
        readingProgressBar.style.width = percentRaw.toFixed(2) + '%';
      }
    };

    window.addEventListener('load', () => {
      moonMenuListener();
    });
    window.addEventListener('scroll', moonMenuListener);

    document.querySelector('.moon-menu-button').addEventListener('click', () => {
      document.querySelector('.moon-menu-icon').classList.toggle('active');
      const items = document.querySelector('.moon-menu-items');
      items.classList.toggle('active');
      const childItems = document.querySelectorAll('.moon-menu-item');
      if (items.classList.contains('active')) {
        for (let i = 0; i < childItems.length; i++) {
          childItems[i].style.top = -3 - 3 * i + 'em';
          childItems[i].style.opacity = .9;
        }
      } else {
        for (let i = 0; i < childItems.length; i++) {
          childItems[i].style.top = '1em';
          childItems[i].style.opacity = 0;
        }
      }
    });

    const addClickListener = (id, call) => {
      const item = document.querySelector(id);
      if (item) {
        item.addEventListener('click', call);
      }
    };

    addClickListener('#moon-menu-item-back2top', () => {
      window.scroll({ top: 0, behavior: 'smooth' });
    });

    addClickListener('#moon-menu-item-back2bottom', () => {
      const offsetHeight = document.documentElement.offsetHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      window.scroll({ top: scrollHeight - offsetHeight, behavior: 'smooth' });
    });
  },

  /**
   * Transform embedded video to support responsive layout.
   * @see http://toddmotto.com/fluid-and-responsive-youtube-and-vimeo-videos-with-fluidvids-js/
   */
  embeddedVideoTransformer: function () {
    var $iframes = $('iframe');

    // Supported Players. Extend this if you need more players.
    var SUPPORTED_PLAYERS = [
      'www.youtube.com',
      'player.vimeo.com',
      'player.youku.com',
      'music.163.com',
      'www.tudou.com'
    ];
    var pattern = new RegExp( SUPPORTED_PLAYERS.join('|') );

    $iframes.each(function () {
      var iframe = this;
      var $iframe = $(this);
      var oldDimension = getDimension($iframe);
      var newDimension;

      if (this.src.search(pattern) > 0) {

        // Calculate the video ratio based on the iframe's w/h dimensions
        var videoRatio = getAspectRadio(oldDimension.width, oldDimension.height);

        // Replace the iframe's dimensions and position the iframe absolute
        // This is the trick to emulate the video ratio
        $iframe.width('100%').height('100%')
          .css({
            position: 'absolute',
            top: '0',
            left: '0'
          });


        // Wrap the iframe in a new <div> which uses a dynamically fetched padding-top property
        // based on the video's w/h dimensions
        var wrap = document.createElement('div');
        wrap.className = 'fluid-vids';
        wrap.style.position = 'relative';
        wrap.style.marginBottom = '20px';
        wrap.style.width = '100%';
        wrap.style.paddingTop = videoRatio + '%';

        // Add the iframe inside our newly created <div>
        var iframeParent = iframe.parentNode;
        iframeParent.insertBefore(wrap, iframe);
        wrap.appendChild(iframe);

        // Additional adjustments for 163 Music
        if (this.src.search('music.163.com') > 0) {
          newDimension = getDimension($iframe);
          var shouldRecalculateAspect = newDimension.width > oldDimension.width ||
                                        newDimension.height < oldDimension.height;

          // 163 Music Player has a fixed height, so we need to reset the aspect radio
          if (shouldRecalculateAspect) {
            wrap.style.paddingTop = getAspectRadio(newDimension.width, oldDimension.height) + '%';
          }
        }
      }
    });

    function getDimension($element) {
      return {
        width: $element.width(),
        height: $element.height()
      };
    }

    function getAspectRadio(width, height) {
      return height / width * 100;
    }
  },

  /**
   * Add `menu-item-active` class name to menu item
   * via comparing location.path with menu item's href.
   */
  addActiveClassToMenuItem: function () {
    var path = window.location.pathname;
    path = path === '/' ? path : path.substring(0, path.length - 1);
    $('.menu-item a[href="' + path + '"]').parent().addClass('menu-item-active');
  },

  hasMobileUA: function () {
    var nav = window.navigator;
    var ua = nav.userAgent;
    var pa = /iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g;

    return pa.test(ua);
  },

  isTablet: function () {
    return window.screen.width < 992 && window.screen.width > 767 && this.hasMobileUA();
  },

  isMobile: function () {
    return window.screen.width < 767 && this.hasMobileUA();
  },

  isDesktop: function () {
    return !this.isTablet() && !this.isMobile();
  },

  /**
   * Escape meta symbols in jQuery selectors.
   *
   * @param selector
   * @returns {string|void|XML|*}
   */
  escapeSelector: function (selector) {
    return selector.replace(/[!"$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
  },

  displaySidebar: function () {
    if (!this.isDesktop() || this.isPisces()) {
      return;
    }
    $('.sidebar-toggle').trigger('click');
  },

  isMist: function () {
    return CONFIG.scheme === 'Mist';
  },

  isPisces: function () {
    return CONFIG.scheme === 'Pisces';
  },

  getScrollbarWidth: function () {
    var $div = $('<div />').addClass('scrollbar-measure').prependTo('body');
    var div = $div[0];
    var scrollbarWidth = div.offsetWidth - div.clientWidth;

    $div.remove();

    return scrollbarWidth;
  },

  /**
   * Affix behaviour for Sidebar.
   *
   * @returns {Boolean}
   */
  needAffix: function () {
    return this.isPisces();
  }
};
