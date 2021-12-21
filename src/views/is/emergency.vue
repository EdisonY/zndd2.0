<template>
<div class="emergency">
    <div class="search">
        <!-- <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
        </el-tag> -->
        <!-- <el-input class="input" placeholder="请输入调度命令" v-model="searchInput" prefix-icon="el-icon-search"></el-input> -->
        <ul>
            <li>
                <label>
                    <strong>故障日期</strong>
                    <el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    >
                    <!-- value-format="yyyy-MM-DD HH:mm:ss"> -->
                    </el-date-picker>
                </label>
                <label>
                    <strong>故障类型</strong>
                    <el-cascader v-model="searchData.type" :options="options" :show-all-levels="false" placeholder="请选择"></el-cascader>
                </label>    
                <label>
                    <strong>报警源</strong>
                    <el-input v-model="searchData.source" placeholder="请输入内容" class="middleInput"></el-input>
                </label>            
            </li>
            <li>
                <label>
                    <strong>故障地点</strong>
                    <el-select v-model="searchData.location" filterable placeholder="请选择">
                        <el-option
                        v-for="item in errLocation"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </label>
                <label>
                    <strong>车组号</strong>
                    <el-input v-model="searchData.groupId" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
                <label>
                    <strong>车次号</strong>
                    <el-input v-model="searchData.carId" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
            </li>
        </ul>
        <div class="f_right">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search(1)" :loading="loading">查询</el-button>
            <el-button type="primary" size="small" icon="el-icon-switch-button" :loading="loading" @click="search()">重置</el-button>
            <!-- <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="dialogVisible = true">故障录入</el-button> -->
        </div>
    </div>
    <div class="bj">
        <el-table
        border
        :data="tableData"
        v-loading="loading"
        align="center"
        max-height="530"
        @sort-change="changeSort()"
        style="width: 100%">
            <el-table-column
                fixed
                prop="id"
                label="故障编号">
            </el-table-column>
            <el-table-column
                fixed
                width="160"
                prop="location"
                label="故障地点">
            </el-table-column>
            <el-table-column
                width="160"
                prop="source"
                label="报警源">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status == '辅助决策已执行'" type="success" disable-transitions>{{scope.row.status}}</el-tag>
                    <el-tag v-else-if="scope.row.status == '辅助决策已生成'" disable-transitions>{{scope.row.status}}</el-tag>
                    <el-tag v-else-if="scope.row.status == '辅助决策已放弃'" type="danger" disable-transitions>{{scope.row.status}}</el-tag>
                    <el-tag v-else-if="scope.row.status == '辅助决策超时已放弃'" type="warning" disable-transitions>{{scope.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="time"
                sortable="custom"
                label="故障时间">
            </el-table-column>
            <el-table-column
                prop="type"
                width="400"
                label="故障类型">
            </el-table-column>
            <el-table-column
                fixed="right"
                width="160"
                label="操作">
                <template #default="scope">
                    <el-button prop="id" @click.native.prevent="infoById(scope.row.id,scope.row.allowFailover)"
                        plain
                        size="small">
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="pager" background layout="prev, pager, next" :total="tableTotal" :page-size="10" class="fontBottom" @current-change="changePage" :current-page.sync="currentPage1"></el-pagination>
    </div>
    <el-dialog
        class="dialogMain"
        title="录入调度命令"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
    <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
        <ul>
            <li>
                <label>
                    <strong class="first">故障类型</strong>
                    <el-cascader v-model="sendData.alarmType" :options="options" :show-all-levels="false" placeholder="请选择"></el-cascader>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="startAlarmTime">
                        <strong class="first">发生时间</strong>
                        <el-date-picker
                        v-model="sendData.startAlarmTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="trainId">
                        <strong>列车车组号</strong>
                        <el-input v-model="sendData.trainId" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="orderNum">
                        <strong>故障列车车次号</strong>
                        <el-input v-model="sendData.orderNum" placeholder="请输入内容" class="middleInput"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="alarmSite">
                        <strong class="first">故障列车位置</strong>
                        <el-select v-model="sendData.alarmSite" filterable placeholder="请选择">
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
                    <el-radio-group v-model="sendData.upDown" size="mini">
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
        </ul>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" size="small">取 消</el-button>
        <el-button type="primary" @click="sendInfo()" size="small">确 定</el-button>
    </span>
    </el-dialog>
    <el-drawer
        title="我是标题"
        size="424"
        :visible.sync="drawer"
        :before-close="closedrawer"
        :with-header="false">
        <el-button type="primary" v-if="allowFailover != 0" :disabled="allowFailover == 2" size="small" @click="sendInfo()">故障恢复</el-button>
        <el-timeline v-loading="drawerLoading">
            <el-timeline-item v-for="(item,index) in drawerData" :timestamp="item.time" placement="top">
                <el-card>
                    <h4>{{item.title}}</h4>
                    <p>
                        {{item.message}}
                        <el-button v-if="item.tag == 1" size="mini" type="primary" @click="innerDetail(item.id,drawerData[0].title,drawerData[0].message)">详情</el-button>
                        <el-button v-if="item.tag == 2" size="mini" type="success" @click="rungrap(item)" :disabled="item.buttonStatus == 2">运行图预览</el-button>
                        <el-button v-if="item.tag == 3" size="mini" type="warning" @click="commadnGet(item)">电子调度命令</el-button>
                    </p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <el-drawer
            class="innerDetail"
            size="424"
            :append-to-body="true"
            :visible.sync="innerDrawer">
            <h2>辅助解决方案</h2>
            <div v-loading="innerLoading">
                <el-card>
                    <h4>{{innerData.type}}</h4>
                    <p>{{innerData.message}}</p>
                </el-card>
                <el-card>
                    <h4>处置详情</h4>
                    <p v-for="(item,index) in innerData.list">{{item}}</p>
                </el-card>
                <el-alert v-if="innerData.status == '方案已执行'" :title="innerData.status" type="success" show-icon :closable="false"></el-alert>
                <el-alert v-else-if="innerData.status == '方案待执行'" :title="innerData.status" type="info" show-icon :closable="false"></el-alert>
                <el-alert v-else-if="innerData.status == '方案已放弃'" :title="innerData.status" type="error" show-icon :closable="false"></el-alert>
                <el-alert v-else-if="innerData.status == '方案超时已放弃'" :title="innerData.status" type="error" show-icon :closable="false"></el-alert>
                <div class="bottombtn" v-if="innerData.status == '方案待执行'">
                    <el-button type="danger" size="small" @click="pushStore(1)">放弃</el-button>
                    <el-button type="primary" size="small" @click="pushStore(0)">执行</el-button>
                </div>
            </div>
        </el-drawer>

    </el-drawer>
    <div class="console">
        <el-table :data="tableData1" style="width: 100%" height="220">
            <el-table-column fixed prop="name" label="名称" width="120"></el-table-column>
            <el-table-column prop="type" label="类型" width="120"></el-table-column>
            <el-table-column prop="content" label="日志内容"></el-table-column>
            <el-table-column prop="timestamp" label="时间"></el-table-column>
            <!-- <el-table-column prop="ext1" label="故障编号"></el-table-column> -->
        </el-table>
    </div>

    <!-- 电子调度命令弹窗  -->
    <el-dialog
        class="dialogMain commandForm"
        title="调度命令详情"
        :visible.sync="dialogVisibleAdd"
        width="45%"
        top="5vh"
        :before-close="handleClose">
    <el-form :model="commandFormData" ref="formName" label-width="100px" class="demo-ruleForm">
        <ul>
            <li>
                <label>
                    <el-form-item prop="commandDate">
                        <strong>发令日期</strong>
                        <el-input v-model="commandFormData.commandDate" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="commandTime">
                        <strong>发令时间</strong>
                        <el-input v-model="commandFormData.commandTime" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="commandType">
                        <strong>发令类型</strong>
                        <span v-for="(item,index) in options" :key="index">
                            <span v-for="(items,indexs) in item.children" :key="indexs" v-if="commandFormData.commandType == items.value">
                                <el-input class="middleInput" :disabled="true" :value="items.label">{{items.label}}</el-input>
                            </span>
                        </span>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="commandCode">
                        <strong>发令号</strong>
                        <el-input v-model="commandFormData.commandCode" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="commandType">
                        <strong>备注</strong>
                        <el-input v-model="commandFormData.commandRemark" type="textarea" autosize class="bigInput" :disabled="true">{{commandFormData.commandRemark}}</el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="commandContext">
                        <strong>发令内容</strong>
                        <el-input  v-model="commandFormData.commandContext" type="textarea" autosize class="bigInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="receiveStation">
                        <strong>受令处所</strong>
                        <!-- <el-input v-model="sendData.receiveStation" type="textarea" autosize placeholder="请输入内容" class="bigInput" :disabled="true"></el-input> -->
                        <p class="bigInput">
                            <span v-for="(item,index) in commandFormData.receiveStation" :key="index">
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
                        <el-input :value="commandFormData.state == 1 ? '已签收' : '未签收'" type="textarea" autosize class="bigInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
            <li>
                <label>
                    <el-form-item prop="sendUser">
                        <strong>发令人</strong>
                        <el-input v-model="commandFormData.sendUser" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
                <label>
                    <el-form-item prop="dispatcherCode">
                        <strong>调度员代码</strong>
                        <el-input v-model="commandFormData.dispatcherCode" class="middleInput" :disabled="true"></el-input>
                    </el-form-item>
                </label>
            </li>
        </ul>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="handleClose()" size="small">关 闭</el-button>
        <el-button type="primary" @click="singPost(sendData.id)" size="small" v-if="detail == false">签 收</el-button> -->
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
            },{
                value: '',
                label: '其他',
                children: [{
                    value:999,
                    label: '其他',
                    children: [{
                        value: 999,
                        label: '其他'
                    }]
                }]
            }],
            searchTime:'',
            searchData:{
                start_time:'',
                end_time:'',
                type:'',
                message:'',
                location:'',
                source:'',
                status:'',
                groupId:'',
                carId:'',
                size:8,
                select_all:1
            },
            sendData:{
                upDown:170,
                alarmType:1
            },
            errLocationValue:'',
            errLocation: [],
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
                ]
            },
            innerData:{
                list:[]
            },
            tableData1:[],
            alarmInfo:{},
            logdata:{},
            sortTable:1,
            allowFailover:2,
            dialogVisibleAdd:false,
            commandFormData:{}
        };
    },
    created () {
        var admStation = {"stationType":1}
        var self = this
        this.search()
        this.$api.post2('/api/iids-flat-adm/adm_station/selectListByType',admStation).then(res => {
            if(res.success){
                for (let index = 0; index < res.data.length; index++) {
                    self.errLocation.push({
                        value:res.data[index].stationId,
                        label:res.data[index].stationName,
                        id:res.data[index].id,
                    })                 
                }
                self.$api.post2('/api/iids-flat-adm/adm_station/selectListByType',{"stationType":2}).then(res => {
                    if(res.success){
                        for (let index = 0; index < res.data.length; index++) {
                            self.errLocation.push({
                                value:res.data[index].stationId,
                                id:res.data[index].id,
                                label:res.data[index].stationName
                            })                 
                        }
                        self.$api.post2('/api/iids-flat-adm/adm_station/selectListByType',{"stationType":3}).then(res => {
                            if(res.success){
                                for (let index = 0; index < res.data.length; index++) {
                                    self.errLocation.push({
                                        value:res.data[index].stationId,
                                        id:res.data[index].id,
                                        label:res.data[index].stationName
                                    })                 
                                }
                            }
                        })
                    }
                })
            }else{

            }
        })
        setInterval(()=>{
            var tmpData = []
            var crasData = JSON.parse(window.localStorage.getItem('log'))
            for (let index = 0; index < crasData.length; index++) {
                // self.tableData1.push(crasData[index].msg)
                tmpData.unshift(crasData[index].msg)
            }
            self.tableData1 = tmpData
        },2000)
    },
    watch: {
        case:function name(newV,oldV) {
            this.alarmInfo = newV.msg
        },
        log:function name(newV,oldV){
            this.logdata = newV.msg
        }
    },
    computed: {
        case () {
            return this.$store.state.springboard.case
        },
        log (){
            return this.$store.state.springboard.log
        }
    },
    mounted () {
        this.$EventBus.$on('closeRungrap',()=>{
            this.drawer = true
        })  
        this.$EventBus.$on('reload',()=>{
            this.search(1)
        })  
    },
    methods: {
        handleClose(){
            this.dialogVisible = false
            this.$refs['formName'].resetFields();
        },
        search(value,page){
            var self = this
            if(value){
                this.reset = false
                this.searchData.start_time = null
                this.searchData.end_time = null
                if(this.searchTime){
                    console.log(this.searchTime);
                    this.searchData.start_time = GMTToStr(this.searchTime[0])
                    this.searchData.end_time = GMTToStr(this.searchTime[1])
                }

                if(this.searchData.type && this.searchData.type.constructor == Array){
                    this.searchData.type = this.searchData.type[this.searchData.type.length - 1]
                }
                this.searchData.select_all = null
                this.searchData.currentPage = null
                console.log(this.searchData);
            }else{
                this.reset = true
                this.searchData = {
                    start_time:'',
                    end_time:'',
                    type:'',
                    message:'',
                    location:'',
                    source:'',
                    status:'',
                    groupId:'',
                    carId:'',
                    size:8,
                    select_all:1
                }
                this.searchData.select_all = 1
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
                this.searchData.currentPage = page
            }else{
                this.currentPage1 = 1
            }

            this.searchData.sort = this.sortTable
            self.loading = true
            this.$api.get('/api/iids-flat-adm/web/alert_info/select_by_page',this.searchData).then(res => {
                console.log(res);
                if(res.success){
                    self.loading = false
                    self.tableTotal = res.data.total
                    self.tableData = []
                    for (let index = 0; index < res.data.list.length; index++) {
                        self.tableData.push({
                            id: res.data.list[index].id,
                            location: res.data.list[index].location,
                            message: res.data.list[index].message,
                            source: res.data.list[index].source,
                            status: res.data.list[index].status,
                            time: res.data.list[index].time,
                            type: res.data.list[index].type,
                            allowFailover:res.data.list[index].allowFailover
                        })
                    }
                    if(res.data.total > 8){
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
        infoById(id,allow){
            this.allowFailover = allow
            this.drawer = true
            var self = this
            var infoId = {infoId:id}
            this.drawerData = []
            this.drawerLoading = true
            this.$api.get('/api/iids-flat-adm/web/alert_detail/select_list_by_infoId',infoId).then(res => {
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
            this.sendData.stopAreaNumber = 0
            this.sendData.platformId = 0
            this.sendData.id = 0
            this.sendData.physicsSectionType = 0
            this.sendData.stationId = 3
            this.sendData.alarmSource = ''
            this.sendData.alarmState = 1
            this.sendData.alarmData = ''
            if(this.sendData.orderNum){
                this.sendData.orderNum = parseInt(this.sendData.orderNum)
            }
            if(this.sendData.trainId){
                this.sendData.trainId = parseInt(this.sendData.trainId)
            }
            if(this.sendData.upDown){
                this.sendData.upDown = parseInt(this.sendData.upDown)
            }

            this.$refs['formName'].validate((valid) => {
                if (valid) {
                    if(this.sendData.startAlarmTime){
                        // this.sendData.startAlarmTime = GMTToStr(this.sendData.startAlarmTime)
                        this.$api.post('/api/iids-flat-adm/web/alert_info/send_info',this.sendData).then(res => {
                            if(res.success){
                                self.handleClose()
                                self.search()
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
        innerDetail(id,type,message){
            var self = this
            this.innerDrawer = true
            this.innerData.type = type
            this.innerData.message = message
            this.innerLoading = true
            this.$api.get('/api/iids-flat-adm/web/alert_detail_box/select_one_by_detailId',{detailId:id}).then(res => {
                if(res.success){
                    self.innerLoading = false
                    self.innerData.list = res.data.message.dispose
                    self.innerData.status = res.data.status
                    self.innerData.body = res.data.message
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        pushStore(state){
            var self = this
            if(state){
                //放弃
                var auxiliaryDecision = {
                    "alarmTypeDetail": this.innerData.body.alarmTypeDetail,
                    "caseCode": 0,
                    "executeStep": 0,
                    "vId": this.innerData.body.vid,
                    "aidDesSubStepDtoList":this.innerData.aidDesSubStepDtoList
                }
                this.$api.post('/api/iids-flat-adm/aid_decision/execute',auxiliaryDecision).then(res => {
                    self.$api.post('/api/iids-flat-adm/runGraph/case',self.alarmInfo).then(res => {
                        console.log(res.data)
                        if(res.data && res.data.length > 1){
                            stroe.dispatch("springboard/getPlanData", res.data);
                            self.drawer = false
                        }
                    })
                })
            }else{
                //执行
                var auxiliaryDecision = {
                    "alarmTypeDetail": this.innerData.body.alarmTypeDetail,
                    "caseCode": 0,
                    "executeStep": state == 1 ? this.innerData.body.executeStep : 0,
                    "vId": this.innerData.body.vid,
                    "aidDesSubStepDtoList":this.innerData.aidDesSubStepDtoList
                }
                this.$api.post('/api/iids-flat-adm/aid_decision/execute',auxiliaryDecision).then(res => {
                    self.$api.post('/api/iids-flat-adm/runGraph/case',self.alarmInfo).then(res => {
                        console.log(res.data)
                        if(res.data && res.data.length > 1){
                            stroe.dispatch("springboard/getPlanData", res.data);
                            self.drawer = false
                        }
                    })
                })
            }
            function updatState(){
                // var updatState = {
                //     Parameter:,
                //     boxId:,
                //     infoId:,
                //     tag:
                // }
                this.$api.post('/api/iids-flat-adm/alert_detail_box/update_status',updatState).then(res => {
                    
                })
            }
        },
        changeSort(){
            console.log(this.sortTable);
            this.sortTable = 1 ^ this.sortTable
            this.search(1)
        },
        sendInfo(){
            return false;
            var self = this
            this.sendData.stopAreaNumber = 0
            this.sendData.platformId = 0
            this.sendData.physicsSectionType = 0
            this.sendData.stationId = 4
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
        commadnGet(item){
            var self = this
            this.$api.get('/api/iids-flat-adm/adm_dispatch/findById',{'id':item.id}).then(res => {
                if(res.success){
                    self.dialogVisibleAdd = true
                    self.commandFormData = res.data
                    self.commandFormData.receiveStation = self.commandFormData.receiveStation.split(',')
                    console.log(self.commandFormData);
                }
            })
            this.drawer = false
        },
        handleClose(done){
            done()
            this.drawer = true
            this.dialogVisibleAdd = false
            this.commandFormData = {}
        },
        rungrap(item){
            console.log(item);
            item.form = 1
            this.drawer = false
            this.$EventBus.$emit('trigger',item)
        },
        closedrawer(done){
            setTimeout(()=>{
                done()
            },200)
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
.fontBottom{position: absolute;right: 20px;bottom: 10px;}
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
.emergency .el-drawer__body{padding: 20px 0 !important;}
.emergency .el-drawer__body ul{padding: 0 20px !important;height: calc(100vh - 82px);overflow-y: auto;}
.emergency .el-drawer__body ul h4{font-size: 18px;font-weight: bold;color: #3E4977;padding-bottom: 10px;}
.emergency .el-drawer__body ul p{font-size: 14px;color: #131523;}

.el-table td, .el-table th.is-leaf{border-bottom: 1px solid #D7DBEC;height: 35px;}
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

.bj{background: #fff;position: relative;padding-bottom: 60px;}

.el-dialog__body ul li .middleInput,.el-dialog__body ul li .el-date-editor--daterange.el-input__inner,.el-dialog__body ul li .el-select,.el-dialog__body ul li .el-cascader,.el-dialog__body .el-input--prefix .el-input__inner{width: 160px;}
.el-date-editor.el-input{width: auto;}

.el-dialog .el-radio-button__orig-radio:checked+.el-radio-button__inner,.el-dialog .el-button--primary{background-color: #0058FF;}

.el-drawer__open .el-drawer.rtl{width: 27% !important;}
.el-drawer__open .el-button--primary{width: 98px;background-color: #0058FF;margin: 0 20px 40px 20px;}
.el-drawer__open .bottombtn .el-button--primary{width: auto;}
.el-drawer__open .el-card__body p button{width: auto !important;margin-left: 12px;padding-left: 6px;padding-right: 6px;}
.el-timeline-item__timestamp.is-top{color: #131523;font-size: 14px;margin-bottom: 20px;}
.el-timeline-item__node--normal{background-color: #fff;border:2px solid #0058FF;top: 1px;}
.console{position: fixed;width: calc(100vw - 208px);height: 220px;background: #ccc;left: 208px;bottom: 0;display: black;z-index: 2009;}
.console .el-table td,.console .el-table th.is-leaf{height: 32px;padding:10px 0;}

.el-table th, .el-table tr{height: 40px;}
.el-drawer__wrapper{z-index: 2011 !important;}
.v-modal{z-index: 2010 !important;}

.bottombtn{padding: 20px 0 0 0;text-align: right;}
.emergency .commandForm{z-index: 2011 !important;}
.el-drawer__open p .el-button--primary{margin-bottom: 0;}
</style>