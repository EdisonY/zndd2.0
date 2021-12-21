<template>
<div class="emergency command">
    <div class="search">
        <ul>
            <li>
                <label>
                    <strong>CODE</strong>
                    <el-input v-model.number="searchData.code_eq" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
                <label>
                    <strong>ID</strong>
                    <el-input v-model.number="searchData.id_eq" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
                <label>
                    <strong>名称</strong>
                    <el-input v-model="searchData.name_eq" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
            </li>
            <li>
                <label>
                    <strong>类型ID</strong>
                    <el-input v-model.number="searchData.type_id_eq" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
                <label>
                    <strong>值</strong>
                    <el-input v-model.number="searchData.value_eq" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
            </li>
        </ul>
        <div class="f_right">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search(1)" :loading="loading">查询</el-button>
            <!-- <el-button type="primary" size="small" icon="el-icon-switch-button" :loading="loading" @click="search()">重置</el-button> -->
            <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="dialogVisible = true , title = '新建系统配置类型'">新建</el-button>
        </div>
    </div>
    <div class="bj">
        <el-table
        border
        :data="tableData"
        v-loading="loading"
        align="center"
        style="width: 100%">
            <el-table-column
                fixed
                prop="code"
                label="CODE">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="value"
                label="值">
            </el-table-column>
            <el-table-column
                prop="type_id"
                label="类型ID">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="更新时间">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
                <template #default="scope">
                    <el-button prop="id" @click.native.prevent="propUpdate(scope.row)"
                        plain
                        size="small">
                        更新
                    </el-button>
                    <el-popconfirm confirm-button-text='好的'  cancel-button-text='不用了'  icon="el-icon-info"  icon-color="red"  title="确定删除此条数据？" @onConfirm="delet(1)">
                        <!-- <el-button slot="reference" prop="id" @click.native.prevent="delet(scope.row.id)" plain size="small">删除</el-button> -->
                        <el-button type="danger" slot="reference" prop="id" plain size="small">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="pager" background layout="prev, pager, next" :total="tableTotal" :page-size="10" class="fontBottom" @current-change="changePage" :current-page.sync="currentPage1"></el-pagination>
    </div>
    <el-dialog
        class="dialogMain"
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
    <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
        <ul>
            <li>
                <label>
                    <el-form-item prop="code">
                        <strong class="first">CODE</strong>
                        <el-input v-model.number="sendData.code" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li v-if="update">
                <label>
                    <el-form-item prop="createTime">
                        <strong class="first">创建时间</strong>
                        <el-input v-model="sendData.createTime" placeholder="请输入内容" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li v-if="update">
                <label>
                    <el-form-item prop="id">
                        <strong class="first">ID</strong>
                        <el-input v-model.number="sendData.id" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="type_id">
                        <strong class="first">类型ID</strong>
                        <el-input v-model.number="sendData.type_id" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="value">
                        <strong class="first">值</strong>
                        <el-input v-model.number="sendData.value" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="name">
                        <strong class="first">名称</strong>
                        <el-input v-model="sendData.name" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li v-if="update">
                <label>
                    <el-form-item prop="updateTime">
                        <strong class="first">更新时间</strong>
                        <el-input v-model="sendData.updateTime" placeholder="请输入内容" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
        </ul>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" size="small">取 消</el-button>
        <el-button type="primary" @click="sendInfo()" size="small">确 定</el-button>
    </span>
    </el-dialog>

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
            update:false,
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
                value: '车辆故障',
                label: '车辆故障',
                children: [{
                    value: '牵引与制动',
                    label: '牵引与制动',
                    children: [{
                        value: '牵引无流',
                        label: '牵引无流'
                    },{
                        value: '制动故障',
                        label: '制动故障'
                    }]
                },{
                    value: '车门故障',
                    label: '车门故障',
                    children: [{
                        value: 1,
                        label: '单个车门故障'
                    },{
                        value: '全列车门故障',
                        label: '全列车门故障'
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
            }],
            searchTime:'',
            searchData:{
                
            },
            sendData:{},
            errLocationValue:'',
            errLocation: [],
            rules: {
                code: [
                    { required: true, message: '请输入CODE', trigger: 'blur' },
                    { type: 'number', message: 'CODE必须为数字值'}
                ],id:[
                    { required: true, message: '请输入ID', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字值'}
                ],name:[
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],value:[
                    { required: true, message: '请输入值', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字值'}
                ],type_id:[
                    { required: true, message: '请输入类型ID', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字值'}
                ]
            },
            innerData:{
                list:[]
            },
            title:''
        };
    },
    created () {
        var admStation = {
            page:1,
            size:10
        }
        var self = this
        this.search()
    },
    methods: {
        handleClose(){
            this.update = false
            this.dialogVisible = false
            this.$refs['formName'].resetFields();
            this.sendData = {}
        },
        search(value,page){
            var self = this
            self.loading = true

            this.searchData.page = page ? page : 1
            this.searchData.size = 10

            for (const key in this.searchData) {
                if(this.searchData[key] == ''){
                    delete this.searchData[key]
                }
            }

            this.$api.get('/api/confDetail/page',this.searchData).then(res => {
                if(res.success){
                    self.loading = false
                    self.tableTotal = res.data.total
                    self.tableData = []
                    for (let index = 0; index < res.data.records.length; index++) {
                        self.tableData.push({
                            id: res.data.records[index].id,
                            code: res.data.records[index].code,
                            createTime: res.data.records[index].createTime,
                            name: res.data.records[index].name,
                            updateTime: res.data.records[index].updateTime,
                            value: parseInt(res.data.records[index].value),
                            type_id: res.data.records[index].type_id
                        })
                    }
                    if(res.data.total > 10){
                        self.pager = true
                    }else{
                        self.pager = false
                    }
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        delet(id){
            var self = this
            this.$api.delete('/api/confDetail',{id:id}).then(res => {
                if(res.success){
                    self.search()
                    self.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    });
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
        infoById(id){
            this.drawer = true
            var self = this
            var infoId = {infoId:id}
            this.drawerData = []
            this.drawerLoading = true
            this.$api.get('/api/alert_detail/select_list_by_infoId',infoId).then(res => {
                self.drawerLoading = false
                if(res.success){
                    for (let index = res.data.length - 1; index >= 0; index--) {
                        res.data[index].time = GMTToStr(res.data[index].time)
                        self.drawerData.push(res.data[index])
                    }
                    console.log(self.drawerData);
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        sendInfo(){
            var self = this
            this.$refs['formName'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return
                }else{
                    self.sendData.code = parseInt(self.sendData.code)
                    postApi()
                }
            })
            function postApi() {
                if(self.update){
                    self.$api.put('/api/confDetail',self.sendData).then(res => {
                        if(res.success){
                            self.handleClose()
                            self.search()
                            self.$notify.success({
                                title: '更新成功',
                                message: res.message
                            });
                        }else{
                            self.$notify.error({
                                title: '错误',
                                message: res.message
                            });
                        }
                    })
                }else{
                    self.$api.post('/api/confDetail',self.sendData).then(res => {
                        if(res.success){
                            self.handleClose()
                            self.search()
                            self.$notify.success({
                                title: '更新成功',
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
            }
            
            
        },
        innerDetail(id,type,message){
            var self = this
            this.innerDrawer = true
            this.innerData.type = type
            this.innerData.message = message
            this.innerLoading = true
            this.$api.get('/api/alert_detail_box/select_one_by_detailId',{detailId:id}).then(res => {
                if(res.success){
                    self.innerLoading = false
                    self.innerData.list = res.data.message.dispose
                    self.innerData.status = res.data.status
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        propUpdate(data){
            console.log(data);
            this.title = '更新系统配置类型'
            this.update = true
            this.sendData = JSON.parse(JSON.stringify(data))
            this.dialogVisible = true
        }
    }
}
</script>

<style>

.search{padding:30px 0 0 0;position: relative;}
.search ul li{color: #131523;padding-bottom: 20px;font-size: 14px;}
.search ul li label{width: 440px;display: inline-block;}
.search ul li .middleInput,.search ul li .el-date-editor--daterange.el-input__inner,.search ul li .el-select,.search ul li .el-cascader{width: 300px;}
.search ul li strong{display: inline-block;width: 60px;}
.search .f_right{position: absolute;right: 0;bottom: 50px;}
.search .f_right .el-button--primary{background-color: #0058FF;width: auto;font-size: 14px;height: 32px;padding:8px 15px}
.el-table,.el-table th,.el-table tr{background-color: #E4E9F2 !important;color: #4B5A80;text-align: center;}
.el-table__body tr.hover-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td{background-color: #E4E9F2 !important;}
.el-table td{border-bottom: 1px solid #D7DBEC !important;color: #192038;font-size: 14px;}
.el-table::before,.el-table__fixed-right::before,.el-table__fixed::before{display: none}
.fontBottom{position: absolute;right: 20px;bottom: 40px;}
/* .dialogMain .el-dialog{background: #174680;} */
/* .dialogMain .el-dialog__title,.dialogMain .el-dialog__body{color: #fff;} */
.dialogMain ul{padding:20px 0 0 0;}
.dialogMain ul li{padding-bottom:20px;}
.dialogMain ul li label{margin-right: 20px;}
.dialogMain ul li label label{margin-right: 0;}
.dialogMain ul li strong{padding-right: 10px;display: inline-block;font-size: 14px;}
.dialogMain ul li strong.first{width: 95px;text-align: right;}
.dialogMain ul li .middleInput{width: 260px;}
.dialogMain ul li .el-input__inner{color: #444;}

.el-dialog__header{border-bottom: 1px solid #D7DBEC;padding: 0 20px;font-size: 16px;height: 48px;line-height: 48px;}
.el-dialog__headerbtn{font-size: 25px;font-weight: bold;top: 10px;}
.el-dialog__body{padding-top: 0;}
.emergency .el-drawer__body{padding: 20px;}
.emergency .el-drawer__body ul{padding: 40px 0 0 0;}
.emergency .el-drawer__body ul h4{font-size: 18px;font-weight: bold;color: #3E4977;padding-bottom: 10px;}
.emergency .el-drawer__body ul p{font-size: 14px;color: #131523;}

.el-table td, .el-table th.is-leaf{border-bottom: 1px solid #D7DBEC;height: 55px;}
.el-table td{background: #fff;}
.el-table td .cell{text-align: center;padding:0}
.el-table td .cell button{border:1px solid #0058FF;color: #0058FF;}
.el-table td .cell .el-button--danger.is-plain{color: #F56C6C;border-color: #fbc4c4;background: #fff;}
.el-table td .cell .el-button--danger.is-plain:focus,.el-table td .cell .el-button--danger.is-plain:hover{background: #fef0f0;}
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{border-right: 1px solid #D7DBEC;}
/* .el-table__body{border-left: 1px solid #D7DBEC;}
.el-table__header{border-left: 1px solid #D7DBEC;border-top: 1px solid #D7DBEC;} */

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{background-color: transparent;color: #7E84A3;}
.el-pagination.is-background .el-pager li:not(.disabled):hover{color: #7E84A3;}
.el-pagination.is-background .el-pager li:not(.disabled).active{background-color: #0058FF;}
.el-pagination.is-background .el-pager li:not(.disabled).active:hover{color: #fff;}

.bj{background: #fff;position: relative;padding-bottom: 100px;}

.el-dialog__body ul li .el-date-editor--daterange.el-input__inner,.el-dialog__body ul li .el-select,.el-dialog__body ul li .el-cascader,.el-dialog__body .el-input--prefix .el-input__inner{width: 160px;}
.el-date-editor.el-input{width: auto;}

.el-dialog .el-radio-button__orig-radio:checked+.el-radio-button__inner,.el-dialog .el-button--primary{background-color: #0058FF;}

.el-drawer__open .el-drawer.rtl{width: 424px !important;}
.el-drawer__open .el-button--primary{width: 98px;background-color: #0058FF;}
.el-drawer__open .el-card__body .el-button--primary{width: 56px;margin-left: 12px;}
.el-timeline-item__timestamp.is-top{color: #131523;font-size: 14px;margin-bottom: 20px;}
.el-timeline-item__node--normal{background-color: #fff;border:2px solid #0058FF;top: 1px;}

.command table td i{display: inline-block;width: 8px;height: 8px;border-radius: 8px;vertical-align: middle;margin-right: 10px;}
.command table td .success{background: #58FF00;}
.command table td .none{background: #FF450D;}
</style>