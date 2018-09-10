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
    //task组件
    Vue.component("task",{
        template:"#task_tpl",
        props:["todo"],
        methods:{
            action:(name,params)=>{
                Event.$emit(name,params);
            },
            // set_current:(params)=>{
            //     app.set_current(params)
            // }
        }
    })
    //事件调取器
    var Event=new Vue();
    app=new Vue({
        el:"#main",
        data:{
            list:[],
            complete:[],
            current:{
                title:"",
                completed:false,
                alert_at:"",
                last_id:0,
                desc:"",
                date:new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日"+
                new Date().getHours()+"时"+new Date().getMinutes()+"分"+new Date().getSeconds()+"秒"
            }
        },
        //生命周期钩子(初始化读取localStirage数据)
        mounted:function(){
            this.list=ms.get('list');
            //挂载上一个id
            this.last_id=ms.get("last_id") || app.last.last_id;
            console.log(this.current.last_id)
            //接收this
            var that=this;
            //更新内容
            Event.$on('set_current',(todo)=>{

                // console.log("todo:",todo)
                app.set_current(todo);
            })
            //取反修改完整状态
            Event.$on('toggle_complete',(id)=>{
              that.toggle_complete(id);
            })
            //详情显示关闭/开启
            Event.$on('toogle_detail',(params)=>{
              that.toogle_detail(params)
            })
            //删除条目
            Event.$on('remove',(params)=>{
              that.remove(params)
            })
            //1s检查一次提醒事件
            setInterval(this.alerts_at,3000)
        },
        methods:{
            alerts_at:()=>{
               var list=ms.get('list') || [];
                list.forEach((item,i)=>{
                    if (!item.alert_at || item.completed || item.confirmed){
                        return;
                    }
                    var alert_at=item.alert_at;
                    alert_at=new Date(alert_at).getTime()
                    var nowTime=new Date().getTime()
                    if(nowTime>=alert_at){
                        var confirmed =confirm("亲爱的用户,您的计划:"+item.title+"完成了吗?")
                        //给list的子项添加已经提醒
                        Vue.set(app.list[i],'confirmed',confirmed)
                        console.log("到达提醒时刻")
                    }else{
                        console.log("没有到达指定时间")
                    }
                })
            },
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
                        app.last_id++;
                        ms.set('last_id',app.last_id)
                        todo.id=app.last_id;
                        todo.date=new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日"+
                new Date().getHours()+"时"+new Date().getMinutes()+"分"+new Date().getSeconds()+"秒"
                        console.log(todo.id)
                        app.list.push(todo)
                    }
                    //清空表单内容
                        app.reset_current();
                },
                //设置更新的内容为当前的current对象
                set_current:(todo)=>{
                    console.log("set_current")
                   app.current= copy(todo)
                },
                //清空输入框
                reset_current:()=>{
                    app.set_current({});
                },
                toggle_complete:(id)=>{
                    var i=app.find_index(id);
                   // app.list[i].completed=!app.list[i].completed;
                      //Vue取反
                    Vue.set(app.list[i],"completed",!app.list[i].completed)
                    console.log(app.list[i].completed)
                },
            //删除未完成任务
            remove:(id)=>{
                var index=app.find_index(id)
                app.list.splice(index,1)
                // console.log(app.list)
            },
            //生成id
            next_id:()=>{
                    return app.last_id+1;
            },
            find_index:(id)=>{
                return app.list.findIndex((item)=>{
                    return item.id==id;
                })
            },
            //显示详情
            toogle_detail:(id)=>{
            	var index=app.find_index(id);
            	console.log(index)
            	app.list[index].show_detail;
            	Vue.set(app.list[index],'show_detail',!app.list[index].show_detail)
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