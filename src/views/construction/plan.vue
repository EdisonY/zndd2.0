<template>
    <div class="configuration command meter linetone plan">
        <div class="search">
            <ul>
                <li>
                    <label>
                        <strong>单位</strong>
                        <el-input v-model="searchData.name" placeholder="请输入内容" class="middleInput"></el-input>
                    </label>
                    <label>
                        <strong>施工类别</strong>
                        <el-select v-model="searchData.classification" filterable placeholder="请选择">
                            <el-option
                            v-for="item in namelist"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>    
                    </label>  
                    <label>
                        <strong>线路</strong>
                        <el-select v-model="searchData.classification" filterable placeholder="请选择">
                            <el-option
                            v-for="item in namelist"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>    
                    </label> 
                    <label>
                        <strong>线别</strong>
                        <el-select v-model="searchData.classification" filterable placeholder="请选择">
                            <el-option
                            v-for="item in namelist"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>    
                    </label>      
                    <label>
                        <strong>状态</strong>
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
                <li>
                    <label>
                        <strong>日期</strong>
                        <el-date-picker
                            v-model="searchData.data"
                            type="date"
                            class="middleInput"
                            placeholder="选择日期">
                        </el-date-picker>
                    </label>
                    <label>
                        <strong>关键字</strong>
                        <el-input v-model="searchData.name" placeholder="请输入内容" class="middleInput"></el-input>
                    </label>
                </li>
            </ul>
            <div class="f_right">
                <el-button type="primary" size="small" icon="el-icon-search" @click="search(1)" :loading="loading">查询</el-button>
                <el-button type="primary" size="small" icon="el-icon-switch-button" :loading="loading" @click="generation()">批量审批</el-button>
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
                    type="selection"
                    width="50">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="index"
                    width="50"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="线路">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="施工/计表">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="name"
                    label="单位">
                </el-table-column>
                <el-table-column
                    prop="className"
                    label="工作内容">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="配合单位">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="负责人">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="人数">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="区段">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="线别">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="等级车站">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="注销车站">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="备注">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="状态">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="160"
                    label="操作">
                    <template #default="scope">
                        <el-button prop="id" @click.native.prevent="detailMain(scope.row)"
                            plain
                            size="small">
                            审批
                        </el-button>
                        <el-button
                            plain
                            size="small"
                            @click.native.prevent="back(scope.row)">
                            退回
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="pager" background layout="prev, pager, next" :total="tableTotal" :page-size="10" class="fontBottom" @current-change="changePage" :current-page.sync="currentPage1"></el-pagination>
        </div>
        <el-dialog
        class="dialogMain commandForm"
        title="确认操作"
        :visible.sync="dialogVisible"
        width="20%"
        top="35vh"
        :before-close="handleClose">
            <h4>确认批复此施工/计表申报？</h4>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()" size="small">关 闭</el-button>
            <el-button type="primary" @click="singPost(sendData.id)" size="small">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
        class="dialogMain commandForm"
        title="确认操作"
        :visible.sync="dialogVisible1"
        width="20%"
        top="35vh"
        :before-close="handleClose">
            <h4>确认退回当前施工申报？</h4>
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
            dialogVisible1:false,
            sendData:{},
            checkboxGroup3:[],
            cities: ['上海', '北京', '广州', '深圳'],
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
        back(){
            this.dialogVisible1 = true
            this.sendData = JSON.parse(JSON.stringify(data))
        },
        handleClose(){
            this.dialogVisible = false
            this.dialogVisible1 = false
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
        },
        generation(){
            this.$notify.success({
                title: '成功',
                message: '已批量生成命令，请前往施工调度命令页面查看！'
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.search{padding:30px 0 0 0;position: relative;}
.search ul li{color: #131523;padding-bottom: 20px;font-size: 14px;}
.meter .search ul li label{width: 280px;display: inline-block;}
.meter .search ul li .middleInput,.meter .search ul li .el-date-editor--daterange.el-input__inner,.meter .search ul li .el-select,.meter .search ul li .el-cascader{width: 200px;vertical-align: middle;}
.meter .search ul li strong{display: inline-block;width: 60px;}
.search .f_right{position: absolute;right: 0;bottom: 50px;}
.search .f_right .el-button--primary{background-color: #0058FF;width: auto;font-size: 14px;height: 32px;padding:8px 15px}
.configuration .commandForm.dialogMain ul li strong{width: 120px;}
.configuration .commandForm.dialogMain ul li .bigInput{width: 350px;}

.meter .el-checkbox-group{display: inline-block;}
.meter .commandForm.dialogMain ul li strong{width: 140px !important;}

</style>
