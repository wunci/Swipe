(function (window) {
    var Swipe = function (el, options) {
        this.pagination = options.pagination || ''
        this.autoplay = options.autoplay || ''
        this.navigation = options.navigation || null
        console.log(this.pagination)
        this.main = document.querySelector(el);
        this.wrap = document.querySelector('.wrap');
        this.clientWidth = this.wrap.offsetWidth; //可视区域宽度
        this.start = 0; //开始位置
        this.scroll = 0; //滑动的总距离
        this.end = -this.clientWidth; //结束位置
        this.index = 1; //下标
        this.turnLR = 0; //滑动的距离
        this.allImg = this.wrap.querySelectorAll('img');
        this.firstELe = this.allImg[0].cloneNode();
        this.lastELe = this.allImg[this.allImg.length - 1].cloneNode();
        this.autoTimer = null;

        this.wrap.appendChild(this.firstELe);
        this.wrap.insertBefore(this.lastELe, this.allImg[0]);
        this.totalLength = this.wrap.querySelectorAll('img').length

        if (this.autoplay) {
            this.autoSlide()
        }

        // 分页
        if (this.pagination) {
            pagination = document.querySelector(this.pagination);
            for (var i = 0; i < this.totalLength - 2; i++) {
                var ele = document.createElement('div');
                if (i == 0) {
                    ele.className = 'p-list active'
                } else {
                    ele.className = 'p-list '
                }
                console.log(ele)
                pagination.appendChild(ele)

            }
        }
        var that = this
        window.onresize = window.onload = function () {
            that.clientWidth = that.wrap.offsetWidth
            that.end = -that.clientWidth
            that.start = that.end
            that.scroll = 0
            // console.log(clientWidth,end)
            that.allImg.forEach(val => {
                val.style.width = that.clientWidth + 'px'
            })
            that.setStyle(that.end, false)
        }
        this.setStyle(this.end, false)
        if ('ontouchstart' in window) {
            this.main.addEventListener('touchstart', this.mousedown.bind(this), false)
            this.main.addEventListener('touchmove', this.mousemove.bind(this), false)
            this.main.addEventListener('touchend', this.mouseup.bind(this), false)
        } else {
            console.log('mouse')
            that.main.addEventListener('mousedown', that.mousedown.bind(that), false)
        }

        // 后退
        if (!this.navigation) return
        var next = this.navigation.next
        var prev = this.navigation.prev
        document.querySelector(prev).onclick = that.throttle(that.prev.bind(that))

        // 前进
        document.querySelector(next).onclick = that.throttle(that.next.bind(that))
    }
    Swipe.prototype.prev = function () {
        var that = this

        clearInterval(that.autoTimer)
        console.log(that.autoTimer)
        if (that.autoTimer) {
            console.log('1231')
            that.autoSlide()
        }
        that.index--

            that.setPagination()
        if (that.index === 0) {
            that.setStyle(-that.clientWidth * that.index, true, function () {
                setTimeout(function () {
                    that.index = that.totalLength - 2
                    that.setStyle(-that.clientWidth * that.index, false)
                }, 300);
            })
        } else {
            that.setStyle(-that.clientWidth * that.index, true)
        }

        that.start = that.end = -that.clientWidth * that.index
    }
    Swipe.prototype.next = function () {
        var that = this
        clearInterval(that.autoTimer)
        console.log(that.autoTimer)
        if (that.autoTimer) {
            console.log('1231')
            that.autoSlide()
        }
        that.index++
        that.setPagination()

        if (that.index === that.totalLength - 1) {
            that.setStyle(-that.clientWidth * that.index, true, function () {
                setTimeout(function () {
                    that.index = 1
                    that.setStyle(-that.clientWidth * that.index, false)
                }, 300);
            })

        } else {
            that.setStyle(-that.clientWidth * that.index, true)
        }

        that.start = that.end = -that.clientWidth * that.index
    }
    Swipe.prototype.setStyle = function (scroll, isMove, cb) {
        this.wrap.style.transform = 'translate3d(' + scroll + 'px,0,0)';
        this.wrap.style.webkitTransform = 'translate3d(' + scroll + 'px,0,0)';
        console.log(isMove)
        if (isMove) {
            this.wrap.style.transitionDuration = '300ms';
            this.wrap.style.webkitTransitionDuration = '300ms';
            cb && cb()
        } else {
            this.wrap.style.transitionDuration = '0ms';
            this.wrap.style.webkitTransitionDuration = '0ms';
        }
    }
    Swipe.prototype.mousedown = function (e) {
        clearInterval(this.autoTimer)
        // console.log(autoTimer)
        console.log(this)
        if (this.autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        this.start = e.offsetX ? e.offsetX : e.touches[0].pageX;
        if (this.index === 0) {
            this.index = this.totalLength - 2;
            this.end = -this.clientWidth * this.index
            this.setStyle(-this.clientWidth * this.index, false)
        }
        if (this.index === this.totalLength - 1) {
            this.index = 1
            this.end = -this.clientWidth * this.index
            this.setStyle(-this.clientWidth * this.index, false)
        }
        var that = this
        if ('onmousemove' in window) {
            that.mousemove = that.mousemove.bind(that)
            that.mouseup = that.mouseup.bind(that)
            document.addEventListener('mousemove', that.mousemove, false)
            document.addEventListener('mouseup', that.mouseup, false)
        }
    }
    Swipe.prototype.mousemove = function (e) {
        clearInterval(this.autoTimer)
        // console.log(autoTimer)
        if (this.autoTimer) {
            console.log('1231')
            this.autoSlide()
        }
        e.preventDefault()
        var offsetX = e.offsetX ? e.offsetX : e.touches[0].pageX;
        this.scroll = (offsetX - this.start + this.end)
        this.turnLR = offsetX - this.start
        console.log('move', this.scroll, this.turnLR)
        this.setStyle(this.scroll, true)
    }
    Swipe.prototype.mouseup = function (e) {
        clearInterval(this.autoTimer)
        console.log(this.autoTimer)
        if (this.autoTimer) {
            this.autoSlide()
        }
        e.preventDefault()
        var offsetX = e.offsetX ? e.offsetX : e.changedTouches[0].pageX;
        console.log('turnLR', this.turnLR, this.scroll, this.start, this.end, offsetX)
        if (this.start === offsetX) {
            return
        }
        if (this.turnLR < 0) {
            console.log('向右')
            if (Math.abs(this.turnLR) > 120) {
                this.index++
                    this.setStyle(-this.clientWidth * (this.index), true)
            } else {
                this.setStyle(-this.clientWidth * (this.index), true)
            }
            this.end = -this.clientWidth * this.index
        } else if (this.turnLR > 0) {
            console.log('向左')
            if (Math.abs(this.turnLR) > 120) {
                this.index--
                    this.setStyle(-this.clientWidth * (this.index), true)
            } else {
                this.setStyle(-this.clientWidth * (this.index), true)
            }
            this.end = -this.clientWidth * this.index
        }
        console.log(this)
        if (this.pagination) {
            this.setPagination()
        }

        document.removeEventListener('mousemove', this.mousemove, false)
        document.removeEventListener('mouseup', this.mouseup, false)
    }
    // 设置分页
    Swipe.prototype.setPagination = function () {
        if (!this.pagination) return
        console.log('index', this.index)
        var num = this.index
        if (num === this.totalLength - 1) {
            num = 1
        }
        if (num === 0) {
            num = this.totalLength - 2
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
        this.autoTimer = setInterval(function () {
            that.next()
        }, this.autoplay)
    }
    window.Swipe = Swipe
})(window)