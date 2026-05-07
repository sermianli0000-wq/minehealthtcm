/* Absolute Counter */
(function ($) {
  "use strict";

  $.fn.absoluteCounter = function (options) {

    // 合并默认参数
    options = $.extend({}, $.fn.absoluteCounter.defaults, options || {});

    return this.each(function () {

      var el = this;
      var speed = options.speed;
      var setStyles = options.setStyles;
      var delayedStart = options.delayedStart;
      var fadeInDelay = options.fadeInDelay;

      // 初始化样式
      if (setStyles) {
        $(el).css({
          display: "block",
          position: "relative",
          overflow: "hidden"
        }).addClass("animated");
      }

      // 初始隐藏
      $(el).css("opacity", "0");

      // 延迟启动
      $(el).animate({ opacity: 0 }, delayedStart, function () {

        var text = $(el).text();
        $(el).text("");

        // 拆分字符
        for (var i = 0; i < text.length; i++) {

          var char = text.charAt(i);
          var html = "";

          // 如果是数字
          if (parseInt(char, 10) >= 0) {

            html = '<span class="onedigit p' + (text.length - i) + ' d' + char + '">';

            // 生成 0-9 滚动列表
            for (var n = 0; n <= parseInt(char, 10); n++) {
              html += '<span class="n' + (n % 10) + '">' + (n % 10) + '</span>';
            }

            html += '</span>';

          } else {
            // 非数字字符
            html = '<span class="onedigit p' + (text.length - i) + ' char">' +
              '<span class="c">' + char + '</span>' +
              '</span>';
          }

          $(el).append(html);
        }

        // 淡入
        $(el).animate({ opacity: 1 }, fadeInDelay);

        // 每一位数字动画
        $("span.onedigit", el).each(function (i, o) {

          if (setStyles) {
            $(o).css({
              float: "left",
              position: "relative"
            });

            $("span", $(o)).css({
              display: "block"
            });
          }

          var itemCount = $("span", $(o)).length;
          var height = $(el).height();

          // 设置容器高度
          $(o).css({
            height: (itemCount * height) + "px",
            top: "0"
          });

          // 设置每一格高度
          $("span", $(o)).css({
            height: height + "px"
          });

          // 滚动动画
          $(o).animate({
            top: -1 * ((itemCount - 1) * height)
          }, speed, function () {

            if (typeof options.onComplete === "function") {
              options.onComplete.call(el);
            }

          });

        });

      });

    });
  };

  // 默认参数
  $.fn.absoluteCounter.defaults = {
    speed: 2000,
    setStyles: true,
    onComplete: null,
    delayedStart: 0,
    fadeInDelay: 0
  };

})(jQuery);