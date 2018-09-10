/**
 * Author: 十月梦想
 * Email:  24920@163.com
 * Github: https://github.com/shiyuemengxiang
 * Blog   https://cncat.cn
 * Project " ";
 * Date: 2018/9/6 1:21
 *
 */

(function(){
    window.ms={
        set:set,
        get:get,
    }
    function set(key,val){
        localStorage.setItem(key,JSON.stringify(val));
    }
    function get(key){
        var json=localStorage.getItem(key);
        if (json){
            return JSON.parse(json)
        }
    }
})()
ms.set("name","十月梦想")
var symx=ms.get("name")
console.log(symx)