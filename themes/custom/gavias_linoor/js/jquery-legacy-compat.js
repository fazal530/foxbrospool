(function ($) {
  'use strict';

  if (!$) {
    return;
  }

  if (!$.trim) {
    $.trim = function (text) {
      return text == null ? '' : String.prototype.trim.call(text);
    };
  }

  if (!$.isFunction) {
    $.isFunction = function (value) {
      return typeof value === 'function';
    };
  }

  if (!$.isArray) {
    $.isArray = Array.isArray;
  }

  if (!$.isNumeric) {
    $.isNumeric = function (value) {
      return (typeof value === 'number' || typeof value === 'string') && !Number.isNaN(value - parseFloat(value));
    };
  }

  if (!$.isWindow) {
    $.isWindow = function (value) {
      return value != null && value === value.window;
    };
  }

  if (!$.type) {
    $.type = function (value) {
      if (value == null) {
        return String(value);
      }
      return typeof value === 'object' || typeof value === 'function'
        ? Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
        : typeof value;
    };
  }

  if (!$.nodeName) {
    $.nodeName = function (element, name) {
      return element && element.nodeName && element.nodeName.toLowerCase() === String(name).toLowerCase();
    };
  }

  if (!$.parseJSON) {
    $.parseJSON = JSON.parse;
  }

  if (!$.now) {
    $.now = Date.now;
  }

  if (!$.camelCase) {
    $.camelCase = function (text) {
      return String(text).replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
      });
    };
  }

  if (!$.fn.once && window.once) {
    $.fn.once = function (id) {
      return $(window.once(id, this.get()));
    };
  }

  if (!$.fn.removeOnce && window.once && window.once.remove) {
    $.fn.removeOnce = function (id) {
      return $(window.once.remove(id, this.get()));
    };
  }

  if (!$.fn.size) {
    $.fn.size = function () {
      return this.length;
    };
  }

  $.each(['load', 'unload', 'error'], function (index, name) {
    var original = $.fn[name];

    $.fn[name] = function () {
      if (name === 'load' && typeof arguments[0] === 'string') {
        return original.apply(this, arguments);
      }
      if (arguments.length) {
        return this.on.apply(this, [name].concat(Array.prototype.slice.call(arguments)));
      }
      return this.trigger(name);
    };
  });

  var originalToggle = $.fn.toggle;
  var toggleState = new WeakMap();
  $.fn.toggle = function () {
    if (arguments.length > 1 && Array.prototype.every.call(arguments, $.isFunction)) {
      var handlers = arguments;
      return this.on('click', function (event) {
        var lastToggle = (toggleState.get(this) || 0) % handlers.length;
        toggleState.set(this, lastToggle + 1);
        event.preventDefault();
        return handlers[lastToggle].apply(this, arguments) || false;
      });
    }
    return originalToggle.apply(this, arguments);
  };
})(window.jQuery);
