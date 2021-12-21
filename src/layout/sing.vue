<template>
<el-dialog
    class="dialogMain commandForm"
    :title="'调度命令签收'"
    width="40%"
    :visible.sync="dialogVisible"
    :before-close="handleClose">
    <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
        <ul>
            <li>
                <label>
                    <el-form-item prop="commandDate">
                        <strong>发令日期</strong>
                        <el-input v-model="sendData.commandDate" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="commandTime">
                        <strong>发令时间</strong>
                        <el-input v-model="sendData.commandTime" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="commandType">
                        <strong>发令类型</strong>
                        <el-input v-model="sendData.commandType" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="commandCode">
                        <strong>发令号</strong>
                        <el-input v-model="sendData.commandCode" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="commandContext">
                        <strong>发令内容</strong>
                        <el-input  v-model="sendData.commandContext" type="textarea" autosize class="bigInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="receiveStation">
                        <strong>受令处所</strong>
                        <!-- <el-input v-model="sendData.receiveStation" type="textarea" autosize placeholder="请输入内容" class="bigInput" :disabled="true"></el-input> -->
                        <p class="bigInput">
                            <span v-for="(item,index) in sendData.receiveStation" :key="index">
                                <span v-for="(items,indexs) in errLocation" :key="indexs" v-if="item == items.value"> {{items.label}} </span>
                            </span>
                        </p>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="state">
                        <strong>签收状态</strong>                        
                        <el-input :value="sendData.state == 1 ? '已签收' : '未签收'" type="textarea" autosize class="bigInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="sendUser">
                        <strong>发令人</strong>
                        <el-input v-model="sendData.sendUser" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="dispatcherCode">
                        <strong>调度员代码</strong>
                        <el-input v-model="sendData.dispatcherCode" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
        </ul>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" size="small">关 闭</el-button>
        <el-button type="primary" @click="singPost(sendData.id)" size="small" v-if="detail == false">签 收</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            sendData:{},
            errLocationValue:'',
            errLocation: [],
            dialogVisible:false,
            rules: {
                receiveStation: [
                    { required: true, message: '请选择受令处所', trigger: 'change' }
                ],sendUser:[
                    { required: true, message: '请输入发令人', trigger: 'blur' }
                ],dispatcherCode:[
                    { required: true, message: '请输入调度员代码', trigger: 'blur' }
                ],inp1: [
                    { required: true, message: '年龄不能为空', trigger: 'blur'},
                    { type: 'number', message: '年龄必须为数字值', trigger: 'blur'}
                ]
            },
            detail:false
        }
    },
    watch: {
        modulesAState:function name(newV,oldV) {
            this.sendData = newV.msg
            this.dialogVisible = true
        }
    },
    computed: {
        modulesAState () {
            return this.$store.state.springboard.link
        }
    },
    created () {
        var admStation = {"stationType":1}
        var self = this
        this.$api.post2('/api/iids-flat-adm/adm_station/selectListByType',admStation).then(res => {
            if(res.success){
                for (let index = 0; index < res.data.length; index++) {
                    self.errLocation.push({
                        value:res.data[index].stationId,
                        id:res.data[index].id,
                        label:res.data[index].stationName
                    })                 
                }
            }else{
                self.$notify.error({
                    title: '错误',
                    message: res.message
                });
            }
        })
    },
    methods: {
        handleClose(){
            this.dialogVisible = false
            this.detail = false
            this.sendData = {}
            this.newCommand = {
                commandCode:0,
                commandType:['添乘列车',101],
                receiveStation:[1]
            }
            this.$refs['formName'].resetFields();
        },
        singPost(id){
            var self = this
            var query = {
                id:id,
                stationName:''
            }
            console.log(query);
            for (let index = 0; index < this.errLocation.length; index++) {
                if(this.errLocation[index].value == parseInt(this.sendData.receiveStation)){
                    query.stationName = this.errLocation[index].label
                }
            }
            this.$api.post('/api/iids-flat-adm/web/adm_dispatch/modifyById?' + 'id=' + id + '&stationName=' + query.stationName).then(res => {
                if(res.success){
                    self.dialogVisible = false
                    self.$notify.success({
                        title: '签收成功',
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
}
</script>
<style>

.search{padding:30px 0 0 0;position: relative;}
.search ul li{color: #131523;padding-bottom: 20px;font-size: 14px;}
.search ul li label{width: 440px;display: inline-block;}
.search ul li .middleInput,.search ul li .el-date-editor--daterange.el-input__inner,.search ul li .el-select,.search ul li .el-cascader{width: 300px;vertical-align: middle;}
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
.dialogMain ul li .smallInput{width: 120px;}
.dialogMain ul li .middleInput{width: 160px;}
.dialogMain ul li .bigInput{width: calc(100% - 120px);vertical-align: text-top;}
.dialogMain ul li .bigInput,.dialogMain ul li .bigInput textarea{height: 100px !important;}
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
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{border-right: 1px solid #D7DBEC;}
/* .el-table__body{border-left: 1px solid #D7DBEC;}
.el-table__header{border-left: 1px solid #D7DBEC;border-top: 1px solid #D7DBEC;} */

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{background-color: transparent;color: #7E84A3;}
.el-pagination.is-background .el-pager li:not(.disabled):hover{color: #7E84A3;}
.el-pagination.is-background .el-pager li:not(.disabled).active{background-color: #0058FF;}
.el-pagination.is-background .el-pager li:not(.disabled).active:hover{color: #fff;}

.bj{background: #fff;position: relative;padding-bottom: 100px;}

.el-dialog__body ul li .middleInput,.el-dialog__body ul li .el-date-editor--daterange.el-input__inner,.el-dialog__body ul li .el-select,.el-dialog__body ul li .el-cascader,.el-dialog__body .el-input--prefix .el-input__inner{width: 160px;}
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

.commandForm .el-dialog__body ul li .middleInput{width: 240px;}
.commandForm.dialogMain ul li strong{width: 85px;}
.commandForm.dialogMain ul li .bigInput{width: 594px;display: inline-block;}
.commandForm.dialogMain ul li p.bigInput{background-color: #F5F7FA; border-color: #E4E7ED; color: #C0C4CC; cursor: not-allowed; padding: 5px 15px; line-height: 1.5;border: 1px solid #DCDFE6;
border-radius: 4px;}


.stencil{min-height:100px;max-height: 200px;overflow-y:auto;background: #F5F7FA;border:1px solid #E4E7ED;border-radius: 4px;display: inline-block;width: 990px;vertical-align: text-top;overflow-y: auto;font-weight: bold;}
.stencil ul{padding:0 0 0 4px;}
.stencil ul li,.stencil p{padding: 6px 0;line-height: 32px;}
.stencil ul li .el-input,.stencil ul li .el-select{width: 100px !important;margin: 0 4px;position: relative;}
.stencil p{padding-left: 4px;}
.stencil ul li .el-date-editor{width: 160px !important;}

.el-textarea.is-disabled .el-textarea__inner,.commandForm.dialogMain ul li p.bigInput,.el-input.is-disabled .el-input__inner{color: #666;}

.styleAdd.el-date-editor .el-range__icon,.styleAdd.el-date-editor .el-range-separator,.styleAdd.el-date-editor .el-range__close-icon{line-height: 25px;}
</style>