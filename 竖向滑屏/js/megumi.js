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
            case 'translateZ':
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
  w.megumi.vMove = function (wrap){
    //滑屏元素
    let item = wrap.children[0]
    megumi.css(item, 'translateZ', 0)
    //滑屏可以滑动的最大值
    let minY = wrap.clientHeight - item.clientHeight
    //滑屏元素一开始的位置 手指一开始的位置
    let elementY
    let startY
    //实现快速滑屏的变量
    //手指触摸的时候的时间以及item的位置
    let lastTime = 0
    let lastPoint = 0
    //手指移动的时间差和距离差
    let disTime = 0
    let disPoint = 0
    wrap.addEventListener('touchstart', function (ev){
      //关闭橡皮筋效果
      item.style.transition = 'none'
      var touchC = ev.changedTouches[0]
      startY = touchC.clientY
      elementY = megumi.css(item, 'translateY')
      //修改lastTime和lastPoint
      lastTime = new Date().getTime()
      lastPoint = touchC.clientY
      // lastPoint = megumi.css(item, 'translateY')
    })

    wrap.addEventListener('touchmove', function (ev){
      console.log(2)
      let touchC = ev.changedTouches[0]
      let nowY = touchC.clientY
      let disY = nowY - startY
      let translateY = elementY + disY
      //橡皮筋效果，随着向右拉动，item移动的距离逐渐变小
      //在move的过程中，每一次手指touchmove真正的有效距离在慢慢变小，元素的滑动距离还是在变大
      //disY：整个move过程的实际距离
      //disPoint：整个手指touchmove的真正有效距离

      //修改nowTime和nowPoint
      let nowTime = new Date().getTime()
      let nowPoint = touchC.clientY
      // let nowPoint = megumi.css(item, 'translateY')
      disTime = nowTime - lastTime
      disPoint = nowPoint - lastPoint

      lastTime = nowTime
      lastPoint = nowPoint

      if(translateY > 0){
        item.handMove = true
        // (0, 0.5)
        let scale = document.documentElement.clientHeight / ((document.documentElement.clientHeight + translateY) * 2)
        //使用这种方式会导致itemscale可能会变为负值，要保证scale是大于0的
        // var scale = 1 - (disY / wrap.clientHeight)
        translateY = megumi.css(item, 'translateY') + disPoint * scale
        //不能用elementY，要获得item的实时距离
        // translateY = elementY + disY * scale
      }else if(translateY < minY){
        item.handMove = true
        let over = minY - translateY
        let scale = document.documentElement.clientHeight / ((document.documentElement.clientHeight + over) * 2)
        translateY = megumi.css(item, 'translateY') + disPoint * scale
      }else{
        item.handMove = false
      }
      // console.log(translateY)
      megumi.css(item, 'translateY', translateY)
    })

    wrap.addEventListener('touchend', function (){
      if(!item.handMove){
        let translateY = megumi.css(item, 'translateY')
        //计算手指滑动的速度
        let speed = disPoint / disTime
        console.log(disPoint, disTime

        //如果速度很小，让它不要有过渡效果，将speed变成0即可
        speed = Math.abs(speed) < 0.2 ? 0 : speed
        let targetY = translateY + speed * 200
        //如果item的translateY大于零的话，让它重置为0
        // item.style.transition = '0.5s transform'
        let bsr = ""
        let time = Math.abs(speed) * 0.2
        time = time > 0 && time < 1 ? 1 : time
        if(targetY > 0){
          // item.style.transition = '0.5s transform'
          targetY = 0
          // megumi.css(item, 'translateY', translateY)
          bsr = "cubic-bezier(.26, 1.51, .68, 1.54)"
        }else if(targetY < minY){
          // item.style.transition = '0.5s transform'
          //如果item向左滑动的距离超过了他最远的距离，让它重置为最远的距离
          targetY = minY
          // megumi.css(item, 'translateY', translateY)
          bsr = "cubic-bezier(.26, 1.51, .68, 1.54)"
        }
        item.style.transition = time + "s "+ bsr +" transform"
        // megumi.css(item, 'translateY', targetY)
      }else{
        console.log(4)

        let translateY = megumi.css(item, 'translateY')
        //如果item的translateY大于零的话，让它重置为0
        item.style.transition = '0.5s transform'
        if(translateY > 0){
          translateY = 0
          megumi.css(item, 'translateY', translateY)
        }else if(translateY < minY){
          //如果item向左滑动的距离超过了他最远的距离，让它重置为最远的距离
          translateY = minY
          megumi.css(item, 'translateY', translateY)
        }
      }
    })
  }
})(window)