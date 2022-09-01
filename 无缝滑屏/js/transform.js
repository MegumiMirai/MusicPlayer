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
})(window)