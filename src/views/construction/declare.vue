<template>
    <div class="declare">
        <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane label="占线施工">
                <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
                    <ul>
                        <li>
                            <label>
                                <el-form-item prop="commandDate">
                                    <strong>施工单位</strong>
                                    <el-select v-model="sendData.commandDate" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
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
                                <el-form-item prop="commandContext">
                                    <strong>施工日期</strong>
                                    <el-date-picker
                                        v-model="sendData.date"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                    <strong>施工时间</strong>
                                    <el-time-picker
                                        is-range
                                        v-model="sendData.picker"
                                        range-separator="至"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围">
                                    </el-time-picker>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong>是否有轨道车开行</strong>
                                    <el-radio v-model="sendData.guidao" label="1">需要封锁施工</el-radio>
                                    <el-radio v-model="sendData.guidao" label="2">不需要封锁施工</el-radio>
                                    <el-radio v-model="sendData.guidao" label="3">无</el-radio>
                                    <div v-if="sendData.guidao == 1" class="children">
                                        <span>施工区段：</span>
                                        <el-select v-model="sendData.commandDate1" placeholder="请选择">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        至
                                        <el-select v-model="sendData.commandDate2" placeholder="请选择">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-radio v-model="sendData.guidao1" label="1">上行</el-radio>
                                        <el-radio v-model="sendData.guidao1" label="2">下行</el-radio>
                                    </div>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong>&nbsp;&nbsp;</strong>
                                    <el-checkbox v-model="sendData.check">是否有夜间列车调试</el-checkbox>
                                    <div v-if="sendData.check" class="children">
                                        <span>调试区段：</span>
                                        <el-select v-model="sendData.commandDate3" placeholder="请选择">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        至
                                        <el-select v-model="sendData.commandDate4" placeholder="请选择">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-radio v-model="sendData.guidao2" label="1">上行</el-radio>
                                        <el-radio v-model="sendData.guidao2" label="2">下行</el-radio>
                                    </div>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandCode">
                                    <strong>施工负责人</strong>
                                    <el-input v-model="sendData.commandCode" class="middleInput" ></el-input>
                                </el-form-item>
                            </label>
                            <label>
                                <el-form-item prop="commandCode">
                                    <strong>施工人数</strong>
                                    <el-input v-model="sendData.commandCode" class="middleInput" ></el-input>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong>其他事项</strong>
                                    <el-checkbox v-model="sendData.check1">是否有动火证</el-checkbox>
                                </el-form-item>
                            </label>
                            <div class="children" v-if="sendData.check1">
                                <el-upload action="#" list-type="picture-card" :auto-upload="false">
                                    <i slot="default" class="el-icon-plus"></i>
                                    <div slot="file" slot-scope="{file}">
                                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                                        <span class="el-upload-list__item-actions">
                                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                            <i class="el-icon-zoom-in"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                            <i class="el-icon-download"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                            <i class="el-icon-delete"></i>
                                            </span>
                                        </span>
                                    </div>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                            <br>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong style="color:#fff">其他事项</strong>
                                    <el-checkbox v-model="sendData.check2">接地线位置</el-checkbox>
                                </el-form-item>
                            </label>
                            <div class="children" v-if="sendData.check2">
                                <el-input v-model="sendData.commandRemark" type="textarea" class="bigInput" >{{sendData.commandRemark}}</el-input>
                            </div>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandDate">
                                    <strong>外委单位</strong>
                                    <el-select v-model="sendData.commandDate3" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
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
                                <el-form-item prop="commandType">
                                    <strong>备注</strong>
                                    <el-input v-model="sendData.commandRemark1" type="textarea" class="bigInput" >{{sendData.commandRemark}}</el-input>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong>施工内容</strong>
                                    <el-input v-model="sendData.commandRemark" type="textarea" class="bigInput" >{{sendData.commandRemark}}</el-input>
                                </el-form-item>
                            </label>
                        </li>
                    </ul>
                    <el-button type="primary" size="medium" class="submit">申报</el-button>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="占线计表">
                <el-form :model="sendData" :rules="rules" ref="formName" label-width="100px" class="demo-ruleForm">
                    <ul>
                        <li>
                            <label>
                                <el-form-item prop="commandDate">
                                    <strong>施工单位</strong>
                                    <el-select v-model="sendData.commandDate" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
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
                                <el-form-item prop="commandContext">
                                    <strong>施工日期</strong>
                                    <el-date-picker
                                        v-model="sendData.date"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                    <strong>施工时间</strong>
                                    <el-time-picker
                                        is-range
                                        v-model="sendData.picker"
                                        range-separator="至"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围">
                                    </el-time-picker>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandCode">
                                    <strong>施工负责人</strong>
                                    <el-input v-model="sendData.commandCode" class="middleInput" ></el-input>
                                </el-form-item>
                            </label>
                            <label>
                                <el-form-item prop="commandCode">
                                    <strong>施工人数</strong>
                                    <el-input v-model="sendData.commandCode" class="middleInput" ></el-input>
                                </el-form-item>
                            </label>
                        </li>
                       
                        <li>
                            <label>
                                <el-form-item prop="commandDate">
                                    <strong>控制权下放</strong>
                                    <el-radio v-model="sendData.guidao5" label="1">需要</el-radio>
                                    <el-radio v-model="sendData.guidao5" label="2">不需要</el-radio>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong>备注</strong>
                                    <el-input v-model="sendData.commandRemark1" type="textarea" class="bigInput" >{{sendData.commandRemark}}</el-input>
                                </el-form-item>
                            </label>
                        </li>
                        <li>
                            <label>
                                <el-form-item prop="commandType">
                                    <strong>计表内容</strong>
                                    <el-input v-model="sendData.commandRemark" type="textarea" class="bigInput" >{{sendData.commandRemark}}</el-input>
                                </el-form-item>
                            </label>
                        </li>
                    </ul>
                    <el-button type="primary" size="medium" class="submit">申报</el-button>
                </el-form>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
export default{
    data(){
        return{
            sendData:{},
            options: [
                {
                    value: 0,
                    label: '机电公司'
                },
                {
                    value: 1,
                    label: '线路公司'
                }
            ],
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false
        }
    },
    methods: {
        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            console.log(file);
        },
        handleClick(){
            this.sendData = {}
        }
    }
}
</script>

<style lang="scss" scoped>
.declare{padding: 20px 0 0 0;font-size: 12px;}
.declare ul{padding-bottom: 10px;}
.declare ul li{padding-bottom: 15px;}
.declare ul li strong{width: 120px;display: inline-block;text-align: right;margin-right: 10px;}
.declare ul li .middleInput{width: 214px;}
.declare ul li .children{padding-left: 135px;}
.declare ul li .el-textarea{width: 400px;}
.declare ul li .children textarea,.declare ul li .children .el-textarea{width: 400px !important;}
.declare ul li .el-range-editor.el-input__inner{padding: 0 15px;margin: -3px 0 0 0;vertical-align: middle;display: inline-block;}
.declare .submit{margin: 0 0 0 135px;}
</style>
