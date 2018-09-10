/**
 * Author: 十月梦想
 * Email:  24920@163.com
 * Github: https://github.com/shiyuemengxiang
 * Blog   https://cncat.cn
 * Project "搞事情";
 * Date: 2018/9/6 0:24
 *
 */
var app;
window.onload=()=>{
    //启用严格模式
    'use strict';
    var copy=(obj)=>{
        return Object.assign({},obj)
    }

    app=new Vue({
        el:"#main",
        data:{
            list:[],
            complete:[],
            current:{
                title:"",
                completed:false,
                desc:"这里添加事件描述",
                date:new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日"+
                new Date().getHours()+"时"+new Date().getMinutes()+"分"+new Date().getSeconds()+"秒"
            }
        },
        //生命周期钩子(初始化读取localStirage数据)
        mounted:function(){
            this.list=ms.get('list')
        },
        methods:{
                merge:()=>{
                    console.log(app.current)
                    var is_update,id;
                    is_update=id=app.current.id;
                    if(is_update){
                        var index=app.find_index(id)
                        // var index=app.list.findIndex((item)=>{
                        //     return item.id==is_update;
                        // })
                        Vue.set(app.list,index,copy(app.current))
                    }else{
                        var title=app.current.title;
                        if(!title&&title!==0) return;
                        var todo=copy(app.current);
                        todo.id=app.next_id();
                        app.list.push(todo)
                    }
                    //清空表单内容
                        app.reset_current();
                },
                //设置更新的内容为当前的current对象
                set_current:(todo)=>{
                   app.current= copy(todo)
                },
                //清空输入框
                reset_current:()=>{
                    app.set_current({});
                },
            com:(id)=>{
                    var index=app.find_index(id);
                    app.list[index].completed=true;
                    if (app.list[index].completed) app.complete.push(app.list[index]);
                     app.list.splice(index,1);
            },
            //取消已完成的事项
            uncom:(index)=>{
                app.complete[index].completed=false;
                if(!app.complete[index].completed) app.list.push(app.complete[index]);
                //剔除已完成数组
                app.complete.splice(app.complete[index],1)
                console.log(app.complete);
            },
            //删除未完成任务
            remove:(id)=>{
                var index=app.find_index(id)
                app.list.splice(index,1)
                // console.log(app.list)
            },
            //删除已完成任务
            rm_work:(id)=>{
               var index=app.find_index(id)
                app.complete.splice(index,1);
            },
            //生成id
            next_id:()=>{
                    return app.list.length+1;
            },
            find_index:(id)=>{
                return app.list.findIndex((item)=>{
                    return item.id==id;
                })
            }
        },
        //vue监控list数组变化
        watch:{
            list:{
                deep:true,
                handler:function (now,old){
                    console.log(now,old)
                    if(now){
                        ms.set('list',now)
                    }else{
                        ms.set('list',[])
                    }
                }
            }
        }
    })
}