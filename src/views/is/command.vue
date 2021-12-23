<template>
<div class="emergency command">
    <div class="search">
        <ul>
            <li>
                <label>
                    <strong>命令日期</strong>
                    <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="styleAdd">
                    </el-date-picker>
                </label>
                <label>
                    <strong>命令类型</strong>
                    <el-cascader v-model="searchData.commandType1" :options="options" :show-all-levels="true" placeholder="请选择"></el-cascader>
                </label>    
                <label>
                    <strong>命令号</strong>
                    <el-input v-model="searchData.commandCode" placeholder="请输入内容" class="middleInput"></el-input>
                </label>            
            </li>
            <li>
                <label>
                    <strong>命令内容</strong>
                    <el-input v-model="searchData.commandContext" placeholder="请输入内容" class="middleInput"></el-input>
                </label>
                <label>
                    <strong>受令所处</strong>
                    <el-select v-model="searchData.receiveStation" filterable placeholder="请选择">
                        <el-option
                        v-for="item in errLocation"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </label>
                <label>
                    <strong>状态</strong>
                    <el-select v-model="searchData.state" placeholder="请选择">
                        <el-option label="已签收" value="1"></el-option>
                        <el-option label="未签收" value="0"></el-option>
                    </el-select>
                </label>
            </li>
        </ul>
        <div class="f_right">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search(1)" :loading="loading">查询</el-button>
            <el-button type="primary" size="small" icon="el-icon-switch-button" :loading="loading" @click="search()">重置</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="command()">新建调度命令</el-button>
        </div>
    </div>
    <div class="bj">
        <el-table
        border
        :data="tableData"
        v-loading="loading"
        align="center"
        @sort-change="changeSort()"
        style="width: 100%">
            <el-table-column
                fixed
                prop="commandDate"
                sortable="custom"
                label="发令日期">
                <!-- <i class="el-icon-caret-bottom"></i> -->
            </el-table-column>
            <el-table-column
                fixed
                prop="commandTime"
                label="发令时间">
            </el-table-column>
            <el-table-column
                prop="commandType"
                label="命令类型">
                <template #default="scope">
                    <span v-for="(item,index) in options" :key="index">
                        <span v-for="(items,indexs) in item.children" :key="indexs" v-if="scope.row.commandType == items.value">{{items.label}} </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="commandCode"
                label="命令号">
            </el-table-column>
            <el-table-column
                width="250"
                prop="commandContext"
                label="命令内容">
            </el-table-column>
            <el-table-column
                prop="receiveStation"
                label="受令处所">
                <template #default="scope">
                    <span v-for="(item,index) in scope.row.receiveStation" :key="index">
                        <span v-for="(items,indexs) in errLocation" :key="indexs" v-if="item == items.value"> {{items.label}} </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="sendUser"
                label="发令人">
            </el-table-column>
            <el-table-column
                prop="state"
                label="状态">
                <template #default="scope">
                    <span v-if="scope.row.state == 1">已签收</span>
                    <span v-if="scope.row.state == 0">未签收</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="sign"
                label="签收车站">
            </el-table-column>
            <el-table-column
                prop="notSign"
                label="未签收车站">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
                <template #default="scope">
                    <el-button prop="id" @click.native.prevent="detailMain(scope.row)"
                        plain
                        size="small">
                        详情
                    </el-button>
                    <el-button prop="id" @click.native.prevent="sing(scope.row)"
                        plain
                        size="small"
                        v-if="scope.row.state == 0">
                        签收
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="pager" background layout="prev, pager, next" :total="tableTotal" :page-size="10" class="fontBottom" @current-change="changePage" :current-page.sync="currentPage1"></el-pagination>
    </div>
    <el-dialog class="dialogMain commandForm" title="新建调度命令" :visible.sync="dialogVisible1" width="66%" :before-close="handleClose" top="5vh">
        <el-form :model="newCommand" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
            <ul>
                <li>
                    <label>
                        <el-form-item prop="commandCode">
                            <strong>命令号</strong>
                            <el-input v-model="newCommand.commandCode" placeholder="请输入内容" class="middleInput" :disabled="true"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item prop="commandType">
                            <strong>命令类型</strong>
                            <el-cascader v-model="newCommand.commandType" :options="options" :show-all-levels="true" placeholder="请选择" style="width:990px" @change="clearData()"></el-cascader>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item prop="commandType" style="width:100%">
                            <strong>备注</strong>
                            <el-input v-model="newCommand.commandRemark" type="textarea"  style="width:990px;color:#000" :rows="2" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <el-form-item>
                        <strong>命令模版</strong>
                        <div class="stencil">
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 101">
                                <li>
                                    准<el-input v-model.number="stencilData.inp1"></el-input>人员（
                                    <el-input v-model="stencilData.inp2"></el-input>名）在
                                    站<el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                    添乘<el-input v-model="stencilData.inp3"></el-input>次列车，</li>
                                <li>在<el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                    站至<el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                    站<el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>
                                    行区间（公里标）下车。</li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 102">
                                <li>
                                    准<el-input v-model="stencilData.inp1"></el-input>人员（
                                    <el-input v-model="stencilData.inp2"></el-input>名）在
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站</li>
                                <li>
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行区间（公里标处）添乘
                                    <el-input v-model="stencilData.inp3"></el-input>次列车至
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 201">
                                <li>
                                    自即时起，将
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行区间（及
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站、
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站下行站线）线路封锁。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 202">
                                <li>
                                    自即时起，将
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-input v-model="stencilData.inp1"></el-input>信号机（公里标）至
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-input v-model="stencilData.inp2"></el-input>信号机（公里标）间线路封锁。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 203">
                                <li>
                                    自即时起，将
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>
                                </li>
                                <li>
                                    行区间（及
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站、
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站下行站线）线路封锁解除。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 301">
                                <li>
                                    <el-input v-model="stencilData.inp1"></el-input>列车司机，车辆段（场）至
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行加开
                                    <el-input v-model="stencilData.inp2"></el-input>次。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 302">
                                <li>
                                    <el-input v-model="stencilData.inp1"></el-input>列车司机，
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站库线至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行至
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行加开
                                    <el-input v-model="stencilData.inp2"></el-input>次。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 401">
                                <li>
                                    <el-input v-model="stencilData.inp1"></el-input>次
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行/段停运。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 501">
                                <li>
                                    自即时起，将
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站封闭。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 502">
                                <li>
                                    自即时起，至
                                    <el-date-picker
                                        v-model="stencilData.sle1"
                                        type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>时止，将
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站封闭。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 503">
                                <li>
                                    自即时起，
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站封闭解除。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 504">
                                <li>
                                    自即时起，至
                                    <el-date-picker
                                        v-model="stencilData.sle1"
                                        type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>时止，将
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站解封。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 601">
                                <li>
                                    因<el-input v-model="stencilData.inp1"></el-input>原因自即时起，将
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 602">
                                <li>
                                    自<el-date-picker
                                        v-model="stencilData.sle1"
                                        type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker> ：
                                    <el-time-picker
                                        v-model="stencilData.sle2"
                                        value-format="HH:mm:ss"
                                        placeholder="任意时间点">
                                    </el-time-picker>时起至次日
                                    <el-time-picker
                                        v-model="stencilData.sle3"
                                        value-format="HH:mm:ss"
                                        placeholder="任意时间点">
                                    </el-time-picker>时止，将
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放车站处理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 701">
                                <li>
                                    <el-input v-model="stencilData.inp1"></el-input>次列车
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行间改按进路闭塞法行车。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 702">
                                <li>
                                    <el-input v-model="stencilData.inp1"></el-input>次列车
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行间改按进路闭塞法行车。
                                </li>
                                <li>
                                    又自即时起，将
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 703">
                                <li>
                                    自即时起，
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行，改按电话闭塞法行车。
                                </li>
                                <li>
                                    即时起，将
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 704">
                                <li>
                                    自即时起，
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行，恢复基本闭塞法行车，
                                </li>
                                <li>
                                    又自即时起，将
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权收回中心办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 801">
                                <li>
                                    准<el-input v-model="stencilData.inp1"></el-input>次
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行反方向行至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行，按电话闭塞
                                </li>
                                <li>
                                    法行车。又自即时起，将
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle6" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 901">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次列车，
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行，限速<el-input v-model="stencilData.sle5"></el-input>公里/小时运行。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 902">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次列车，
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行
                                </li>
                                <li>
                                    <el-input v-model="stencilData.sle5"></el-input>公里标至
                                    <el-input v-model="stencilData.sle6"></el-input>公里标间，限速
                                    <el-input v-model="stencilData.sle7"></el-input>公里/小时运行。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1001">
                                <li>
                                    自<el-time-picker v-model="stencilData.sle1" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>
                                    时起，将
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站上下行区间封锁，准
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </li>
                                <li>
                                    站站务人员进入封锁区间，配合<el-input v-model="stencilData.sle5"></el-input>
                                    次列车向
                                    <el-select v-model="stencilData.sle6" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站方向疏导乘客。又自即时起，将
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle8" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放车站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1101">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次，在
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站通过不停车。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1102">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次，在
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站通过不停车。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1201">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次列车在
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站清人。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1301">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站清人，
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站/段加开
                                    <el-input v-model="stencilData.sle5"></el-input>次，
                                </li>
                                <li>
                                    <el-input v-model="stencilData.sle6"></el-input>次运行至
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站与故障车连挂，连挂完毕后运行回段，按进路闭塞法行车。                                
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1302">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次在
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站与故障车连挂，连挂完毕后，
                                    <el-input v-model="stencilData.sle3"></el-input>次（原车次）列车运行至
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站清人，
                                </li>
                                <li>
                                    <el-input v-model="stencilData.sle5"></el-input>次
                                    <el-select v-model="stencilData.sle6" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站停运，
                                    <el-select v-model="stencilData.sle8" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle9" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站/段加开
                                    <el-input v-model="stencilData.sle10"></el-input>
                                </li>
                                <li>
                                    次，<el-input v-model="stencilData.sle11"></el-input>次连挂完毕后运行回段，按进路闭塞法行车。又自即时起，将
                                    <el-select v-model="stencilData.sle12" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle13" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1303">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站停运，
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站/段加开
                                    <el-input v-model="stencilData.sle6"></el-input>次，
                                </li>
                                <li>
                                    <el-input v-model="stencilData.sle7"></el-input>次在
                                    <el-select v-model="stencilData.sle8" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle9" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle10" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行区间与故障车连挂，连挂完毕后故障车运行至
                                    <el-select v-model="stencilData.sle11" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </li>
                                <li>
                                    站清人，清人完毕后运行回段，按进路闭塞法行车。又自即时起，将
                                    <el-select v-model="stencilData.sle12" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle13" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1304">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次（原车次）担当救援任务，在
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行区间与（故障车）连挂，连挂完毕后推进至
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站清人，故障列车、救援列车清人完毕后，
                                    <el-input v-model="stencilData.sle6"></el-input>次
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle8" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站停运。
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle9" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle10" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站/段加开
                                    <el-input v-model="stencilData.sle11"></el-input>次，
                                    <el-input v-model="stencilData.sle12"></el-input>次按进路闭塞法办理行车。又自即时起，将 
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle13" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle14" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1401">
                                <li>
                                    自<el-date-picker v-model="stencilData.sle1" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                    ：<el-time-picker v-model="stencilData.sle2" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>
                                    时起至<el-date-picker v-model="stencilData.sle3" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle4" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时，
                                </li>
                                <li>准
                                    <el-input v-model="stencilData.sle5"></el-input>专业/公司施工人员在
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle6" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle8" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行区间，进行
                                    <el-input v-model="stencilData.sle9"></el-input>施工。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1402">
                                <li>
                                    自<el-date-picker v-model="stencilData.sle1" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                    ：<el-time-picker v-model="stencilData.sle2" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>
                                    起至<el-date-picker v-model="stencilData.sle3" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle4" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle6" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行建立施工领域，准
                                    <el-input v-model="stencilData.sle8"></el-input>公司施工人员在施工领域内进行
                                    <el-input v-model="stencilData.sle9"></el-input>施工。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1403">
                                <li>
                                    <el-input v-model="stencilData.sle1"></el-input>次停于
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select> 站。
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select> 站至
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select> 站
                                    <el-select v-model="stencilData.sle5" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行建立施工领域，
                                </li>
                                <li>
                                    准<el-input v-model="stencilData.sle6"></el-input>次列车在施工领域内配合
                                    <el-input v-model="stencilData.sle7"></el-input>公司施工人员在施工领域内进行
                                    <el-input v-model="stencilData.sle8"></el-input>施工。
                                </li>
                                <li>
                                    施工完毕后，停于<el-select v-model="stencilData.sle9" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站，与
                                    <el-select v-model="stencilData.sle10" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站综控员联系，得到允许后，
                                    <el-input v-model="stencilData.sle11"></el-input>次方准继续运行回段。
                                </li>
                                <li>
                                    <el-input v-model="stencilData.sle12"></el-input>次按进路闭塞法办理行车，限
                                    <el-input v-model="stencilData.sle13"></el-input>次次日
                                    <el-input v-model="stencilData.sle14"></el-input>时前到段。
                                </li>
                                <li>
                                    又自<el-date-picker v-model="stencilData.sle15" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle16" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时起至
                                    <el-date-picker v-model="stencilData.sle17" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle18" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时，
                                </li>
                                <li>
                                    将<el-select v-model="stencilData.sle19" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle20" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1501">
                                <li>
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>
                                    行段加开
                                    <el-input v-model="stencilData.sle4"></el-input>次，
                                    <el-input v-model="stencilData.sle5"></el-input>次按进路闭塞法办理行车，
                                </li>
                                <li>
                                    限<el-input v-model="stencilData.sle6"></el-input>次次日
                                    <el-input v-model="stencilData.sle7"></el-input>时前到段，
                                </li>
                                <li>
                                    又自<el-date-picker v-model="stencilData.sle8" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle9" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时起至
                                    <el-date-picker v-model="stencilData.sle10" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle11" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时，
                                </li>
                                <li>将<el-select v-model="stencilData.sle12" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle13" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                            <ul v-if="newCommand.commandType && newCommand.commandType[1] == 1502">
                                <li>
                                    接触轨停电后，车辆段
                                    <el-select v-model="stencilData.sle1" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle2" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行至
                                    <el-select v-model="stencilData.sle3" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle4" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行至
                                    <el-input v-model="stencilData.sle5"></el-input>线
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle6" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle7" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行加开
                                    <el-input v-model="stencilData.sle8"></el-input>次，
                                    <el-input v-model="stencilData.sle9"></el-input>次
                                    <el-select v-model="stencilData.sle10" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle11" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                </li>
                                <li>
                                    <el-select v-model="stencilData.sle12" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行按进路闭塞法行车，
                                    <el-select v-model="stencilData.sle13" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-input v-model="stencilData.sle14"></el-input>线
                                    <el-select v-model="stencilData.sle15" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站
                                    <el-select v-model="stencilData.sle16" >
                                        <el-option label="上" value="上"></el-option>
                                        <el-option label="下" value="下"></el-option>
                                    </el-select>行电话路闭塞法行车，
                                </li>
                                <li>又自
                                    <el-date-picker v-model="stencilData.sle17" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle18" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时起至
                                    <el-date-picker v-model="stencilData.sle19" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>：
                                    <el-time-picker v-model="stencilData.sle20" value-format="HH:mm:ss" placeholder="任意时间点"></el-time-picker>时，
                                </li>
                                <li>将
                                    <el-select v-model="stencilData.sle21" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站至
                                    <el-select v-model="stencilData.sle22" >
                                        <el-option v-for="item in errLocation" :key="item.id" :label="item.label" :value="item.label"></el-option>
                                    </el-select>站控制权下放集中站办理。
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                </li>
                <li>
                    <label>
                        <el-form-item prop="commandContext">
                            <strong>命令内容</strong>
                            <!-- <el-input  v-model="newCommand.commandContext" type="textarea" autosize placeholder="请输入内容" class="bigInput" :disabled="true"></el-input> -->
                            <div class="stencil">
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 101">
                                    准<span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}人员（
                                    <span v-if="!stencilData.inp2">（）</span>{{stencilData.inp2}}名）在站
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}添乘
                                    <span v-if="!stencilData.inp3">（）</span>{{stencilData.inp3}}次列车，
                                    在<span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行区间（公里标）下车。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 102">
                                    准<span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}人员（
                                    <span v-if="!stencilData.inp2">（）</span>{{stencilData.inp2}}名）在
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行区间（公里标处）添乘
                                    <span v-if="!stencilData.inp3">（）</span>{{stencilData.inp3}}次列车至
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 201">
                                    自即时起，将<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行区间（及
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站、
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站下行站线）线路封锁。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 202">
                                    自即时起，将<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站
                                    <span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}信号机（公里标）至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.inp2">（）</span>{{stencilData.inp2}}信号机（公里标）间线路封锁。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 203">
                                    自即时起，将<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行区间（及
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站、
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站下行站线）线路封锁解除。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 301">
                                    <span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}列车司机，车辆段（场）至
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}行至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行加开
                                    <span v-if="!stencilData.inp2">（）</span>{{stencilData.inp2}}次。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 302">
                                    <span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}列车司机，
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站库线至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行至
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}行加开
                                    <span v-if="!stencilData.inp2">（）</span>{{stencilData.inp2}}次。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 401">
                                    <span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}次
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}行至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行/段停运。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 501">
                                    自即时起，将<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站封锁
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 502">
                                    自即时起，至<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}时止，将
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站封闭。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 503">
                                    自即时起，<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站封闭解除。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 504">
                                    自即时起，至<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}时止，将
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站解封。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 601">
                                    因<span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}原因自即时起，将
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站控制权下放。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 602">
                                    自<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}:
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}时起至次日
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}时止，将
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站控制权下放车站处理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 701">
                                    <span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}次列车
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行间改按进路闭塞法行车。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 702">
                                    <span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}次列车
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行间改按进路闭塞法行车。
                                    又自即时起，将<span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站至
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 703">
                                    自即时起，<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行间改按进路闭塞法行车。
                                    即时起，将<span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站至
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 704">
                                    自即时起，<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行，恢复基本闭塞法行车，
                                    又自即时起，将<span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站至
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站控制权收回中心办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 801">
                                    准<span v-if="!stencilData.inp1">（）</span>{{stencilData.inp1}}次
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}行反方向行至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行，按电话闭塞法行车。
                                    又自即时起，将
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站至
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 901">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次列车，
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行，限速
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}公里/小时运行。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 902">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次列车，
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}公里标至
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}公里标间，限速
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}公里/小时运行。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1001">
                                    自<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}
                                    时起，将<span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}
                                    站至<span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}
                                    站上下行区间封锁，准<span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}
                                    站站务人员进入封锁区间，配合<span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}
                                    次列车向<span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}
                                    站方向疏导乘客。又自即时起，将<span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}
                                    站至<span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}
                                    站控制权下放车站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1101">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次，在
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站通过不停车。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1102">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次，在
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站通过不停车。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1201">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次列车，在
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站清人。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1301">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站清人，
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站至
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站/段加开
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}次，
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}次运行至
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}站与故障车连挂，连挂完毕后运行回段，按进路闭塞法行车。   
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1302">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次在
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站与故障车连挂，连挂完毕后，
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}次（原车次）列车运行至
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站清人，
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}次
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}站至
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}站停运，
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}站至
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}站/段加开
                                    <span v-if="!stencilData.sle10">（）</span>{{stencilData.sle10}}次，
                                    <span v-if="!stencilData.sle11">（）</span>{{stencilData.sle11}}次连挂完毕后运行回段，按进路闭塞法行车。又自即时起，将
                                    <span v-if="!stencilData.sle12">（）</span>{{stencilData.sle12}}站至
                                    <span v-if="!stencilData.sle13">（）</span>{{stencilData.sle13}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1303">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站停运，
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站至
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站/段加开
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}次，
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}次在
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}站至
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}站
                                    <span v-if="!stencilData.sle10">（）</span>{{stencilData.sle10}}行区间与故障车连挂，连挂完毕后故障车运行至
                                    <span v-if="!stencilData.sle11">（）</span>{{stencilData.sle11}}站清人，清人完毕后运行回段，按进路闭塞法行车。又自即时起，将
                                    <span v-if="!stencilData.sle12">（）</span>{{stencilData.sle12}}站至
                                    <span v-if="!stencilData.sle13">（）</span>{{stencilData.sle13}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1304">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次（原车次）担当救援任务，在
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行区间与（故障车）连挂，连挂完毕后推进至
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站清人，故障列车、救援列车清人完毕后，
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}次
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}站至
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}站停运。
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}站至
                                    <span v-if="!stencilData.sle10">（）</span>{{stencilData.sle10}}站/段加开
                                    <span v-if="!stencilData.sle11">（）</span>{{stencilData.sle11}}次，
                                    <span v-if="!stencilData.sle12">（）</span>{{stencilData.sle12}}次按进路闭塞法办理行车。又自即时起，将
                                    <span v-if="!stencilData.sle13">（）</span>{{stencilData.sle13}}站至
                                    <span v-if="!stencilData.sle14">（）</span>{{stencilData.sle14}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1401">
                                    自<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}：
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}时起至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}：
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}，准
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}专业/公司施工人员在
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}站至
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}站
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}行区间，进行
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}施工。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1402">
                                    自<span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}：
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}起至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}：
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}，
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}站至
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}站
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}行建立施工领域，准
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}公司施工人员在施工领域内进行
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}施工。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1403">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}次停于
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站。
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站至
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}站
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}行建立施工领域，准
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}次列车在施工领域内配合
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}公司施工人员在施工领域内进行
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}施工。施工完毕后，停于
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}站，与
                                    <span v-if="!stencilData.sle10">（）</span>{{stencilData.sle10}}站综控员联系，得到允许后，
                                    <span v-if="!stencilData.sle11">（）</span>{{stencilData.sle11}}次方准继续运行回段。
                                    <span v-if="!stencilData.sle12">（）</span>{{stencilData.sle12}}次按进路闭塞法办理行车，限
                                    <span v-if="!stencilData.sle13">（）</span>{{stencilData.sle13}}次次日
                                    <span v-if="!stencilData.sle14">（）</span>{{stencilData.sle14}}时前到段。又自
                                    <span v-if="!stencilData.sle15">（）</span>{{stencilData.sle15}}：
                                    <span v-if="!stencilData.sle16">（）</span>{{stencilData.sle16}}时起至
                                    <span v-if="!stencilData.sle17">（）</span>{{stencilData.sle17}}：
                                    <span v-if="!stencilData.sle18">（）</span>{{stencilData.sle18}}时，将
                                    <span v-if="!stencilData.sle19">（）</span>{{stencilData.sle19}}站至
                                    <span v-if="!stencilData.sle20">（）</span>{{stencilData.sle20}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1501">
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站至
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}站
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}行段加开
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}次，
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}次按进路闭塞法办理行车，限
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}次次日
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}时前到段，又自
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}：
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}时起至
                                    <span v-if="!stencilData.sle10">（）</span>{{stencilData.sle10}}：
                                    <span v-if="!stencilData.sle11">（）</span>{{stencilData.sle11}}时，将
                                    <span v-if="!stencilData.sle12">（）</span>{{stencilData.sle12}}站至
                                    <span v-if="!stencilData.sle13">（）</span>{{stencilData.sle13}}站控制权下放集中站办理。
                                </p>
                                <p v-if="newCommand.commandType && newCommand.commandType[1] == 1502">
                                    接触轨停电后，车辆段
                                    <span v-if="!stencilData.sle1">（）</span>{{stencilData.sle1}}站
                                    <span v-if="!stencilData.sle2">（）</span>{{stencilData.sle2}}行至
                                    <span v-if="!stencilData.sle3">（）</span>{{stencilData.sle3}}站
                                    <span v-if="!stencilData.sle4">（）</span>{{stencilData.sle4}}行至
                                    <span v-if="!stencilData.sle5">（）</span>{{stencilData.sle5}}线
                                    <span v-if="!stencilData.sle6">（）</span>{{stencilData.sle6}}站
                                    <span v-if="!stencilData.sle7">（）</span>{{stencilData.sle7}}行加开
                                    <span v-if="!stencilData.sle8">（）</span>{{stencilData.sle8}}次，
                                    <span v-if="!stencilData.sle9">（）</span>{{stencilData.sle9}}次
                                    <span v-if="!stencilData.sle10">（）</span>{{stencilData.sle10}}站至
                                    <span v-if="!stencilData.sle11">（）</span>{{stencilData.sle11}}站
                                    <span v-if="!stencilData.sle12">（）</span>{{stencilData.sle12}}行按进路闭塞法行车，
                                    <span v-if="!stencilData.sle13">（）</span>{{stencilData.sle13}}站至
                                    <span v-if="!stencilData.sle14">（）</span>{{stencilData.sle14}}线
                                    <span v-if="!stencilData.sle15">（）</span>{{stencilData.sle15}}站
                                    <span v-if="!stencilData.sle16">（）</span>{{stencilData.sle16}}行电话路闭塞法行车，又自
                                    <span v-if="!stencilData.sle17">（）</span>{{stencilData.sle17}}：
                                    <span v-if="!stencilData.sle18">（）</span>{{stencilData.sle18}}时起至
                                    <span v-if="!stencilData.sle19">（）</span>{{stencilData.sle19}}：
                                    <span v-if="!stencilData.sle20">（）</span>{{stencilData.sle20}}时，将
                                    <span v-if="!stencilData.sle21">（）</span>{{stencilData.sle21}}站至
                                    <span v-if="!stencilData.sle22">（）</span>{{stencilData.sle22}}站控制权下放集中站办理。
                                </p>
                            </div>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item prop="receiveStation">
                            <strong>受令处所</strong>
                            <el-select v-model="newCommand.receiveStation" filterable multiple placeholder="请选择" style="width:990px">
                                <el-option
                                    v-for="item in errLocation"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </label>
                </li>
                <li>
                    <label>
                        <el-form-item prop="sendUser">
                            <strong>发令人</strong>
                            <el-input v-model="newCommand.sendUser" placeholder="请输入内容" class="middleInput"></el-input>
                        </el-form-item>
                    </label>
                    <label>
                        <el-form-item prop="dispatcherCode">
                            <strong>调度员代码</strong>
                            <el-input v-model="newCommand.dispatcherCode" placeholder="请输入内容" class="middleInput"></el-input>
                        </el-form-item>
                    </label>
                </li>
            </ul>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()" size="small">取 消</el-button>
            <el-button type="primary" @click="creatOrder('formName')" size="small">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        class="dialogMain commandForm"
        :title="detail == false ? '调度命令签收' : '调度命令详情'"
        :visible.sync="dialogVisible"
        width="45%"
        top="5vh"
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
                        <span v-for="(item,index) in options" :key="index">
                            <span v-for="(items,indexs) in item.children" :key="indexs" v-if="sendData.commandType == items.value">
                                <el-input class="middleInput" :disabled="true" :value="items.label">{{items.label}}</el-input>
                            </span>
                        </span>
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
                    <el-form-item prop="commandType">
                        <strong>备注</strong>
                        <el-input v-model="sendData.commandRemark" type="textarea" autosize class="bigInput" :disabled="true">{{sendData.commandRemark}}</el-input>
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
            <li v-if="detail">
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
</div>
</template>

