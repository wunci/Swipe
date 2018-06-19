# Swipe
Swiper is touch slider

暂时可配置列表（可扩展实现常见的大部分功能）
1. 分页
2. 分页是否可点击
3. 自动轮播（设置时间）
4. 上一页下一页
5. 监听动画结束

# 例子
html

> css自行引入

```html
    <div class="main">
        <div class="swipe-wrap">
            <div class="swipe-slide slide1">
                slide1
            </div>
            <div class="swipe-slide slide2">
                slide2
            </div>
            <div class="swipe-slide slide3">
                slide3
            </div>
            <div class="swipe-slide slide4">
                slide4
            </div>
        </div>
        <div class="pagination"></div>
        <div class="swipe-btn-prev"></div>
        <div class="swipe-btn-next"></div>
    </div>
```
js
```js
var swiper = new Swipe('.main',{
        pagination:{
            el: '.pagination',// 分页元素
            clickAble: true // 分页可点击
        },
        autoplay: 3000,// 设置自动轮播
        navigation:{
            next:'.swipe-btn-next', // 前进
            prev:'.swipe-btn-prev', // 后退
        },
        // 动画结束回调
        transitionEnd:function(swipe){
            console.log('realIndex',swipe.realIndex)
        },
    })
```