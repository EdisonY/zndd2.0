<template>
    <el-dialog
        class="innerDetail cheme rungrapM"
        title="运行图预览"
        width="96%"
        :append-to-body="true"
        :visible.sync="innerDrawer2"
        :before-close="handleClose">
        <div class="content">
            <!-- <img src="../assets/line.png" /> -->
            <div class="dashboard-container">
                <rungrap ref="grap" :rungrap-data="rungrapData" />
            </div>
            <div class="btn">
                <el-button type="success" size="small" @click="solve(1)" :disabled="isForm">执行</el-button>
                <el-button type="danger" size="small" @click="close()">关闭</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import rungrap from '../layout/common.vue'
export default{
    data () {
        return {
            innerDrawer2:false,
            innerData:{},
            rungrapData:{},
            isForm:false
        }
    },
    components:{
        rungrap
    },
    watch: {
        RunState:function name(newV,oldV) {
            this.innerDrawer2 = true
        }
    },
    computed: {
        RunState () {
            return this.$store.state.springboard.run
        },
    },
    created () {
        var self = this
        this.rungrapData.line = window.sessionStorage.getItem('line')

        this.rungrapData.multiply = this.$route.meta.type
        switch (window.sessionStorage.getItem('line')) {
            case '98':
                self.rungrapData.station = [
                    [0,0,'T2航站楼'],
                    [1,0.6,'T3航站楼'],
                    [2,2,'三元桥'],
                    [3,0.4,'东直门']
                ]
            break;
            case '7':
                self.rungrapData.station = [
                    [0,0,'北京西站'],
                    [1,3.7,'湾子'],
                    [2,2.5,'达官营'],
                    [3,4.2,'广安门内'],
                    [4,3.5,'菜市口'],
                    [5,2.7,'虎坊桥'],
                    [6,3.1,'珠市口'],
                    [7,2.7,'桥湾'],
                    [8,2.8,'磁器口'],
                    [9,3.1,'广渠门内'],
                    [10,3.4,'广渠门外'],
                    [11,3.3,'双井'],
                    [12,3.4,'九龙山'],
                    [13,2.6,'大郊亭'],
                    [14,2.6,'百子湾'],
                    [15,2.8,'化工'],
                    [16,3.5,'南楼梓庄'],
                    [17,2.7,'欢乐谷景区'],
                    [18,3.9,'垡头'],
                    [19,3.2,'双合'],
                    [20,2.8,'焦化厂'],
                    [21,4,'黄厂'],
                    [22,4.2,'郎辛庄'],
                    [23,5.2,'黑庄户站'],
                    [24,5.9,'万盛西'],
                    [25,4.6,'万盛东'],
                    [26,3,'群芳'],
                    [27,3.1,'高楼金站'],
                    [28,3.8,'花庄'],
                    [29,4,'环球度假区'],
                    [30,4,'环球度假区'],
                    [31,4,'环球度假区'],
                    [32,4,'环球度假区']
                ]
            break;
            case '19':
                self.rungrapData.station = [
                    // [0,0,'新宫站'],
                    // [1,0.4,'新宫车辆段'],
                    // [2,1,'新发地站'],
                    // [3,1,'草桥站'],
                    // [4,1,'右安门外站'],
                    // [5,1,'牛街站'],
                    // [6,1,'金融街站'],
                    // [7,1,'平安里站'],
                    // [8,1,'积水潭站'],
                    // [9,1,'北太平庄站'],
                    // [10,1,'牡丹园站']
                    [0,0,"新宫站"],
                    [1,0.9,"新宫车辆段"],
                    [2,2.7,"新发地站"],
                    [3,2.6,"草桥站"],
                    [4,2.7,"右安门外站"],
                    [5,3,"牛街站"],
                    [6,2.1,"金融街站"],
                    [7,2.7,"平安里站"],
                    [8,1.6,"积水潭站"],
                    [9,2.5,"北太平庄站"],
                    [10,0.9,"牡丹园站"]
                ]
            break;
            case '28':
                self.rungrapData.station = [
                    [0,0,'东大桥站'],
                    [1,1,'京广桥站'],
                    [2,1,'光华路站'],
                    [3,1,'核心区站'],
                    [4,1,'大望路站'],
                    [5,1,'北京东站'],
                    [6,1,'大郊亭站'],
                    [7,1,'广渠路站'],
                    [8,1,'广渠东路站']
                ]
            break;
            case '999':
                self.rungrapData.station = [
                    [0,0,'左侧站'],
                    [1,1,'中间站'],
                    [2,1,'右侧站']
                ]
            break;
        }

        // *配置上下行线路及坐标主颜色，组件内已默认，可自定义设置
        this.rungrapData.colors = ['#5793f3', '#d14a61']

        // *确认获取到运行图源数据后，将源数据挂载到浏览器本地session中，key值为rungrap。并执行运行图组件内的initData方法
        // * window.sessionStorage.setItem('rungrap',your get data

        // function initData(){
            
        // }
        // initData()
    },
    mounted(){
        var self = this
        this.$EventBus.$on('trigger',(msg)=>{
            console.log(msg);
            if(msg.form == 1){
                //从应急事件点开的运行图
                this.isForm = true
            }else{
                this.isForm = false
            }
            this.innerDrawer2 = true
            this.$api.post('/api/iids-flat-adm/web/trainGraph').then(res => {
                if(res.success){
                    self.$notify.success({
                        title: '执行成功',
                        message: res.message
                    });
                    window.localStorage.setItem('rungrap',JSON.stringify(res.data.trains))
                    self.$refs.grap.initData()
                }
            })
            this.$nextTick(()=>{
                this.$refs.grap.initData()
            })
        })
    },
    methods:{
        solve(state){
            var self = this
            var alarmInfo = {
                "trainId":this.innerData.trainId,
                "alarmTypeDetail":this.innerData.alarmTypeDetail,
            }
            //执行
            this.$api.post('/api/iids-flat-adm/runGraph/confirm',alarmInfo).then(res => {
                if(res.success){
                    self.$notify.success({
                        title: '执行成功',
                        message: res.message
                    });
                    self.innerDrawer2 = false
                    self.$router.push({ path: 'emergency' })
                }
            })
        },
        handleClose(done){
            this.$EventBus.$emit('closeRungrap')
            done()
        },
        close(){
            this.innerDrawer2 = false
            if(!this.isForm){
                this.$EventBus.$emit('showPlan')
            }else{

            }
        }
    }
}
</script>

<style lang="scss" scoped>
// .cheme .content{padding:20px 0 0 0;}
.cheme .el-dialog__body{padding-bottom: 0 !important;position: relative;}
.cheme .el-card{margin-bottom: 20px;}
.cheme .btn{position: absolute;right:20px;bottom:20px}
.cheme p strong{color: red;font-weight: bold;}
// .rungrap img{width: 100%;margin-bottom: 40px;}
.dashboard-container{height: calc(100vh - 200px);width: 100%;position: relative;z-index: 99;margin-bottom: 40px;min-height: 600px;}
.rungrapM{z-index: 2021 !important;}
</style>