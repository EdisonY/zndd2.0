<template>
  <div id="app">
    <router-view />
    <sing />
    <scheme />
    <plan />
    <rungrap />
    <warn />
  </div>
</template>

<script>
import Vue from "vue";
import sing from './layout/sing'
import scheme from './layout/scheme'
import plan from './layout/plan'
import rungrap from './layout/rungrap'
import warn from './layout/warn'

export default {
    name: 'App',
    components: { sing,scheme,plan,rungrap,warn },
    data(){
        return{
        }
    },
    async created() {
        var self = this
        
        if(!window.localStorage.getItem('log')){
            window.localStorage.setItem('log',JSON.stringify([]))
        }
        localStorage.setItem("line", 19);
        if(JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).stationId){
            this.ws.initWebSocket()
            var heart = {
                msgID:"",
                moduleCode:0,
                msgType:-1,
                msgCode:0,
                msgts:"",
                msg:{
                    userName:JSON.parse(localStorage.getItem('userInfo')).stationId + "的心跳应答"
                }
            }
            setInterval(()=>{
                self.ws.sendSock(heart)
            },3000)
        }
        // window.localStorage.setItem('line','station/maintain')
        this.$store.state.app.sidebar.opened = true
    },
    methods: {
        fatherMethod(){
            alert(2)
        }
    }
}
</script>
<style>
html body{font-family:'Microsoft YaHei' !important;}
body,html{height:100%;}
.clearfix:after{content:" ";display:block;clear:both;height:0}
.fl{float:left}
.fr{float:right}
*{margin:0;padding:0}
fieldset,img,input{border:0;background:none}
address,caption,cite,code,dfn,em,i,optgroup,strong,th,var{font-style:normal;font-weight:400}
h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:400}
button,input,optgroup,option,select,textarea{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;*font-size:100%}
body{line-height:1.5;font-size: 0.14rem;}
li,ol,ul{list-style:none}
a{text-decoration:none}
a:focus,input:focus,button:focus{outline:none}

.BMap_cpyCtrl,.anchorBL{display: none;}
#app .mobile.hideSidebar .sidebar-container{transform: none;width: auto !important;}
</style>