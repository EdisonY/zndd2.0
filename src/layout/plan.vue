<template>
    <el-dialog
        class="innerDetail cheme plan"
        title="运行图方案选择"
        width="30%"
        :append-to-body="true"
        :visible.sync="innerDrawer1">
        <div class="content">
            <el-card>
                <h4>{{innerData.alarmTypeDetailStr}}</h4>
                <p>{{innerData.orderNum}}次列车（车组号:{{innerData.trainId}}）在{{innerData.alarmSite}}发生{{innerData.alarmTypeDetailStr}}</p>
            </el-card>
            <el-card style="margin-bottom:40px">
                <h4>方案选择</h4>
                <el-radio v-for="(item,index) in plan" :key="index" v-model="radio1" :label="item.caseCode" border>{{item.adjustStatisticalDatas[0].name}} : {{item.adjustStatisticalDatas[0].trianNumbers[0]}}</el-radio>
            </el-card>
            <div class="btn">
                <el-button type="primary" size="small" @click="solve(0)">预览</el-button>
                <el-button type="success" size="small" @click="solve(1)">执行</el-button>
                <el-button type="danger" size="small" @click="innerDrawer1 = false">关闭</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import stroe from '../store/index'
export default{
    data () {
        return {
            innerDrawer1:false,
            innerData:{},
            radio1:1,
            plan:{}
        }
    },
    watch: {
        modulesAState:function name(newV,oldV) {
            this.innerData = newV.msg
        },
        planState:function name(newV,oldV) {
            this.plan = newV
            this.innerDrawer1 = true
        }
    },
    computed: {
        modulesAState () {
            return this.$store.state.springboard.scheme
        },
        planState(){
            return this.$store.state.springboard.plan
        }
    },
    mounted () {
        this.$EventBus.$on('showPlan',()=>{
            this.innerDrawer1 = true
        })  
    },
    methods:{
        solve(state){
            var self = this
            var auxiliaryDecision = {
                "alarmTypeDetail": this.innerData.alarmTypeDetail,
                "caseCode": 0,
                "executeStep": state == 1 ? this.innerData.executeStep : 0,
                "vid": this.innerData.vid
            }

            var alarmInfo = {
                "trainId":this.innerData.trainId,
                "alarmTypeDetail":this.innerData.alarmTypeDetail,
            }

            if(state){
                //执行
                this.$api.post('/api/iids-flat-adm/runGraph/confirm',alarmInfo).then(res => {
                    if(res.success){
                        self.$notify.success({
                            title: '执行成功',
                            message: res.message
                        });
                        self.innerDrawer1 = false
                        self.$router.push({ path: 'emergency' })
                    }
                })
            }else{
                //预览
                this.$api.post('/api/iids-flat-adm/web/trainGraph',alarmInfo).then(res => {
                    console.log(res)
                    if(res.success){
                        stroe.dispatch("springboard/getRunData", Math.random());
                        self.innerDrawer1 = false
                        window.localStorage.setItem('rungrap',JSON.stringify(res.data.trains))
                        localStorage.setItem("rungrap", JSON.stringify(res.data.trains));
                        // self.$refs.grap.initData()
                        // self.$router.push({ path: 'emergency' })
                    }
                })
            }

            
        }
    }
}
</script>

<style lang="scss" scoped>
.cheme .content{padding:20px 0 0 0;}
.cheme .el-dialog__body{padding-bottom: 0 !important;position: relative;}
.cheme .el-card{margin-bottom: 20px;}
.cheme .btn{position: absolute;right:20px;bottom:20px}
.cheme p strong{color: red;font-weight: bold;}
.plan .el-card__body label{width: 100%;margin-bottom: 10px;}
.plan .el-card__body .el-radio.is-bordered+.el-radio.is-bordered{margin: 0;}
</style>