<script>
function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate() + ' '
    return Str
}
export default {
    data() {
        return {
            detail:false,
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
            dialogVisible1:false,
            searchInput:'',
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            tempData:[],
            tableData: [],
            tableTotal:0,
            options: [{
                value: '添乘列车',
                label: '添乘列车',
                children: [{
                    value: 101,
                    label: '车站添乘'
                },{
                    value: 102,
                    label: '区间添乘'
                }]
            },{
                value: '封锁区间',
                label: '封锁区间',
                children: [{
                    value: 201,
                    label: '站间封锁'
                },{
                    value: 202,
                    label: '信号机间封锁'
                },{
                    value: 203,
                    label: '开通区间'
                }]
            },{
                value: '加开列车',
                label: '加开列车',
                children: [{
                    value: 301,
                    label: '从车辆段加开'
                },{
                    value: 302,
                    label: '从车站库线加开'
                }]
            },{
                value: '列车停运',
                label: '列车停运',
                children: [{
                    value: 401,
                    label: '列车停运'
                }]
            },{
                value: '封锁车站',
                label: '封锁车站',
                children: [{
                    value: 501,
                    label: '单站封锁'
                },{
                    value: 502,
                    label: '单站限时封锁'
                },{
                    value: 503,
                    label: '单站解封'
                },{
                    value: 504,
                    label: '单站限时解封'
                }]
            },{
                value: '转换控制权',
                label: '转换控制权',
                children: [{
                    value: 601,
                    label: '控制权下放'
                },{
                    value: 602,
                    label: '控制权限时下放'
                }]
            },{
                value: '转换闭塞法',
                label: '转换闭塞法',
                children: [{
                    value: 701,
                    label: '改为进路闭塞'
                },{
                    value: 702,
                    label: '改为进路闭塞下放控制权'
                },{
                    value: 703,
                    label: '改为电话闭塞'
                },{
                    value: 704,
                    label: '恢复基本闭塞收回控制权'
                }]
            },{
                value: '反向运行',
                label: '反向运行',
                children: [{
                    value: 801,
                    label: '列车反向运行'
                }]
            },{
                value: '限速运行',
                label: '限速运行',
                children: [{
                    value: 901,
                    label: '站间限行'
                },{
                    value: 902,
                    label: '公里标间限行'
                }]
            },{
                value: '区间疏导',
                label: '区间疏导',
                children: [{
                    value: 1001,
                    label: '区间疏导乘客'
                }]
            },{
                value: '列车通过',
                label: '列车通过',
                children: [{
                    value: 1101,
                    label: '单站通过'
                },{
                    value: 1102,
                    label: '多站连续通过'
                }]
            },{
                value: '列车清人',
                label: '列车清人',
                children: [{
                    value: 1201,
                    label: '列车清人'
                }]
            },{
                value: '车站救援',
                label: '车站救援',
                children: [{
                    value: 1301,
                    label: '车站救车站'
                },{
                    value: 1302,
                    label: '区间救车站'
                },{
                    value: 1303,
                    label: '车站救区间'
                },{
                    value: 1304,
                    label: '区间救区间'
                }]
            },{
                value: '施工命令',
                label: '施工命令',
                children: [{
                    value: 1401,
                    label: '占用铁轨施工'
                },{
                    value: 1402,
                    label: '建立施工领域进行施工'
                },{
                    value: 1403,
                    label: '施工列车配合施工'
                }]
            },{
                value: '过轨列车',
                label: '过轨列车',
                children: [{
                    value: 1501,
                    label: '其他线路开来过轨列车'
                },{
                    value: 1502,
                    label: '由本线过轨至其他运营线路'
                }]
            },{
                value: '其他',
                label: '其他',
                children: [{
                    value: 999,
                    label: '其他'
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
                select_all:1,
                sort:0
            },
            sendData:{},
            errLocationValue:'',
            errLocation: [],
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
            innerData:{
                list:[]
            },
            newCommand:{
                commandCode:0,
                commandType:['添乘列车',101]
            },
            stencilData:{},
            sortTable:1
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
                        id:res.data[index].id,
                        label:res.data[index].stationName
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
                self.$notify.error({
                    title: '错误',
                    message: res.message
                });
            }
        })
    },
    mounted () {
        this.$EventBus.$on('refreshList',()=>{
            this.search()
        })    
    },
    methods: {
        handleClose(){
            this.dialogVisible = false
            this.dialogVisible1 = false
            this.detail = false
            this.sendData = {}
            this.newCommand = {
                commandCode:0,
                commandType:['添乘列车',101],
                receiveStation:[1]
            }
            this.$refs['formName'].resetFields();
            this.clearData()
        },
        search(value,page){
            var self = this
            if(value){
                this.reset = false
                this.searchData.start_time = null
                this.searchData.end_time = null
                if(this.searchTime){
                    console.log(this.searchTime);
                    this.searchData.startDate = GMTToStr(this.searchTime[0])
                    this.searchData.endDate = GMTToStr(this.searchTime[1])
                }

                // if(this.searchData.type && this.searchData.type.constructor == Array){
                //     this.searchData.type = this.searchData.type[this.searchData.type.length - 1]
                // }

                if(this.searchData.commandType1 && this.searchData.commandType1.constructor == Array){
                    this.searchData.commandType = this.searchData.commandType1[1]
                }

                this.searchData.current = 1
                this.searchData.size = 10

            }else{
                this.reset = true
                this.searchData = {
                    current:1,
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
                this.searchData.current = page
            }else{
                this.currentPage1 = 1
            }
            // this.searchData.select_all = null 

            this.searchData.sort = this.sortTable

            self.loading = true
            this.$api.post2('/api/iids-flat-adm/web/adm_dispatch/findDisCmdList',this.searchData).then(res => {
                console.log(res);
                if(res.success){
                    self.loading = false
                    self.tableTotal = res.data.total
                    self.tableData = []
                    for (let index = 0; index < res.data.list.length; index++) {
                        self.tableData.push({
                            id: res.data.list[index].id,
                            commandDate: res.data.list[index].commandDate,
                            commandTime: res.data.list[index].commandTime,
                            commandType: res.data.list[index].commandType,
                            commandCode: res.data.list[index].commandCode,
                            commandContext: res.data.list[index].commandContext,
                            receiveStation: res.data.list[index].receiveStation,
                            sendUser: res.data.list[index].sendUser,
                            state: res.data.list[index].state,
                            sign: res.data.list[index].sign,
                            notSign: res.data.list[index].notSign,
                            commandRemark: res.data.list[index].commandRemark,
                            dispatcherCode: res.data.list[index].dispatcherCode
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
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            this.$api.post('/api/alert_info/send_info',this.sendData).then(res => {
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
        sing(data){
            this.sendData = JSON.parse(JSON.stringify(data))
            this.dialogVisible = true
        },
        detailMain(data){
            this.sendData = JSON.parse(JSON.stringify(data))
            this.dialogVisible = true
            this.detail = true
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
                    self.search()
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        command(){
            var self = this
            this.dialogVisible1 = true
            this.newCommand = {
                commandCode:0,
                commandType:['添乘列车',101],
                receiveStation:[1]
            }
            this.$api.get('/api/iids-flat-adm/adm_dispatch/getCommandCode').then(res => {
                console.log(res);
                if(res.success){
                    self.newCommand.commandCode = res.data
                    console.log(self.newCommand);
                }else{
                    self.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            })
        },
        clearData(){
            for (const key in this.stencilData) {
                this.stencilData[key] = ''
            }
        },
        creatOrder(formName){
            var self = this
            var admDispatchCmdDTO = JSON.parse(JSON.stringify(this.newCommand))
            
            admDispatchCmdDTO.commandContext = $('.stencil p').text().trim().replace(/\s/g,"");
            admDispatchCmdDTO.commandType = admDispatchCmdDTO.commandType[1]
            admDispatchCmdDTO.receiveStation = admDispatchCmdDTO.receiveStation.toString()

            var myDate = new Date();
            admDispatchCmdDTO.commandDate = myDate.getFullYear() + '-' + ( myDate.getMonth() < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + '-' + ( myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate() )
            admDispatchCmdDTO.commandTime = ( myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours() ) + ':' + ( myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes() ) + ':' + ( myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds() )

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.post('/api/iids-flat-adm/web/adm_dispatch/save',admDispatchCmdDTO).then(res => {
                        console.log(res);
                        if(res.success){
                            self.dialogVisible1 = false
                            self.$notify.success({
                                title: '新建成功',
                                message: res.message
                            });
                            self.search()
                        }else{
                            self.$notify.error({
                                title: '错误',
                                message: res.message
                            });
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        changeSort(){
            console.log(this.sortTable);
            this.sortTable = 1 ^ this.sortTable
            this.search(1)
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


.command .el-table td .cell{height: 34px;line-height: 32px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap}
.command .el-button+.el-button{margin: 0;}
.command .commandForm{z-index: 2011;}
</style>