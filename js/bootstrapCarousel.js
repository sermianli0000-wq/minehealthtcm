+function ($) {
    'use strict';

    // -----------------------------
    // Carousel 核心类
    // -----------------------------
    var Carousel = function (element, options) {
        this.$element    = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options     = $.extend({}, Carousel.DEFAULTS, options)
        this.interval    = null
        this.sliding     = false
        this.$active     = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))
        if (this.options.pause === 'hover') {
            this.$element
                .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
                .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
        }
    }

    Carousel.VERSION = '3.3.5'
    Carousel.DEFAULTS = { interval: 5000, pause: 'hover', wrap: true, keyboard: true }

    // -----------------------------
    // 核心方法
    // -----------------------------
    Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        if (e.which === 37) this.prev()
        else if (e.which === 39) this.next()
        e.preventDefault()
    }

    Carousel.prototype.cycle = function () {
        this.interval && clearInterval(this.interval)
        if (this.options.interval && !this.sliding) {
            this.interval = setInterval($.proxy(this.next, this), this.options.interval)
        }
        return this
    }

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active)
        var delta = direction === 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta + this.$items.length) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
        this.$active = this.$element.find('.item.active')
        var activeIndex = this.getItemIndex(this.$active)
        if (pos === activeIndex) return
        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function () {
        clearInterval(this.interval)
        this.sliding = false
        return this
    }

    Carousel.prototype.next = function () { if (!this.sliding) this.slide('next') }
    Carousel.prototype.prev = function () { if (!this.sliding) this.slide('prev') }

    Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active')
        var $next   = next || this.getItemForDirection(type, $active)
        if ($next.hasClass('active')) return

        this.sliding = true

        $active.removeClass('active')
        $next.addClass('active')

        // 更新 indicators
        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            $(this.$indicators.children()[this.getItemIndex($next)]).addClass('active')
        }

        this.sliding = false
        return this
    }

    // -----------------------------
    // jQuery 插件封装
    // -----------------------------
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = typeof option === 'object' && option
            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option === 'number') data.to(option)
            else if (typeof option === 'string') data[option]()
            else data.pause().cycle()
        })
    }

    var old = $.fn.carousel
    $.fn.carousel = Plugin
    $.fn.carousel.Constructor = Carousel
    $.fn.carousel.noConflict = function () { $.fn.carousel = old; return this }

    // -----------------------------
    // Data API
    // -----------------------------
    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
        var $this   = $(this)
        var href    = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')))
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false
        Plugin.call($target, options)
        if (slideIndex) $target.data('bs.carousel').to(slideIndex)
        e.preventDefault()
    })

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            Plugin.call($(this), $(this).data())
        })
    })

}(jQuery);