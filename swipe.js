/**
 * Swiper 0.0.2
 * https://github.com/wclimb/Swipe
 * Copyright 2018 wclimb
 * Released under the MIT License
 */
(function (window) {
    var pagination, // 分页
        autoplay, // 自动轮播
        navigation, // 前进后退
        main, // 主要区域
        wrap = document.querySelector('.swipe-wrap'),
        clientWidth = wrap.offsetWidth,
        start = 0, // 开始
        scroll = 0, // 滚动的距离，累加
        end = -clientWidth, // 初始化结束位置
        index = 1; // 下标
        turnLR = 0, // 滑动的距离
        allImg = null, // 全部图片集合
        autoTimer = null, // 自动轮播定时器
        totalLength = 0, // 图片总的length
        transitionEnd = null; // 运动结束执行函数

    var Swipe = function (el, options) {
        pagination = options.pagination || ''
        autoplay = options.autoplay || ''
        navigation = options.navigation || null
        transitionEnd = options.transitionEnd || null
        main = document.querySelector(el);
        allImg = wrap.querySelectorAll('.swipe-slide')
        var firstELe = allImg[0].cloneNode(true); // 克隆第一个元素
        var lastELe = allImg[allImg.length - 1].cloneNode(true); // 克隆最后一个元素
        wrap.appendChild(firstELe);
        wrap.insertBefore(lastELe, allImg[0]);
        totalLength = wrap.querySelectorAll('.swipe-slide').length;
        if (autoplay) {
            this.autoSlide()
        }
        this.realIndex = 0
        var that = this
        // 分页
        if (pagination.el) {
            var paginationEl = document.querySelector(pagination.el);
            for (var i = 0; i < totalLength - 2; i++) {
                var ele = document.createElement('div');
                if (i == 0) {
                    ele.className = 'swipe-pagination-list swipe-pagination-active'
                } else {
                    ele.className = 'swipe-pagination-list '
                }
                if (pagination.clickAble) {
                    (function (i) {
                        if ('ontouchstart' in window) {
                            ele.addEventListener('touchstart', that.paginationClick.bind(that, i), false)
                        } else {
                            ele.addEventListener('click', that.paginationClick.bind(that, i), false)
                        }
                    })(i)
                }
                paginationEl.appendChild(ele)
            }
        }
        window.onresize = window.onload = function () {
            clientWidth = wrap.offsetWidth
            end = -clientWidth
            start = end
            scroll = 0
            allImg.forEach(val => {
                val.style.width = clientWidth + 'px'
            })
            that.setStyle(end, false)
        }
        this.setStyle(end, false)

        if ('ontouchstart' in window) {
            main.addEventListener('touchstart', this.mousedown.bind(this), false)
            main.addEventListener('touchmove', this.mousemove.bind(this), false)
            main.addEventListener('touchend', this.mouseup.bind(this), false)
        } else {
            main.addEventListener('mousedown', that.mousedown.bind(that), false)
        }

        // 前进后退
        if (!navigation) return
        var next = navigation.next,
            prev = navigation.prev,
            prevEl = document.querySelector(prev) || null,
            nextEl = document.querySelector(next) || null;
        if (prevEl && nextEl) {
            if ('ontouchstart' in window) {
                prevEl.addEventListener('touchstart', that.throttle(that.prev.bind(that)), false)
                nextEl.addEventListener('touchstart', that.throttle(that.next.bind(that)), false)
            } else {
                prevEl.addEventListener('click', that.throttle(that.prev.bind(that)), false)
                nextEl.addEventListener('click', that.throttle(that.next.bind(that)), false)
            }

        }
    }

    // 分页按钮点击
    Swipe.prototype.paginationClick = function (i, e) {
        if (i + 1 === index) return
        this.setStyle(-clientWidth * (i + 1), true)
        end = start = -clientWidth * (i + 1);
        index = i + 1;
        this.realIndex = i - 1
        this.setPagination()
    }
    Swipe.prototype.prev = function () {
        var that = this
        clearInterval(autoTimer)
        if (autoTimer) {
            that.autoSlide()
        }
        index--
        that.setPagination()
        if (index === 0) {
            that.setStyle(-clientWidth * index, true, function () {
                wrap.addEventListener('transitionEnd', prevFn, false)
                wrap.addEventListener('webkitTransitionEnd', prevFn, false)
                function prevFn() {
                    if (index === 0) {
                        index = totalLength - 2
                        end = -clientWidth * index
                        that.setStyle(-clientWidth * index, false)
                    }
                }
            })
        } else {
            that.setStyle(-clientWidth * index, true)
        }
        start = end = -clientWidth * index
    }
    Swipe.prototype.next = function () {
        var that = this
        clearInterval(autoTimer)
        if (autoTimer) {
            that.autoSlide()
        }
        index++
        that.setPagination()

        if (index === totalLength - 1) {
            that.setStyle(-clientWidth * index, true, function () {
                wrap.addEventListener('transitionEnd', nextFn, false)
                wrap.addEventListener('webkitTransitionEnd', nextFn, false)
                function nextFn() {
                    if (index === totalLength - 1) {
                        index = 1
                        end = -clientWidth * index
                        that.setStyle(-clientWidth * index, false)
                    }
                }
            })
        } else {
            that.setStyle(-clientWidth * index, true)
        }
        start = end = -clientWidth * index
    }
    // 执行动画
    Swipe.prototype.setStyle = function (scroll, isMove, cb) {
        wrap.style.transform = 'translate3d(' + scroll + 'px,0,0)';
        wrap.style.webkitTransform = 'translate3d(' + scroll + 'px,0,0)';
        if (isMove) {
            wrap.style.transitionDuration = '300ms';
            wrap.style.webkitTransitionDuration = '300ms';
            cb && cb()
        } else {
            wrap.style.transitionDuration = '0ms';
            wrap.style.webkitTransitionDuration = '0ms';
        }
    }
    // 鼠标/手指按下
    Swipe.prototype.mousedown = function (e) {
        clearInterval(autoTimer)
        var targrtClsName = e.target.className
        if (targrtClsName === 'swipe-btn-next' || targrtClsName === 'swipe-btn-prev') return
        if (autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        start = e.offsetX ? e.offsetX : e.touches[0].pageX;
        if (index === 0) {
            index = totalLength - 2;
            end = -clientWidth * index
            this.setStyle(-clientWidth * index, false)
        }
        if (index === totalLength - 1) {
            index = 1
            end = -clientWidth * index
            this.setStyle(-clientWidth * index, false)
        }
        var that = this
        if ('onmousemove' in window) {
            that.mousemove = that.mousemove.bind(that)
            that.mouseup = that.mouseup.bind(that)
            document.addEventListener('mousemove', that.mousemove, false)
            document.addEventListener('mouseup', that.mouseup, false)
        }
    }
    // 鼠标/手指移动
    Swipe.prototype.mousemove = function (e) {
        clearInterval(autoTimer)
        if (autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        var offsetX = e.offsetX ? e.offsetX : e.touches[0].pageX;
        scroll = (offsetX - start + end)
        turnLR = offsetX - start
        this.setStyle(Math.ceil(scroll), true)
    }
    // 鼠标/手指抬起
    Swipe.prototype.mouseup = function (e) {
        clearInterval(autoTimer)
        if (autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        var offsetX = e.offsetX ? e.offsetX : e.changedTouches[0].pageX;
        if (start === offsetX) {
            // 移除滑动和抬起时间
            document.removeEventListener('mousemove', this.mousemove, false)
            document.removeEventListener('mouseup', this.mouseup, false)
            return
        }
        if (turnLR < 0) {
            if (Math.abs(turnLR) > 50) {
                index++
                // 设置当前真正的index
                if (index === 5) {
                    this.realIndex = 0
                } else {
                    this.realIndex = index - 1
                }
                this.setStyle(-clientWidth * index, true)
            } else {
                this.setStyle(-clientWidth * index, true)
            }
            end = -clientWidth * index
        } else if (turnLR > 0) {
            if (Math.abs(turnLR) > 50) {
                index--
                if (index === 0) {
                    this.realIndex = totalLength - 3
                } else {
                    this.realIndex = index - 1
                }
                this.setStyle(-clientWidth * index, true)
            } else {
                this.setStyle(-clientWidth * index, true)
            }
            end = -clientWidth * index
        }
        if (pagination) {
            this.setPagination()
        }

        // 监听滚动结束
        this.transitionEnd = this.transitionEnd.bind(this)
        wrap.addEventListener('transitionEnd', this.transitionEnd, false)
        wrap.addEventListener('webkitTransitionEnd', this.transitionEnd, false)

        // 移除滑动和抬起时间
        document.removeEventListener('mousemove', this.mousemove, false)
        document.removeEventListener('mouseup', this.mouseup, false)
    }
    // 运动结束
    Swipe.prototype.transitionEnd = function () {
        if (transitionEnd) {
            typeof transitionEnd === 'function' && transitionEnd(this);
            wrap.removeEventListener('transitionEnd', this.transitionEnd, false)
            wrap.removeEventListener('webkitTransitionEnd', this.transitionEnd, false)
        }
    }
    // 设置分页
    Swipe.prototype.setPagination = function () {
        if (!pagination) return
        var num = index
        if (num === totalLength - 1) {
            num = 1
        }
        if (num === 0) {
            num = totalLength - 2
        }
        var list = document.querySelectorAll('.swipe-pagination-list');
        list.forEach(function (val, i) {
            val.className = val.className.replace('swipe-pagination-active', '')
        })
        list[num - 1].className += ' swipe-pagination-active'
    }
    // 节流
    Swipe.prototype.throttle = function (fn, interval) {
        var timer
        isFirst = true;
        return function () {
            var args = arguments,
                that = this
            if (isFirst) {
                fn.apply(that, args)
                return isFirst = false
            }
            if (timer) {
                return
            }
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                fn.apply(that, args)
            }, interval || 300);
        }
    }
    // 自动轮播
    Swipe.prototype.autoSlide = function () {
        var that = this
        autoTimer = setInterval(function () {
            that.next()
        }, autoplay)
    }
    window.Swipe = Swipe
})(window)
   