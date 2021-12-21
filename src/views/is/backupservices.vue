<template>
    <div class="configuration command backup">
        <div class="bj">
            <el-table
            border
            :data="tableData"
            v-loading="loading"
            align="center"
            style="width: 100%">
                <el-table-column
                    fixed
                    prop="serviceName"
                    width="400"
                    label="设备名称">
                </el-table-column>
                <el-table-column
                    prop="instanceList.length"
                    width="200"
                    label="集群实例数">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="设备状态">
                    <template #default="scope">
                        <span class="status2 statusspan" v-if="scope.row.status == 2" icon="success"><i class="el-icon-success"></i>服务健康</span>
                        <span class="status1 statusspan" v-if="scope.row.status == 1" icon="success"><i class="el-icon-warning"></i>服务不健康</span>
                        <span class="status0 statusspan" v-if="scope.row.status == 0" icon="success"><i class="el-icon-error"></i>服务异常</span>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="100"
                    label="操作">
                    <template #default="scope">
                        <el-button prop="id" @click.native.prevent="detailMain(scope.row)"
                            plain
                            size="small">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
        class="dialogMain commandForm"
        :title="sendData.serviceName + '详情'"
        :visible.sync="dialogVisible"
        width="30%"
        top="5vh"
        :before-close="handleClose">
        <el-card class="box-card" v-for="item in sendData.instanceList">
                <ul>
                    <li>
                        <label>
                            <strong>设备IP</strong>
                            <span>{{item.ip}}</span>
                        </label>
                    </li>
                    <li>
                        <label>
                            <strong>设备端口</strong>
                            <span>{{item.port}}</span>
                        </label>
                    </li>
                    <li>
                        <label>
                            <strong>服务ID</strong>
                            <span>{{item.serviceId}}</span>
                        </label>
                    </li>
                    <li>
                        <label>
                            <strong>已运行时间</strong>
                            <span>{{item.upTime}}</span>
                        </label>
                    </li>
                    <li>
                        <label>
                            <strong>CPU使用率</strong>
                            <span>{{item.cpuUsage}}</span>
                        </label>
                    </li>
                    <li>
                        <label>
                            <strong>内存使用率</strong>
                            <span>{{item.jvmMaxMemory}}</span>
                        </label>
                    </li>
                </ul>
        </el-card>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()" size="small">关 闭</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
var int = null
import { timeInterval } from '@/utils/d3'
export default{
    data(){
        return{
            loading:false,
            searchData:{},
            namelist:[],
            tableData:[],
            reset:false,
            pager:false,
            tableTotal:0,
            dialogVisible:false,
            sendData:{
                instanceList:[{
                    'ip':'',
                }]
            },
            rules: {
                annotation: [
                    { required: true, message: '请输入参数注释', trigger: 'blur' }
                ],value:[
                    { required: true, message: '请输入参数数值', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        var self = this
        this.search()
        // this.$api.get('/api/iids-basedata/trafficParameter/class/all').then(res => {
        //     self.namelist = res.data
        //     for (let index = 0; index < self.namelist.length; index++) {
        //         self.namelist[index].value = self.namelist[index].classification
        //         self.namelist[index].label = self.namelist[index].name
        //     }
        //     console.log(self.namelist);
        // })
        function inter(){
            int = setInterval(self.search,5000)
        }
        inter()
        
    },
    methods: {
        search(value,page){
            var self = this
            self.loading = true
            this.$api.get('/api/iids-basedata/myActuator').then(res => {
                console.log(res);
                if(res.success){
                    self.loading = false
                    self.tableData = res.data
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        changePage(e){
            if(this.reset){
                this.search(false,e)
            }else{
                this.search(1,e)
            }
        },
        detailMain(data){
            this.dialogVisible = true
            this.sendData = JSON.parse(JSON.stringify(data))
        },
        handleClose(){
            this.dialogVisible = false
            this.sendData = {
                instanceList:[{
                    'ip':'',
                }]
            }
        },
        singPost(){
            var self = this
            let formData = new FormData()
            for(let key in this.sendData){
                formData.append(key, this.sendData[key])
            }
            this.$refs['formName'].validate((valid) => {
                if (valid) {
                    self.$api.put('/api/iids-basedata/trafficParameter/put',formData).then(res => {
                        console.log(res);
                        if(res.success){
                            self.$notify.success({
                                title: '成功',
                                message: res.message
                            });
                        }
                        self.dialogVisible = false
                        self.search()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            
        }
    },
    beforeRouteLeave(to, form, next) {
        var self = this
        clearInterval(int)
        next()
    }
}
</script>

<style lang="scss" scoped>
@keyframes myfirst
{
    from {opacity: 1;}
    to {opacity: 0.5;}
}

.search{padding:30px 0 0 0;position: relative;}
.search ul li{color: #131523;padding-bottom: 20px;font-size: 14px;}
.search ul li label{width: 440px;display: inline-block;}
.search ul li .middleInput,.search ul li .el-date-editor--daterange.el-input__inner,.search ul li .el-select,.search ul li .el-cascader{width: 300px;vertical-align: middle;}
.search ul li strong{display: inline-block;width: 90px;}
.search .f_right{position: absolute;right: 0;bottom: 50px;}
.search .f_right .el-button--primary{background-color: #0058FF;width: auto;font-size: 14px;height: 32px;padding:8px 15px}
.configuration .commandForm.dialogMain ul li strong{width: 120px;}
.configuration .commandForm.dialogMain ul li .bigInput{width: 350px;}
.backup .statusspan{font-size: 16px;}
.backup .status2{color: #67c23a;}
.backup .status1{color: #e6a23c;}
.backup .status0{color: #f56c6c;}
.backup .statusspan i{vertical-align: middle;margin-right: 10px;width: 20px;height: 20px;animation: myfirst 1s linear infinite alternate;}
.backup{padding-top: 20px;}

.backup .commandForm.dialogMain ul {padding: 0;}
.backup .commandForm.dialogMain ul li{line-height: 35px;padding: 0;}
.backup .commandForm.dialogMain ul li span{font-weight: bold;}
.backup .el-card{margin-bottom: 15px;}
</style>
