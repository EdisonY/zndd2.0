<template>
    <div class="configuration command">
        <div class="search">
            <ul>
                <li>
                    <label>
                        <strong>参数名称</strong>
                        <el-input v-model="searchData.name" placeholder="请输入内容" class="middleInput"></el-input>
                    </label>
                    <label>
                        <strong>参数分类名称</strong>
                        <el-select v-model="searchData.classification" filterable placeholder="请选择">
                            <el-option
                            v-for="item in namelist"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>    
                    </label>              
                </li>
            </ul>
            <div class="f_right">
                <el-button type="primary" size="small" icon="el-icon-search" @click="search(1)" :loading="loading">查询</el-button>
                <el-button type="primary" size="small" icon="el-icon-switch-button" :loading="loading" @click="search()">重置</el-button>
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
                    prop="name"
                    width="300"
                    label="参数名称">
                </el-table-column>
                <el-table-column
                    prop="value"
                    width="100"
                    label="参数数值">
                </el-table-column>
                <el-table-column
                    prop="className"
                    label="参数分类名称">
                </el-table-column>
                <el-table-column
                    prop="annotation"
                    label="参数注释">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="100"
                    label="操作">
                    <template #default="scope">
                        <el-button prop="id" @click.native.prevent="detailMain(scope.row)"
                            plain
                            size="small">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="pager" background layout="prev, pager, next" :total="tableTotal" :page-size="10" class="fontBottom" @current-change="changePage" :current-page.sync="currentPage1"></el-pagination>
        </div>
        <el-dialog
        class="dialogMain commandForm"
        title="配置参数修改"
        :visible.sync="dialogVisible"
        width="30%"
        top="5vh"
        :before-close="handleClose">
        <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
            <ul>
                <li>
                    <label>
                        <el-form-item>
                            <strong>参数名称</strong>
                            <el-input v-model="sendData.name" class="middleInput" :disabled="true"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item prop="value">
                            <strong>参数数值</strong>
                            <el-input v-model="sendData.value" class="middleInput"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item>
                            <strong>数值类型</strong>
                            <el-input v-model="sendData.valType" class="middleInput" :disabled="true"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item>
                            <strong>参数分类名称</strong>
                            <el-input v-model="sendData.className" class="middleInput" :disabled="true"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item>
                            <strong>参数编码</strong>
                            <el-input v-model="sendData.classification" class="middleInput" :disabled="true"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item prop="annotation">
                            <strong>参数注释</strong>
                            <el-input v-model="sendData.annotation" type="textarea" autosize class="bigInput">{{sendData.annotation}}</el-input>
                        </el-form-item>
                    </label>
                </li>
            </ul>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()" size="small">关 闭</el-button>
            <el-button type="primary" @click="singPost(sendData.id)" size="small">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
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
            sendData:{},
            rules: {
                annotation: [
                    { required: true, message: '请输入参数注释', trigger: 'blur' }
                ],value:[
                    { required: true, message: '请输入参数数值', trigger: 'blur' }
                ]
            },
        }
    },
    created () {
        var self = this
        this.search()
        this.$api.get('/api/iids-basedata/trafficParameter/class/all').then(res => {
            self.namelist = res.data
            for (let index = 0; index < self.namelist.length; index++) {
                self.namelist[index].value = self.namelist[index].classification
                self.namelist[index].label = self.namelist[index].name
            }
            console.log(self.namelist);
        })
        
    },
    methods: {
        search(value,page){
            var self = this
            if(value){
                this.reset = false
                this.searchData.page = 1
                this.searchData.size = 10

            }else{
                this.reset = true
                this.searchData = {
                    page:1,
                    size:10
                }
            }
            var index = 0
            var i = 0
            for (const key in this.searchData) {
                i++
                if(!this.searchData[key]){
                    this.searchData[key] = null
                    index++
                }
            }
            if(index == i){
                this.searchData.select_all = 1
            }
            if(page){
                this.searchData.page = page
            }else{
                this.currentPage1 = 1
            }
            // this.searchData.select_all = null 
            self.loading = true
            this.$api.get('/api/iids-basedata/trafficParameter/page1/',this.searchData).then(res => {
                console.log(res);
                if(res.success){
                    self.loading = false
                    self.tableTotal = res.data.pages * 10
                    self.tableData = res.data.list
                    if(self.tableTotal > 10){
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
            this.sendData = {}
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
    }
}
</script>

<style lang="scss" scoped>
.search{padding:30px 0 0 0;position: relative;}
.search ul li{color: #131523;padding-bottom: 20px;font-size: 14px;}
.search ul li label{width: 440px;display: inline-block;}
.search ul li .middleInput,.search ul li .el-date-editor--daterange.el-input__inner,.search ul li .el-select,.search ul li .el-cascader{width: 300px;vertical-align: middle;}
.search ul li strong{display: inline-block;width: 90px;}
.search .f_right{position: absolute;right: 0;bottom: 50px;}
.search .f_right .el-button--primary{background-color: #0058FF;width: auto;font-size: 14px;height: 32px;padding:8px 15px}
.configuration .commandForm.dialogMain ul li strong{width: 120px;}
.configuration .commandForm.dialogMain ul li .bigInput{width: 350px;}
</style>
