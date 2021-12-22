<template>
<div class="malfunction">
    <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
        <ul>
            <li>
                <label>
                    <strong class="first">故障类型</strong>
                    <el-cascader v-model="sendData.alarmTypeX" :options="options" :show-all-levels="false" placeholder="请选择" class="middleInput" @change="getFlow"></el-cascader>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="startAlarmTime">
                        <strong class="first">发生时间</strong>
                        <el-date-picker
                            v-model="sendData.startAlarmTime"
                            type="date"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd"
                            class="middleInput"
                        >
                        </el-date-picker>
                    </el-form-item>
                </label>
            </li>
            <li v-if="dkl">
                <label>
                    <el-form-item prop="trainId">
                        <strong class="first">列车车组号</strong>
                        <el-input v-model.number="sendData.trainId" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="orderNum">
                        <strong>故障列车车次号</strong>
                        <el-input v-model.number="sendData.orderNum" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li v-if="!dkl">
                <label>
                    <el-form-item prop="largePassFlowCrowdLevel">
                        <strong class="first">车站客流量</strong>
                        <el-select v-model="sendData.largePassFlowCrowdLevel" filterable placeholder="请选择" class="middleInput">
                            <el-option
                            v-for="item in CrowdLevel"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </label>                
            </li>
            <li v-if="!dkl">
                <label>
                    <el-form-item>
                        <strong class="first">断面客流量</strong>
                        <!-- <el-switch
                            v-model="sendData.largePassFlowSectionFlow"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch> -->
                        <el-select v-model="sendData.largePassFlowSectionFlow" filterable placeholder="请选择" class="middleInput">
                            <el-option
                            v-for="item in FlowLevel"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>

                    </el-form-item>
                </label>                
            </li>
            <li>
                <label>
                    <el-form-item prop="stationId">
                        <strong class="first">故障列车位置</strong>
                        <el-select 
                            v-if="sendData.alarmTypeDetail == 402 || sendData.alarmTypeDetail == 201 || sendData.alarmTypeDetail == 202 || sendData.alarmTypeDetail == 301 || sendData.alarmTypeDetail == 302" 
                            v-model="sendData.stationId" filterable placeholder="请选择" class="middleInput"
                            
                        >
                            <el-option 
                                v-for="item in errLocationByAll"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-else v-model="sendData.stationId" filterable placeholder="请选择" class="middleInput"
                        @change="getAlarmSite(errLocation,sendData.stationId)">
                            <el-option
                                v-for="item in errLocation"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </label>
                <label>
                    <strong>故障列车行车方向</strong>
                    <el-radio-group v-model="sendData.upDown" size="middle">
                        <el-radio-button label="170">上行</el-radio-button>
                        <el-radio-button label="85">下行</el-radio-button>
                    </el-radio-group>
                </label>
                
            </li>
            <li>
                <label>
                    <strong class="first">备注</strong>
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="sendData.message" class="bigInput"></el-input>
                </label>
            </li>
            <li>
                <label>
                    <strong class="first">&nbsp;</strong>
                    <!-- <el-button @click="handleClose()" size="small">取 消</el-button> -->
                    <el-button type="primary" @click="sendInfo()" size="small">确 定</el-button>
                </label>
            </li>
        </ul>
    </el-form>
</div>


</template>

