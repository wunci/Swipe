(function (window) {
    var pagination, // 分页
        autoplay, // 自动轮播
        navigation, // 前进后退
        main, // 主要区域
        wrap = document.querySelector('.wrap'),
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
        allImg = wrap.querySelectorAll('img')
        var lastELe = allImg[allImg.length - 1].cloneNode(); // 克隆最后一个元素
        var firstELe = allImg[0].cloneNode(); // 克隆第一个元素
        wrap.appendChild(firstELe);
        wrap.insertBefore(lastELe, allImg[0]);

        totalLength = wrap.querySelectorAll('img').length;

        if (autoplay) {
            this.autoSlide()
        }

        // 分页
        console.log(totalLength)
        if (pagination) {
            pagination = document.querySelector(pagination);
            for (var i = 0; i < totalLength - 2; i++) {
                var ele = document.createElement('div');
                if (i == 0) {
                    ele.className = 'p-list active'
                } else {
                    ele.className = 'p-list '
                }
                // console.log(ele)
                pagination.appendChild(ele)
            }
        }
        var that = this
        window.onresize = window.onload = function () {
            clientWidth = wrap.offsetWidth
            end = -clientWidth
            start = end
            scroll = 0
            // console.log(clientWidth,end)
            allImg.forEach(val => {
                val.style.width = clientWidth + 'px'
            })
            that.setStyle(end, false)
        }
        this.setStyle(end, false)

        if ('ontouchstart' in window) {
            main.addEventListener('touchstart', that.mousedown.bind(that), false)
            main.addEventListener('touchmove', that.mousemove.bind(that), false)
            main.addEventListener('touchend', that.mouseup.bind(that), false)
        } else {
            main.addEventListener('mousedown', that.mousedown.bind(that), false)
        }

        // 前进后退
        if (!navigation) return
        var next = navigation.next
        var prev = navigation.prev
        // 后退
        document.querySelector(prev).onclick = that.throttle(that.prev.bind(that))
        // 前进
        document.querySelector(next).onclick = that.throttle(that.next.bind(that))
    }
    Swipe.prototype.prev = function () {
        var that = this

        clearInterval(autoTimer)
        console.log(autoTimer)
        if (autoTimer) {
            console.log('1231')
            that.autoSlide()
        }
        index--

        that.setPagination()
        if (index === 0) {
            that.setStyle(-clientWidth * index, true, function () {
                setTimeout(function () {
                    index = totalLength - 2
                    that.setStyle(-clientWidth * index, false)
                }, 300);
            })
        } else {
            that.setStyle(-clientWidth * index, true)
        }

        start = end = -clientWidth * index
    }
    Swipe.prototype.next = function () {
        var that = this
        clearInterval(autoTimer)
        console.log(autoTimer)
        if (autoTimer) {
            console.log('1231')
            that.autoSlide()
        }
        index++
        that.setPagination()

        if (index === totalLength - 1) {
            that.setStyle(-clientWidth * index, true, function () {
                setTimeout(function () {
                    index = 1
                    that.setStyle(-clientWidth * index, false)
                }, 300);
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
        console.log(isMove)
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
        // console.log(autoTimer)
        console.log(this)
        if (autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        // alert()
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
        // console.log(autoTimer)
        if (autoTimer) {
            console.log('1231')
            this.autoSlide()
        }
        e.preventDefault()
        document.querySelector('#div1').innerHTML = start

        var offsetX = e.offsetX ? e.offsetX : e.touches[0].pageX;
        scroll = (offsetX - start + end)
        turnLR = offsetX - start
        // console.log('move',scroll,turnLR)
        this.setStyle(scroll, true)
    }
    // 鼠标/手指抬起
    Swipe.prototype.mouseup = function (e) {
        clearInterval(autoTimer)
        console.log(autoTimer)
        if (autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        var offsetX = e.offsetX ? e.offsetX : e.changedTouches[0].pageX;
        // console.log('turnLR',turnLR,scroll,start,end,offsetX)
        if (start === offsetX) {
            return
        }
        if (turnLR < 0) {
            console.log('向右')
            if (Math.abs(turnLR) > 120) {

                index++

                // 设置当前真正的index
                if (index === 5) {
                    this.realIndex = 0
                } else {
                    this.realIndex = index - 1
                }
                console.log('realIndex', this.realIndex)
                this.setStyle(-clientWidth * index, true)
            } else {
                this.setStyle(-clientWidth * index, true)
            }
            end = -clientWidth * index
        } else if (turnLR > 0) {
            console.log('向左')
            if (Math.abs(turnLR) > 120) {

                index--

                if (index === 0) {
                    this.realIndex = totalLength - 3
                } else {
                    this.realIndex = index - 1
                }
                console.log('realIndex', this.realIndex)
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
        console.log('index', index)
        var num = index
        if (num === totalLength - 1) {
            num = 1
        }
        if (num === 0) {
            num = totalLength - 2
        }
        var list = document.querySelectorAll('.p-list');
        list.forEach(function (val, i) {
            val.className = val.className.replace('active', '')
        })
        list[num - 1].className += ' active'
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
        }, this.autoplay)
    }
    window.Swipe = Swipe
})(window)