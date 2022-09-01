;(function (w){
  w.megumi = {}
  w.megumi.css = function(node, type,val){
    if(typeof node === 'object' && typeof node['transform'] === 'undefined'){
      node['transform'] = {}
    }

    if(arguments.length >= 3){
      //设置
      var text = ''
      node['transform'][type] = val

      for(item in node['transform']){
        //in不仅可以查询制定对象，也会查询其原型链
        if(node['transform'].hasOwnProperty(item)){
          switch (item) {
            case 'translateX':
            case 'translateY':
              text += item + '('+ node['transform'][item] +'px)'
              break
            case 'scale':
              text += item + '('+ node['transform'][item] +')'
              break
            case 'rotate':
              text += item + '('+ node['transform'][item] +'deg)'
              break
          }
        }
      }

      //添加样式
      node.style.transform = node.style.webkitTransform = text
    }else if(arguments.length === 2){
      val = node['transform'][type]
      //如果val是undefined，根据type修改返回的val
      if(typeof node['transform'][type] === 'undefined'){
        switch (type) {
          case 'translateX':
          case 'translateY':
          case 'rotate':
            val = 0
            break
          case 'scale':
            val =  1
            break
        }
      }
      // console.log(val)
      return val
    }
  }
  w.megumi.carousel = function(arr){
    var carouselWrap = document.querySelector('.carousel-wrap')

    if(carouselWrap){
      //保存小圆点个数
      var pointsLenghth = arr.length

      //判断是否无缝
      var needCarousel = carouselWrap.getAttribute('needCarousel')
      needCarousel = needCarousel === null ? false : true
      if(needCarousel){
        //将arr数组拼接自己
        arr = arr.concat(arr)
      }

      var ulNode = document.createElement('ul')
      var styleNode = document.createElement('style')
      ulNode.classList.add('list')
      //给ul添加li
      for(var i = 0; i < arr.length; i++){
        ulNode.innerHTML += `<li><a href="javascript:;"><img src="${arr[i]}" /></a></li>`
      }
      styleNode.innerHTML = ".carousel-wrap .list{width: " + arr.length + "00%;} .carousel-wrap .list li{width: "+ 1 / arr.length * 100 +"%;}"
      carouselWrap.appendChild(ulNode)
      document.head.appendChild(styleNode)

      var imgNodes = document.querySelector('.carousel-wrap > .list > li > a > img')
      setTimeout(() => {
        carouselWrap.style.height = imgNodes.offsetHeight + 'px'
      }, 100)

      //添加小圆点
      var pointsWrap = document.querySelector('.carousel-wrap > .points-wrap')
      if(pointsWrap){
        for(var i = 0; i < pointsLenghth; i++){
          //i为0时添加active类
          if(i === 0){
            pointsWrap.innerHTML += '<span class="active"></span>'
          }else{
            pointsWrap.innerHTML += '<span></span>'
          }

          //获取所有span
          var pointsSpan = document.querySelectorAll('.carousel-wrap > .points-wrap > span')
        }

      }

      /*滑屏
    * 1. 拿到元素一开始的位置
    * 2. 拿到手指一开始的位置
    * 3. 拿到手指move的实时距离
    * 4. 将手指移动的距离加给元素
    * */
      //手指一开始的位置
      var startX = 0
      //元素一开始的位置
      var elementX = 0
      //手指距离触屏时的距离
      var disX = 0
      //var translateX = 0
      var index = 0

      //手指触碰屏幕时的函数
      carouselWrap.addEventListener('touchstart', function (ev){
        ev = ev ||event
        var TouchC = ev.changedTouches[0]
        //清除定时器
        clearInterval(timer)

        //ulNode关闭过渡
        ulNode.style.transition = 'none'

        if(needCarousel){
          var index = megumi.css(ulNode, 'translateX') / document.documentElement.clientWidth
          index = Math.abs(index)
          //点击时是第一组的第一张 瞬间跳到第二组的第一张
          //点击时是第二组的最后一张，瞬间跳到第一组的最后一张
          if(index === 0){
            index += pointsLenghth
          }else if((1 + index) / 2 === pointsLenghth){
            index -= pointsLenghth
          }
          megumi.css(ulNode, 'translateX', -index * document.documentElement.clientWidth)
        }



        startX = TouchC.clientX
        elementX = megumi.css(ulNode, 'translateX')
      })
      // 手指滑动屏幕
      carouselWrap.addEventListener('touchmove', function (ev){
        ev = ev || event
        var TouchC = ev.changedTouches[0]
        //手指当前的位置
        var nowX = TouchC.clientX
        //手指距离触屏时的距离
        disX = nowX - startX

        // translateX = elementX + disX
        // //将ul的left设置为原来的left+改变的距离
        // // ulNode.style.left = elementX + disX + 'px'
        // ulNode.style.transform = 'translateX(' + translateX + 'px)'
        megumi.css(ulNode, 'translateX', elementX + disX)
      })
      // 手指离开屏幕
      carouselWrap.addEventListener('touchend', function (ev){
        v = ev || event
        //index抽象ul的位置
        // var index = translateX / document.documentElement.clientWidth
        index = megumi.css(ulNode, 'translateX') / document.documentElement.clientWidth
        //第一种：将index四舍五入
        // index = Math.round(index)
        //第二种：向右移动->index向上取整  向左移动->index向下取整
        if(disX > 0){
          index = Math.ceil(index)
        }else if(disX < 0){
          index = Math.floor(index)
        }
        //超出控制范围
        if(index > 0){
          index = 0
        }else if(index < 1 - arr.length){
          index = 1 - arr.length
        }
        xiaoyuandian(index)

        //给ul设置过渡
        ulNode.style.transition = '.5s transform'

        //  设置ul的位置
        // ulNode.style.left = index * document.documentElement.clientWidth + 'px'
        //更新translateX
        // translateX = index * document.documentElement.clientWidth
        // ulNode.style.transform = 'translateX(' + translateX + 'px)'
        megumi.css(ulNode, 'translateX', index * document.documentElement.clientWidth)

        //开启定时器
        if(needAuto){
          auto()
        }
      })

      //自动轮播的下标s
      var timer = null
      //判断是否自动播放
      var needAuto = carouselWrap.getAttribute('needAuto')
      needAuto = needAuto === null ? false : true
      if(needAuto){
        auto()
      }

      //自动轮播
      function auto(){
        clearInterval(timer)
        timer = setInterval(() => {
          //如果是最后一张，跳到第二组第一张
          if(index === 1 - arr.length){
            index = 1 - (arr.length / 2)
            //清掉过渡
            ulNode.style.transition = 'none'
            megumi.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
          }
          //要在图片以及移动到第二组第一张在进行轮播，否则过渡不会被消除
          setTimeout(() => {
            ulNode.style.transition = '1s transform'
            index--
            xiaoyuandian(index)
            megumi.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
          }, 0)
        }, 1000)
      }

      //小圆点active切换
      function xiaoyuandian(index){
        if(pointsWrap){
          //动态给小圆点添加active类
          for(var i = 0; i < pointsSpan.length; i++){
            //  排他思想，先移除所有span的active类
            pointsSpan[i].classList.remove('active')
          }

          //给-index添加类
          pointsSpan[-index % pointsLenghth].classList.add('active')
        }
      }

    }
  }
})(window)