<script>
function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate() + ' ' + 
    date.getHours() + ':' + 
    date.getMinutes() + ':' + 
    date.getSeconds()
    return Str
}
export default {
    data() {
        return {
            dkl:true,
            reset:true,
            drawerLoading:true,
            currentPage1:1,
            drawer:false,
            drawerData:[],
            innerLoading:true,
            innerDrawer:false,
            pager:false,
            loading:true,
            textarea1:'',
            input:'',
            radio1:'',
            value:'',
            value1:'',
            dialogVisible:false,
            searchInput:'',
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            tempData:[],
            tableData: [],
            tableTotal:0,
            options: [{
                value: '',
                label: '车辆故障',
                children: [{
                    value: '',
                    label: '牵引与制动',
                    children: [{
                        value: 401,
                        label: '单牵引故障'
                    },{
                        value: 402,
                        label: '牵引故障'
                    },{
                        value: 403,
                        label: '制动故障'
                    }]
                },{
                    value: '',
                    label: '车门故障',
                    children: [{
                        value: 101,
                        label: '单个车门故障'
                    },{
                        value: 102,
                        label: '非连续多个车门无法关闭'
                    },{
                        value: 103,
                        label: '连续多个车门无法关闭'
                    },{
                        value: 112,
                        label: '非连续多个车门无法打开'
                    },{
                        value: 113,
                        label: '连续多个车门无法打开'
                    },{
                        value: 122,
                        label: '全列车门无法关闭'
                    },{
                        value: 123,
                        label: '全列车门无法打开'
                    }]
                },{
                    value: '',
                    label: '空调故障',
                    children: [{
                        value: 201,
                        label: '通风功能正常'
                    },{
                        value: 202,
                        label: '通风功能故障'
                    }]
                },{
                    value: '',
                    label: '广播故障',
                    children: [{
                        value: 301,
                        label: '人工广播正常'
                    },{
                        value: 302,
                        label: '人工广播故障'
                    }]
                },{
                    value: '辅助回路故障',
                    label: '辅助回路故障',
                    children: [{
                        value: '辅助回路故障',
                        label: '辅助回路故障'
                    }]
                },{
                    value: '车辆异音、异常晃动',
                    label: '车辆异音、异常晃动',
                    children: [{
                        value: '车辆异音、异常晃动',
                        label: '车辆异音、异常晃动'
                    }]
                },{
                    value: '受流器、接触轨故障',
                    label: '受流器、接触轨故障',
                    children: [{
                        value: '受流器、接触轨故障',
                        label: '受流器、接触轨故障'
                    }]
                },{
                    value: '车载ATP故障',
                    label: '车载ATP故障',
                    children: [{
                        value: '车载ATP故障',
                        label: '车载ATP故障'
                    }]
                },{
                    value: '其他车辆故障',
                    label: '其他车辆故障',
                    children: [{
                        value: '其他车辆故障',
                        label: '其他车辆故障'
                    }]
                }]
            },{
                value: 'ATS设备',
                label: 'ATS设备',
                children: [{
                    value: '未自动生成计划车次',
                    label: '未自动生成计划车次',
                    children: [{
                        value: '始终点未自动生成计划车次',
                        label: '始终点未自动生成计划车次'
                    },{
                        value: '车辆段未自动生成计划车次',
                        label: '车辆段未自动生成计划车次'
                    },{
                        value: '其他地点未自动生成计划车次',
                        label: '其他地点未自动生成计划车次'
                    }]
                },{
                    value: '脱机',
                    label: '脱机',
                    children: [{
                        value: '中心脱机',
                        label: '中心脱机'
                    },{
                        value: '站下设备脱机',
                        label: '站下设备脱机'
                    },{
                        value: '其他设备脱机',
                        label: '其他设备脱机'
                    }]
                },{
                    value: '复示不正确',
                    label: '复示不正确',
                    children: [{
                        value: '站下设备不正确',
                        label: '站下设备不正确'
                    },{
                        value: '其他设备不正确',
                        label: '其他设备不正确'
                    }]
                },{
                    value: '进路未触发',
                    label: '进路未触发',
                    children: [{
                        value: '车站进路未触发',
                        label: '车站进路未触发'
                    },{
                        value: '联络线进路未触发',
                        label: '联络线进路未触发'
                    },{
                        value: '全线进路未触发',
                        label: '全线进路未触发'
                    }]
                },{
                    value: '大屏故障',
                    label: '大屏故障',
                    children: [{
                        value: '大屏故障',
                        label: '大屏故障'
                    }]
                },{
                    value: 'ZC、LC故障',
                    label: 'ZC、LC故障',
                    children: [{
                        value: 'ZC、LC故障',
                        label: 'ZC、LC故障'
                    }]
                },{
                    value: '其他ATS故障',
                    label: '其他ATS故障',
                    children: [{
                        value: '其他ATS故障',
                        label: '其他ATS故障'
                    }]
                }]
            },{
                value: '辅助设备',
                label: '辅助设备',
                children: [{
                    value: '调度电话',
                    label: '调度电话',
                    children: [{
                        value: '调度电话无法呼叫全部车站',
                        label: '调度电话无法呼叫全部车站'
                    },{
                        value: '调度电话无法呼叫部分车站',
                        label: '调度电话无法呼叫部分车站'
                    },{
                        value: '调度电话无法呼叫全部变电站',
                        label: '调度电话无法呼叫全部变电站'
                    },{
                        value: '调度电话无法呼叫部分变电站',
                        label: '调度电话无法呼叫部分变电站'
                    }]
                },{
                    value: '无线调度台',
                    label: '无线调度台',
                    children: [{
                        value: '无线调度台无法呼叫全部列车',
                        label: '无线调度台无法呼叫全部列车'
                    },{
                        value: '无线调度台无法呼叫部分列车',
                        label: '无线调度台无法呼叫部分列车'
                    }]
                },{
                    value: '自动电话',
                    label: '自动电话',
                    children: [{
                        value: '自动电话故障',
                        label: '自动电话故障'
                    }]
                },{
                    value: 'CCTV',
                    label: 'CCTV',
                    children: [{
                        value: 'CCTV故障',
                        label: 'CCTV故障'
                    }]
                },{
                    value: '其他辅助设备故障',
                    label: '其他辅助设备故障',
                    children: [{
                        value: '其他辅助设备故障',
                        label: '其他辅助设备故障'
                    }]
                }]
            },{
                value: '通号设备故障',
                label: '通号设备故障',
                children: [{
                    value: '通号设备故障',
                    label: '通号设备故障',
                    children: [{
                        value: '轨旁设备故障',
                        label: '轨旁设备故障'
                    },{
                        value: '其他通号故障',
                        label: '其他通号故障'
                    }]
                }]
            },{
                value: '线路故障',
                label: '线路故障',
                children: [{
                    value: '线路故障',
                    label: '线路故障',
                    children: [{
                        value: '走行轨故障',
                        label: '走行轨故障'
                    },{
                        value: '接触轨故障',
                        label: '接触轨故障'
                    },{
                        value: '接触轨防护板、防护罩异常',
                        label: '接触轨防护板、防护罩异常'
                    },{
                        value: '其他线路故障',
                        label: '其他线路故障'
                    }]
                }]
            },{
                value: '建维故障',
                label: '建维故障',
                children: [{
                    value: '建维故障',
                    label: '建维故障',
                    children: [{
                        value: '建筑物设施故障',
                        label: '建筑物设施故障'
                    },{
                        value: '结构渗漏',
                        label: '结构渗漏'
                    },{
                        value: '其他建维故障',
                        label: '其他建维故障'
                    }]
                }]
            },{
                value: '供电设备故障',
                label: '供电设备故障',
                children: [{
                    value: '供电设备故障',
                    label: '供电设备故障',
                    children: [{
                        value: '接触轨无电',
                        label: '接触轨无电'
                    }]
                }]
            },{
                value: '其他故障',
                label: '其他故障',
                children: [{
                    value: '其他故障',
                    label: '其他故障',
                    children: [{
                        value: '其他故障',
                        label: '其他故障'
                    }]
                }]
            },{
                value: '',
                label: '大客流故障',
                children: [{
                    value: '',
                    label: '大客流',
                    children: [{
                        value: 501,
                        label: '大客流故障'
                    }]
                }]
            },{
                value: '',
                label: '站台门故障',
                children: [{
                    value: '',
                    label: '站台门打开',
                    children: [{
                        value: 601,
                        label: '列车进站过程中站台门打开'
                    },{
                        value: 602,
                        label: '列车出站过程中站台门打开'
                    }]
                }]
            }],
            searchTime:'',
            sendData:{
                upDown:85,
                alarmTypeX:[ "", "", 101 ],
                // alarmTypeDetail:123,
                // trainId:1901,
                // orderNum:2180
            },
            CrowdLevel:[{
                label:'正常',
                value:0
            },{
                label:'一般拥挤',
                value:1
            },{
                label:'比较拥挤',
                value:2
            },{
                label:'非常拥挤',
                value:3
            }],
            FlowLevel:[{
                label:'正常',
                value:0
            },{
                label:'拥挤',
                value:1
            }],
            errLocationValue:'',
            errLocation: [],
            errLocationByAll:[],
            rules: {
                trainId: [
                    { required: true, message: '请输入车组号', trigger: 'blur' }
                ],startAlarmTime:[
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],alarmType:[
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],orderNum:[
                    { required: true, message: '请输入车次号', trigger: 'blur' }
                ],alarmSite:[
                    { required: true, message: '请选择位置', trigger: 'change' }
                ],largePassFlowCrowdLevel:[
                    { required: true, message: '请选择客流密度', trigger: 'change' }
                ]
            },
            innerData:{
                list:[]
            }
        };
    },
    created () {
        var admStation = {"stationType":1}
        var self = this

        this.$api.post2('/api/iids-flat-adm/adm_station/selectListByType',admStation).then(res => {
            console.log(res);
            if(res.success){
                for (let index = 0; index < res.data.length; index++) {
                    self.errLocation.push({
                        value:res.data[index].stationId,
                        label:res.data[index].stationName
                    })                 
                }

                self.$api.post2('/api/iids-flat-adm/adm_station/selectListByType',{"stationType":4}).then(res => {
                    if(res.success){
                        self.errLocationByAll = JSON.parse(JSON.stringify(self.errLocation))
                        for (let index = 0; index < res.data.length; index++) {
                            self.errLocationByAll.push({
                                value:res.data[index].stationId,
                                label:res.data[index].stationName
                            })                 
                        }
                    }
                })

            }else{

            }
        })

        


    },
    methods: {
        sendInfo(){
            var self = this
            this.sendData.stopAreaNumber = 0
            this.sendData.platformId = 0
            this.sendData.physicsSectionType = 0
            this.sendData.stationId = this.sendData.alarmSite
            this.sendData.alarmSource = ''
            this.sendData.alarmState = 1
            this.sendData.alarmData = ''

            if(this.sendData.upDown){
                this.sendData.upDown = parseInt(this.sendData.upDown)
            }
            if(this.sendData.startAlarmTime){
                this.sendData.startAlarmTime += '.000' 
            }
            
            if(parseFloat(this.sendData.alarmTypeX[2]).toString() == "NaN"){
                self.$notify.error({
                    title: '错误',
                    message: '暂未获得该类型的故障CODE，请重新选择'
                });
                return
            }else{
                this.sendData.alarmTypeDetail = this.sendData.alarmTypeX[2]
            }

            if(this.sendData.alarmTypeDetail == 402 || this.sendData.alarmTypeDetail == 201 || this.sendData.alarmTypeDetail == 202 || this.sendData.alarmTypeDetail == 301 || this.sendData.alarmTypeDetail == 302){
                this.sendData.sectionFlag = 1
            }

            this.sendData.sectionFlag = 0
            this.sendData.reportClientIndex = JSON.parse(localStorage.getItem('userInfo')).stationId
            this.sendData.ifConfirmed = 0

            this.$refs['formName'].validate((valid) => {
                if (valid) {
                    if(this.sendData.startAlarmTime){
                        // this.sendData.startAlarmTime = GMTToStr(this.sendData.startAlarmTime)
                        this.$api.post('/api/iids-flat-adm/alert_info/send_info',this.sendData).then(res => {
                            if(res.success){
                                // self.search()
                                self.$notify.success({
                                    title: '录入成功',
                                    message: res.message
                                });
                            }else{
                                self.$notify.error({
                                    title: '错误',
                                    message: res.message
                                });
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
        getFlow(e){
            this.sendData.alarmTypeDetail = e[2]
            if(e[2] == 501){
                this.dkl = false
            }else{
                this.dkl = true
            }
        },
        getAlarmSite(data,index){
            for (let i = 0; i < data.length; i++) {
                if(data[i].value == index){
                    this.sendData.alarmSite = data[i].label
                }
                
            }
        }
    }
}
</script>

<style>


.malfunction ul{padding:20px 0 0 0;}
.malfunction ul li{padding-bottom:20px;}
.malfunction ul li label{margin-right: 20px;}
.malfunction ul li label label{margin-right: 0;}
.malfunction ul li strong{padding-right: 10px;display: inline-block;font-size: 14px;}
.malfunction ul li strong.first{width: 95px;text-align: right;}
.malfunction ul li .smallInput{width: 120px;}
.malfunction ul li .middleInput{width: 300px;}
.malfunction ul li .bigInput{width: calc(100% - 120px);vertical-align: text-top;}
.malfunction ul li .bigInput,.malfunction ul li .bigInput textarea{height: 100px !important;}
.malfunction .el-input__inner,.malfunction .el-cascader{height: 40px;line-height: 40px;}
</style>