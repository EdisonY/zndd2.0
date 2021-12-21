<template>
    <el-dialog
        class="innerDetail cheme"
        title="辅助解决方案"
        width="30%"
        :append-to-body="true"
        @close="close"
        :visible.sync="innerDrawer">
        <div class="content">
            <el-card>
                <h4>{{innerData.alarmTypeDetailStr}}</h4>
                <p>{{innerData.orderNum}}次列车（车组号:{{innerData.trainId}}）在{{innerData.alarmSite}}发生{{innerData.alarmTypeDetailStr}}</p>
            </el-card>
            <el-card>
                <h4>处置详情</h4>
                <p v-for="(item,index) in innerData.dispose">{{item}}</p>
            </el-card>
            <!-- <el-alert v-if="innerData.status == '方案已执行'" :title="innerData.status" type="success" show-icon :closable="false"></el-alert>
            <el-alert v-else-if="innerData.status == '方案待执行'" :title="innerData.status" type="info" show-icon :closable="false"></el-alert>
            <el-alert v-else-if="innerData.status == '方案已放弃'" :title="innerData.status" type="error" show-icon :closable="false"></el-alert> -->
            <p><strong>{{second}}</strong>秒后自动关闭</p>        
            <div class="btn">
                <el-button type="danger" size="small" @click="reject()">放弃</el-button>
                <el-button type="success" size="small" @click="solve(1)">执行</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import stroe from '../store/index'
export default{
    data () {
        return {
            innerDrawer:false,
            innerData:{},
            alarmInfo:{},
            second:30,
            countdown:null
        }
    },
    watch: {
        modulesAState:function name(newV,oldV) {
            var self = this

            this.innerData = newV.msg
            this.innerDrawer = true
            
            this.second = 30
            this.countdown = setInterval(() => {
                self.second--
                if(self.second == 0){
                    self.innerDrawer = false
                    clearInterval(this.countdown)
                }
            }, 1000);
        },
        case:function name(newV,oldV) {
            this.alarmInfo = newV.msg
        },
    },
    computed: {
        modulesAState () {
            return this.$store.state.springboard.scheme
        },
        case () {
            return this.$store.state.springboard.case
        }
    },
    methods:{
        solve(state){
            var self = this
            var auxiliaryDecision = {
                "alarmTypeDetail": this.innerData.alarmTypeDetail,
                "caseCode": 0,
                "executeStep": state == 1 ? this.innerData.executeStep : 0,
                "vid": this.innerData.vid,
                "aidDesSubStepDtoList":this.innerData.aidDesSubStepDtoList
            }
            this.$api.post('/api/iids-flat-adm/aid_decision/execute',auxiliaryDecision).then(res => {
                if(res.success){
                    self.$notify.success({
                        title: '执行成功',
                        message: res.message
                    });
                    if(self.innerData.executeStep == 1){
                        self.$api.post('/api/iids-flat-adm/runGraph/case',self.alarmInfo).then(res => {
                            if(res.success){
                                self.$notify.success({
                                    title: '执行成功',
                                    message: res.message
                                });
                                if(res.data && res.data.length > 1){
                                    stroe.dispatch("springboard/getPlanData", res.data);
                                    self.innerDrawer = false
                                    self.second = 30
                                }
                            }else{
                                self.$notify.error({
                                    title: '执行失败',
                                    message: res.message
                                });
                            }
                        })
                    }else{
                        self.innerDrawer = false
                        self.second = 30
                    }
                    
                }else{
                    self.$notify.error({
                        title: '执行失败',
                        message: res.message
                    });
                }
                
            })
        },
        close(){
            this.innerDrawer = false
            clearInterval(this.countdown)
            this.countdown =  null
        },
        reject(){
            var self = this
            //放弃
            console.log(this.innerData);
            var auxiliaryDecision = {
                "alarmTypeDetail": this.innerData.alarmTypeDetail,
                "caseCode": 0,
                "executeStep": 0,
                "vid": this.innerData.vid,
                "aidDesSubStepDtoList":this.innerData.aidDesSubStepDtoList
            }
            this.$api.post('/api/iids-flat-adm/aid_decision/execute',auxiliaryDecision).then(res => {
                // self.$api.post('/api/iids-flat-adm/runGraph/case',self.alarmInfo).then(res => {
                //     console.log(res.data)
                //     if(res.data && res.data.length > 1){
                //         stroe.dispatch("springboard/getPlanData", res.data);
                //         self.drawer = false
                //     }
                // })
                if(res.success){
                    self.$notify.success({
                        title: '执行成功',
                        message: res.message
                    });
                    self.innerDrawer = false
                }else{
                    self.$notify.error({
                        title: '执行失败',
                        message: res.message
                    });
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.cheme{z-index: 2011 !important}
.cheme .content{padding:20px 0 0 0;}
.cheme .el-dialog__body{padding-bottom: 0 !important;position: relative;}
.cheme .el-card{margin-bottom: 20px;}
.cheme .btn{position: absolute;right:20px;bottom:20px}
.cheme p strong{color: red;font-weight: bold;}
</style>
