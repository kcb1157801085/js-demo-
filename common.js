function my$(id){
  return document.getElementById(id);
}
//兼容代码
//设置任意的标签中间的任意文本内容
function setInnerText(element,text){
	if(typeof element.textContent=="undefined"){
		element.innerText=text;
	}else{
		element.textContent=text;
}
}
//获取任意标签中间的文本内容
function getInnerText(element){
    if(typeof element.textContent=="undefined"){
      return element.innertext;
    }else{
    	return element.textContent;
    }
}
//获取任意一个父级元素的第一个子级元素
function getFirstElementChild(element){
   if(element.firstElementChild){
   	return element.firstElementChild;
   }else{
   	var node=element.firstChild;
   	while(node&&node.nodeType!=1){
   		node=node.nextSibling;
   	}
   	return node;
   }
}
//获取任意一个父级元素的最后一个子级元素
function getLastElementChild(element){
if(element.lastElementChild){
   	return element.lastElementChild;
   }else{
   	var node=element.lastChild;
   	while(node&&node.nodeType!=1){
   		node=node.previousSibling;
   	}
   	return node;
   }
}

//为任意元素，绑定任意的事件，任意的元素，事件的类型，事件处理函数
function addEventListener(element,type,fn){
	//判断浏览器是否支持这个方法
	if(element.addEventListener){
		element.addEventListener(type,fn,false);
	}else if(element.attachEvent){
		element.attachEvent("on"+type,fn)
	}else{
		element["on"+type]=fn;
	}
}

//为任意一个元素，解绑对应的事件
function removeEventListener(element,type,fnName){
	if(element.removeEventListener){
		element.removeEventListener(type,fnName,false);
	}else if(element.detachEvent){
		element.detachEvent("on"+type,fnName);
	}else{
		element["on"+type]=null;
	}
} 
//封装动画函数--任意一个元素移动到指定的目标位置
function animate(element,target){
//先清理定时器
clearInterval(element.timeId);
//只产生一个定时器
element.timeId=setInterval(function(){
  //获取div的当前位置
  var current = element.offsetLeft;//数字类型，没有px
  //div每次移动多少像素
  var step=10;
  //判断从左往右走还是从右往左走
  step=current<target?step:-step;
  //每次移动后的距离
  current+=step;
  //判断当前移动后的位置是否到达目标位置
  if(Math.abs(target-current)>Math.abs(step)){
    //没有到达目标继续移动
    element.style.left=current+"px";
  }else{
    //清理定时器
    clearInterval(element.timeId);
    //直接到达目标此处是为了防止出现除不尽的时候直接到达
    element.style.left=target+"px";
  }
},20);
}



//封装获取浏览器向上（左）卷曲出去的距离的值
function getScroll(){
   return{
    //浏览器向上卷曲出去的距离
    top:window.pageYoffset||document.documentElement.scrollTop||document.body.scrollTop||0,
    //浏览器向左卷曲出去的距离
    left:window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0
   };  
}


//变速动画封装
function slowAnimate(element,target){
//清理定时器
clearInterval(element.timeId);
element.timeId=setInterval(function(){
  //获取元素的当前位置
  var current=element.offsetLeft;
  //移动的步数
  var step=(target-current)/10;
    step=step>0?Math.ceil(step):Math.floor(step);
  current+=step;
  element.style.left=current+"px"; 
if(current==target){
  //清理定时器
  clearInterval(element.timeId);
}
//测试代码,代码没问题删除
console.log("目标位置："+target+"当前位置："+current+"每次移动的步数"+step);
},20);
}

//获取任意一个元素的任意一个样式属性的值attr要获取的属性
function getStyle(element,attr){
   //判断浏览器是否支持这个方法
   if(window.getComputedStyle){
    return window.getComputedStyle(element,null)[attr];

   }else{
    return element.currentStyle[attr];
   }
}


//封装缓动动画函数增加任意多个属性及回调函数+透明度+层级
//element:要操作的元素
//json：属性的名字+属性的值的键值对集合
//fn：回调函数
function animateMore(element,json,fn){
  clearInterval(element.timeId);
  element.timeId=setInterval(function(){
    var flag=true;//默认，假设，全部到达目标 
    for(var attr in json){
      //判断这个属性attr中是不是opacity
      if(attr=="opacity"){
     //获取元素的当前的透明度
     var current=getStyle(element,attr)*100;
     //目标的透明度放大100倍
     var target=json[attr]*100;
     var step=(target-current)/10;
    step=step>0?Math.ceil(step):Math.floor(step);
     current+=step;
element.style[attr]=current/100;
    }else if(attr=="zIndex"){//判断这个属性attr中是不是zIndex
//层级改变就是直接改变这个属性的值
     element.style[attr]=json[attr];
      }else{
        //普通的属性
         //获取元素这个属性的当前的值
         var current=parseInt(getStyle(element,attr));
         //当前的属性对应的目标值
         var target=json[attr];
         //移动的步数
         var step=(target-current)/10;
         step=step>0?Math.ceil(step):Math.floor(step);
         current+=step;//移动后的值
         element.style[attr]=current+"px";
      }
         //是否到达目标
         if(current!=target){
          flag=false;
         }
    }
    if(flag){
      //清理定时器
      clearInterval(element.timeId);
      //所有的属性到达目标才能使用这个函数，前提是用户传入了这个函数
      if(fn){
        fn();
      }
    }
    console.log("目标位置："+target+"当前位置："+current+"每次移动的步数"+step);
  },20);
}


var evt={
  //window.event和时间参数对象e的兼容
  getEvent:function(evt){
    return window.event||evt;
  },
//可视区域的横坐标的兼容代码
  getClientX:function(evt){
    return this.getEvent(evt).clientX;
  },
//可视区域的纵坐标的兼容代码
  getClientY:function(evt){
    return this.getEvent(evt).clientY;
  },
  //页面向左卷曲出去的横坐标
  getScrollLeft:function(){
    return window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft||0;
  },
  //页面向上卷曲出去的纵坐标
  getScrollTop:function(){
    return window.pageYoffset||document.body.scrollTop||document.documentElement.scrollTop||0;
  },
  //相当于页面的横坐标(pageX或者是clientX+scrollLeft)
  getPageX:function(evt){
    return this.getEvent(evt).pageX?this.getEvent(evt).pageX:this.getClientX(evt)+this.getScrollLeft();
  },
  //相当于页面的纵坐标(pageY或者是clientY+scrollTop)
  getPageY:function(evt){
    return this.getEvent(evt).pageY?this.getEvent(evt).pageY:this.getClientY(evt)+this.getScrollTop();
  }
};





