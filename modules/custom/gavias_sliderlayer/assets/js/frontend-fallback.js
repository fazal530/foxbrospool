(function ($, Drupal) {
  'use strict';

  var BREAKPOINTS = [1240, 1024, 778, 480];

  function showFallback($slider) {
    var $wrapper = $slider.closest('.rev_slider_wrapper');
    var $firstSlide = $slider.find('> ul > li').first();
    var $sourceSlide = $slider.data('gavias-slider-original-slide') || $firstSlide;
    var $background = $sourceSlide.find('.rev-slidebg').first();
    var $videoLayer = $sourceSlide.find('.rs-background-video-layer').first();
    var $generatedBackground = $firstSlide.find('.tp-bgimg.defaultimg, .tp-bgimg').first();
    var backgroundUrl = getBackgroundUrl($background, $generatedBackground);
    var videoUrl = $videoLayer.data('videomp4');
    var height = getSliderHeight($wrapper, $slider);

    if (!$firstSlide.length) {
      return;
    }

    $wrapper.addClass('gva-slider-fallback-wrapper').css({
      display: 'block',
      visibility: 'visible',
      opacity: 1,
      overflow: 'hidden',
      height: height
    });

    $slider.addClass('gva-slider-fallback').css({
      display: 'block',
      visibility: 'visible',
      opacity: 1,
      height: height
    });

    $slider.find('.tp-loader').hide();

    $slider.find('> ul').css({
      display: 'block',
      visibility: 'visible',
      opacity: 1,
      position: 'relative',
      height: '100%',
      margin: 0,
      padding: 0
    });

    if (backgroundUrl) {
      $firstSlide.css({
        backgroundImage: 'url("' + backgroundUrl + '")',
        backgroundSize: $background.data('bgfit') || 'cover',
        backgroundPosition: $background.data('bgposition') || 'center center',
        backgroundRepeat: $background.data('bgrepeat') || 'no-repeat'
      });
    }

    $firstSlide
      .addClass('active-revslide gva-slider-fallback-active')
      .css({
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 20
      });

    ensureVideo($firstSlide, videoUrl);

    $background.add($generatedBackground).css({
      display: 'block',
      visibility: 'visible',
      opacity: videoUrl ? 0 : 1,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: videoUrl ? 0 : 1
    });

    restoreFallbackCaptions($firstSlide, $sourceSlide).each(function (index) {
      positionCaption($(this), index);
    });
  }

  function restoreFallbackCaptions($slide, $sourceSlide) {
    if ($sourceSlide[0] === $slide[0]) {
      return $slide.find('.tp-caption, .caption');
    }

    $slide.find('.tp-caption, .caption').not('.gva-slider-fallback-caption-clone').hide();
    $slide.find('.gva-slider-fallback-caption-clone').remove();

    $sourceSlide.find('.tp-caption, .caption').each(function () {
      $(this)
        .clone(false)
        .addClass('gva-slider-fallback-caption-clone')
        .appendTo($slide);
    });

    return $slide.find('.gva-slider-fallback-caption-clone');
  }

  function getBackgroundUrl($background, $generatedBackground) {
    var cssBackground;
    var match;

    if ($background.length && $background.attr('src')) {
      return $background.attr('src');
    }
    if ($generatedBackground.length) {
      if ($generatedBackground.attr('src')) {
        return $generatedBackground.attr('src');
      }
      cssBackground = $generatedBackground.css('background-image');
      match = cssBackground && cssBackground.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  function ensureVideo($slide, videoUrl) {
    var video;

    if (!videoUrl || $slide.find('> .gva-slider-fallback-video').length) {
      return;
    }

    video = $('<video />', {
      class: 'gva-slider-fallback-video',
      autoplay: true,
      muted: true,
      loop: true,
      playsinline: true
    })
      .attr({
        src: videoUrl,
        preload: 'auto'
      })
      .css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1
      })
      .prependTo($slide);

    if (video[0] && video[0].play) {
      video[0].play().catch(function () {});
    }
  }

  function positionCaption($caption, index) {
    var left = getResponsiveValue($caption.data('x'), 0);
    var top = getResponsiveValue($caption.data('y'), 0);
    var hOffset = getResponsiveValue($caption.data('hoffset'), 0);
    var vOffset = getResponsiveValue($caption.data('voffset'), 0);
    var fontSize = getResponsiveValue($caption.data('fontsize'), null);
    var lineHeight = getResponsiveValue($caption.data('lineheight'), null);
    var color = getResponsiveValue($caption.data('color'), null);
    var textAlign = $caption.data('textalign') || null;
    var zIndex = parseInt($caption.css('z-index'), 10) || 30;
    var delay = getCaptionDelay($caption, index);

    $caption.addClass('gva-slider-fallback-caption').css({
      display: 'block',
      visibility: 'visible',
      width: 'auto',
      height: 'auto',
      minWidth: 0,
      minHeight: 0,
      opacity: 0,
      position: 'absolute',
      left: normalizePosition(left, hOffset),
      top: normalizePosition(top, vOffset),
      right: left === 'right' ? normalizeSize(hOffset) : 'auto',
      bottom: top === 'bottom' ? normalizeSize(vOffset) : 'auto',
      zIndex: zIndex + 30,
      '--gva-caption-x': left === 'center' ? '-50%' : '0',
      '--gva-caption-y': top === 'middle' ? '-50%' : '0',
      animationDelay: delay + 'ms'
    });

    if ($caption.hasClass('slide-style-1')) {
      $caption.css({
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: 'none',
        textAlign: 'center'
      });
    }
    else if ($caption.hasClass('btn-slide')) {
      $caption.css({
        width: 'auto',
        maxWidth: 'none',
        whiteSpace: 'nowrap'
      });
    }
    else {
      $caption.css({
        width: 'min(620px, calc(100vw - 40px))',
        maxWidth: 'min(620px, calc(100vw - 40px))'
      });
    }

    if (left === 'center') {
      $caption.css({
        left: '50%'
      });
    }
    if (top === 'middle') {
      $caption.css({
        top: '50%'
      });
    }
    if (fontSize) {
      $caption.css('font-size', normalizeSize(fontSize));
    }
    if (lineHeight) {
      $caption.css('line-height', normalizeSize(lineHeight));
    }
    if (color) {
      $caption.css('color', color);
    }
    if (textAlign) {
      $caption.css('text-align', textAlign);
    }
  }

  function getSliderHeight($wrapper, $slider) {
    var configured = parseInt($wrapper.attr('style') && ($wrapper.attr('style').match(/height:\s*(\d+)px/) || [])[1], 10);
    var width = window.innerWidth || document.documentElement.clientWidth;

    if (width < 576) {
      return Math.max(520, Math.round(width * 1.2));
    }
    if (width < 992) {
      return 620;
    }
    return configured || $wrapper.height() || $slider.height() || 900;
  }

  function getResponsiveValue(value, fallback) {
    var values = parseResponsiveList(value);
    var index = getBreakpointIndex();

    if (values.length) {
      return values[index] !== undefined && values[index] !== '' ? values[index] : values[0];
    }

    return value !== undefined && value !== null ? value : fallback;
  }

  function parseResponsiveList(value) {
    var matches;

    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value !== 'string') {
      return [];
    }

    matches = value.match(/'([^']*)'|"([^"]*)"|([^,\[\]]+)/g);
    if (!matches) {
      return [value];
    }

    return matches.map(function (item) {
      return item.replace(/^['"]|['"]$/g, '').trim();
    });
  }

  function getBreakpointIndex() {
    var width = window.innerWidth || document.documentElement.clientWidth;

    if (width <= BREAKPOINTS[3]) {
      return 3;
    }
    if (width <= BREAKPOINTS[2]) {
      return 2;
    }
    if (width <= BREAKPOINTS[1]) {
      return 1;
    }
    return 0;
  }

  function normalizePosition(value, offset) {
    if (value === 'center' || value === 'middle') {
      return '50%';
    }
    if (value === 'right' || value === 'bottom') {
      return 'auto';
    }
    return normalizeSize((parseFloat(value) || 0) + (parseFloat(offset) || 0));
  }

  function normalizeSize(value) {
    return $.isNumeric(value) ? value + 'px' : value;
  }

  function getCaptionDelay($caption, fallbackIndex) {
    var frames = $caption.attr('data-frames');
    var parsed;

    if (frames) {
      try {
        parsed = JSON.parse(frames);
        if (parsed[0] && $.isNumeric(parsed[0].delay)) {
          return parseInt(parsed[0].delay, 10);
        }
      }
      catch (e) {}
    }

    return 250 + fallbackIndex * 180;
  }

  function attachFallback(context) {
    if ($.fn.revolution) {
      return;
    }

    $('.gavias_sliderlayer .rev_slider', context || document).each(function () {
      var slider = this;
      var $slider = $(slider);

      if ($slider.data('gavias-slider-fallback')) {
        return;
      }
      $slider.data('gavias-slider-fallback', true);

      window.setTimeout(function () {
        showFallback($(slider));
      }, 100);

      window.setTimeout(function () {
        showFallback($(slider));
      }, 800);
    });
  }

  window.gaviasSliderLayerShowFallback = function (slider) {
    showFallback($(slider));
  };

  if (Drupal && Drupal.behaviors) {
    Drupal.behaviors.gaviasSliderFallback = {
      attach: function (context) {
        attachFallback(context);
      }
    };
  }

  $(function () {
    attachFallback(document);
  });

  $(document).on('gaviasSliderLayerFallback', '.gavias_sliderlayer .rev_slider', function () {
    showFallback($(this));
  });

  $(window).on('resize', function () {
    if ($.fn.revolution) {
      return;
    }

    $('.gavias_sliderlayer .rev_slider').each(function () {
      showFallback($(this));
    });
  });
})(jQuery, window.Drupal);
