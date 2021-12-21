<template>
    <div class="index">
        <header>
            <div class="time">{{date}}</div>
            <img src="../assets/basie/indexLogo.png" />
            <div class="location">
                <span class="loc">北京市</span>
                <span class="weather">晴 14°C</span>
            </div>
        </header>
        <el-row type="flex" class="main row-bg" justify="space-between">
            <el-col :span="7" class="group left">
                <div class="child">
                    <div class="title">
                        <h4>列车满载率</h4>
                    </div>
                    <div class="loaded childMain">
                        <ul>
                            <li>
                                <h3>19号线<span>北太平庄站至积水潭站</span></h3>
                                <div class="pic">
                                    <span :style="{'width':fullyNum + '%'}"></span>
                                </div>
                                <div class="num">
                                    <img src="../assets/basie/people.png" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum > 33" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum > 66"  />
                                    <span>{{fullyNum}}</span><sub>%</sub>
                                </div>
                            </li>
                            <li>
                                <h3>11号线<span>模式口站至金安桥站</span></h3>
                                <div class="pic">
                                    <span :style="{'width':fullyNum1 + '%'}"></span>
                                </div>
                                <div class="num">
                                    <img src="../assets/basie/people.png" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum1 > 33" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum1 > 66"  />
                                    <span>{{fullyNum1}}</span><sub>%</sub>
                                </div>
                            </li>
                            <li>
                                <h3>11号线<span>马连道站至洋桥站</span></h3>
                                <div class="pic">
                                    <span :style="{'width':fullyNum2 + '%'}"></span>
                                </div>
                                <div class="num">
                                    <img src="../assets/basie/people.png" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum2 > 33" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum2 > 66"  />
                                    <span>{{fullyNum2}}</span><sub>%</sub>
                                </div>
                            </li>
                            <li>
                                <h3>19号线<span>牛街站至新宫站</span></h3>
                                <div class="pic">
                                    <span :style="{'width':fullyNum3 + '%'}"></span>
                                </div>
                                <div class="num">
                                    <img src="../assets/basie/people.png" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum3 > 33" />
                                    <img src="../assets/basie/people.png" v-if="fullyNum3 > 66"  />
                                    <span>{{fullyNum3}}</span><sub>%</sub>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="child">
                    <div class="title">
                        <h4>列车正点率</h4>
                        <span class="titleMain">
                            <el-select v-model="month" placeholder="月">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                    <div class="childMain">
                        <div class="tooltip">
                            <span class="span1">路网</span>
                            <span class="span2">标准</span>
                        </div>
                        <div ref="punDom" class="cheart"></div>
                    </div>
                </div>
                <div class="child">
                    <div class="title">
                        <h4>雷达图</h4>
                    </div>
                    <div class="childMain">
                        <div class="tooltip">
                            <span class="span1">路网</span>
                            <span class="span2">标准</span>
                        </div>
                        <!-- <div ref="cashDom" class="cheart"></div> -->
                        <video src="../assets/leida.mp4" autoplay="autoplay" loop="loop" width="100%"></video>
                    </div>
                </div>
            </el-col>
            <el-col :span="14" class="group middle">
                <div class="subway">
                    <p>
                        <span>
                            在线总人数
                            <b>{{ counter }}</b>
                        </span>
                        <span>
                            累计进站人数
                            <b>{{ counter1 }}</b>
                        </span>
                        <span>
                            累计出站人数
                            <b>{{ counter2 }}</b>
                        </span>
                        <span>
                            累计换乘人数
                            <b>{{ counter3 }}</b>
                        </span>
                    </p>
                    <svg id="subway" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
                </div>
                <div class="child middleBottom">
                    <div class="title">
                        <h4>线路图</h4>
                    </div>
                    <div class="childMain">
                        <video src="../assets/line.mp4" autoplay="autoplay" loop="loop" width="100%"></video>
                    </div>
                </div>
            </el-col>
            <el-col :span="7" class="group right">
                <div class="child">
                    <div class="title">
                        <el-radio-group v-model="tabPosition" @change="changePeople()">
                            <el-radio label="top" border size="medium">在线总人数</el-radio>
                            <el-radio label="right" border size="medium">累计进站人数</el-radio>
                            <el-radio label="bottom" border size="medium">累计出站人数</el-radio>
                            <el-radio label="left" border size="medium">累计换乘人数</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="childMain">
                        <div ref="numDom" class="cheart"></div>
                    </div>
                </div>
                <div class="child fault">
                    <div class="title">
                        <h4>设备故障统计</h4>
                    </div>
                    <div class="childMain">
                        <h3>
                            <span>设备类型</span>
                            <span>故障原因</span>
                            <span>发生次数</span>
                        </h3>
                        <div class="srollList">
                            <ul>
                                <li>
                                    <span>信号</span>
                                    <span>VOBC故障</span>
                                    <span>{{errorNum}}</span>
                                </li>
                                <li>
                                    <span>车辆</span>
                                    <span>MCM故障</span>
                                    <span>{{errorNum}}</span>
                                </li>
                                <li>
                                    <span>安全门</span>
                                    <span>继电器故障</span>
                                    <span>{{errorNum}}</span>
                                </li>
                                <li>
                                    <span>供电</span>
                                    <span>电压过载</span>
                                    <span>{{errorNum}}</span>
                                </li>
                                <li>
                                    <span>线路</span>
                                    <span>轨道裂纹</span>
                                    <span>{{errorNum}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="child fault alert">
                    <div class="title">
                        <h4>实时告警</h4>
                        <span class="titleMain">
                            <el-select v-model="month" placeholder="级别">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="month" placeholder="线路">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="month" placeholder="分类">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                    <div class="childMain">
                        <h3>
                            <span style="width:40%;">时间</span>
                            <span style="width:28.5%;">告警路线</span>
                            <span style="width:28.5%;">告警内容</span>
                        </h3>
                        <div class="srollList">
                            <ul :class="{'animate-up': animateUp}">
                                <li v-for="(item,index) in listData" :key="index">
                                    <span>{{item.time}}</span>
                                    <span>{{item.line}}</span>
                                    <span>{{item.content}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from "echarts";
var Punctuality = {
    grid:{
        bottom:30,
        right:20
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        }
    },
    xAxis: {
        type: 'category',
        axisLine:{
            lineStyle:{
                color:'#29304D'
            }
        },
        axisLabel:{
            color:'#fff'
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value',
        name:'百分比(%)',
        nameTextStyle:{
            fontSize:14
        },
        nameGap:27,
        axisLine:{
            show:false,
            lineStyle:{
                color:'#fff'
            }
        },
        splitLine:{
            lineStyle:{
                color:'#29304D'
            }
        },
        axisTick:{
            show:false
        }
    },
    series: [{
        barWidth:'20%',
        itemStyle: {
            normal: {
                color:'#333FFF',
                barBorderRadius:[15, 15, 0, 0]
            }
        },
        markLine:{
            data: [{
                yAxis: 180,
                label:{
                    show:false
                },
                lineStyle:{
                    type:'solid',
                    color:'#23B899'
                }
            },{
                yAxis: 150,
                label:{
                    show:false
                },
                lineStyle:{
                    color:'#FF5858'
                }
            }],
            symbol: ['none', 'none'],
            silent: false
        },
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
};
var Cash = {
    grid:{
        bottom:30,
        right:20
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        }
    },
    xAxis: {
        type: 'category',
        axisLine:{
            lineStyle:{
                color:'#29304D'
            }
        },
        axisLabel:{
            color:'#fff'
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value',
        name:'百分比(%)',
        nameTextStyle:{
            fontSize:14
        },
        nameGap:27,
        axisLine:{
            show:false,
            lineStyle:{
                color:'#fff'
            }
        },
        splitLine:{
            lineStyle:{
                color:'#29304D'
            }
        },
        axisTick:{
            show:false
        }
    },
    series: [{
        barWidth:'20%',
        itemStyle: {
            normal: {
                color:'#333FFF',
                barBorderRadius:[15, 15, 0, 0]
            }
        },
        markLine:{
            data: [{
                yAxis: 180,
                label:{
                    show:false
                },
                lineStyle:{
                    type:'solid',
                    color:'#23B899'
                }
            },{
                yAxis: 150,
                label:{
                    show:false
                },
                lineStyle:{
                    color:'#FF5858'
                }
            }],
            symbol: ['none', 'none'],
            silent: false
        },
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
};
var NumberPeople = {
    grid:{
        bottom:30,
        right:20
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "line"
        }
    },
    xAxis: {
        type: 'category',
        axisLine:{
            lineStyle:{
                color:'#29304D'
            }
        },
        axisLabel:{
            color:'#fff'
        },
        boundaryGap:false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value',
        name:'(人数:万)',
        nameTextStyle:{
            fontSize:14
        },
        nameGap:27,
        axisLine:{
            show:false,
            lineStyle:{
                color:'#fff'
            }
        },
        splitLine:{
            lineStyle:{
                color:'#29304D'
            }
        },
        axisTick:{
            show:false
        }
    },
    series: [{
        data: [10, 50, 20, 60, 40, 20, 40],
        type: 'line',
        itemStyle: {
            color: "#333fff",
            borderColor: "#fff",
            borderWidth: 3,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
        },
        // smooth: true,
        showSymbol:false,
        symbol: 'emptyCircle',
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(31, 38, 126, 1)'
            }, {
                offset: 1,
                color: 'rgba(51, 63, 255, 0)'
            }])
        }
    }]
};
var tctSubway = null

export default {
    name: 'index',
    components:{
    },
    data () {
        return {
            color1:'',
            loading:false,
            date:'',
            loc:'',
            month:'',
            tabPosition: 'left',
            options: [{
                value: '选项1',
                label: '1'
            }, {
                value: '选项2',
                label: '2'
            }, {
                value: '选项3',
                label: '3'
            }, {
                value: '选项4',
                label: '4'
            }, {
                value: '选项5',
                label: '5'
            }],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            counter: 0,
            counter1: 0,
            counter2: 0,
            counter3: 0,
            start: 0,
            start1: 0,
            start2: 0,
            start3: 0,
            end: 0,
            end1: 0,
            end2: 0,
            end3: 0,
            duration: 3,
            format: true,
            animateUp: false,
            timer:null,
            listData:[{
                time:'2021-03-22 14:22:00',
                line:'1号线',
                content:'告警内容'
            },{
                time:'2021-03-22 14:22:00',
                line:'2号线',
                content:'告警内容'
            },{
                time:'2021-03-22 14:22:00',
                line:'3号线',
                content:'告警内容'
            },{
                time:'2021-03-22 14:22:00',
                line:'4号线',
                content:'告警内容'
            },{
                time:'2021-03-22 14:22:00',
                line:'5号线',
                content:'告警内容'
            },{
                time:'2021-03-22 14:22:00',
                line:'6号线',
                content:'告警内容'
            },{
                time:'2021-03-22 14:22:00',
                line:'7号线',
                content:'告警内容'
            }],
            errorNum:0,
            errorStart:0,
            errorEnd:0,
            fullyNum:0,
            fullyNum1:0,
            fullyNum2:0,
            fullyNum3:0,
            fullyStart:0,
            fullyStart1:0,
            fullyStart2:0,
            fullyStart3:0,
            fullyEnd:0,
            fullyEnd1:0,
            fullyEnd2:0,
            fullyEnd3:0
        }
    },
    created () {
        var formatDate = function (date) {  
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h=h < 10 ? ('0' + h) : h;
            var dd=date.getDay();
            var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second=date.getSeconds();
            second=second < 10 ? ('0' + second) : second;
            return y + '.' + m + '.' + d + ' ' + weekday[dd] + ' ' + h + ':' + minute + ':' + second;
        };
        setInterval(() => {
            this.date = formatDate(new Date())
        },1000);
        function rgbaToHex(color) {
            var values = color
                .replace(/rgba?\(/, '')
                .replace(/\)/, '')
                .replace(/[\s+]/g, '')
                .split(',');
            var a = parseFloat(values[3] || 1),
                r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
                g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
                b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

            return "#" +
                ("0" + r.toString(16)).slice(-2) +
                ("0" + g.toString(16)).slice(-2) +
                ("0" + b.toString(16)).slice(-2);
        }
        function getColorByNumber(n) {
            let halfMax = 50
            var one = 255 / halfMax; 
            var r = 0;
            var g = 0;
            var b = 0;
            if (n < halfMax) {
                r = one * n;  
                g = 255;
            }
            if (n >= halfMax) {
                g = (255 - ((n - halfMax) * one)) < 0 ? 0 : (255 - ((n - halfMax) * one))
                r = 255;
            }
            r = parseInt(r);
            g = parseInt(g);
            b = parseInt(b);
            return rgbaToHex("rgb(" + r + "," + g + "," + b + ")");
        }
        this.color1 = getColorByNumber(100)
    },
    computed: {
        formatter() {
            return new Intl.NumberFormat('en-IN');
        }
    },
    mounted(){
        var self = this
        var myChart = this.$echarts.init(this.$refs.punDom)
        myChart.setOption(Punctuality);
        // var myChart1 = this.$echarts.init(this.$refs.cashDom)
        // myChart1.setOption(Cash);
        var myChart2 = this.$echarts.init(this.$refs.numDom)
        myChart2.setOption(NumberPeople);

        setInterval(function () {
            for (let index = 0; index < Punctuality.series[0].data.length; index++) {
                Punctuality.series[0].data[index] = Math.abs(Math.floor((Math.random() - 0.4) * 100))
                // Cash.series[0].data[index] = Math.abs(Math.floor((Math.random() - 0.4) * 100))
                NumberPeople.series[0].data[index] = Math.abs(Math.floor((Math.random() - 0.4) * 100))
            }
            myChart.setOption(Punctuality);
            // myChart1.setOption(Cash);
            myChart2.setOption(NumberPeople);
            self.start = self.end
            self.end = Math.abs(Math.floor((Math.random() - 0.4) * 1000))

            self.start1 = self.end1
            self.end1 = Math.abs(Math.floor((Math.random() - 0.4) * 1000))

            self.start2 = self.end2
            self.end2 = Math.abs(Math.floor((Math.random() - 0.4) * 1000))

            self.start3 = self.end3
            self.end3 = Math.abs(Math.floor((Math.random() - 0.4) * 1000))


            self.fullyStart = self.fullyEnd
            self.fullyEnd = Math.abs(Math.floor((Math.random() - 0.4) * 100))

            self.fullyStart1 = self.fullyEnd1
            self.fullyEnd1 = Math.abs(Math.floor((Math.random() - 0.4) * 100))

            self.fullyStart2 = self.fullyEnd2
            self.fullyEnd2 = Math.abs(Math.floor((Math.random() - 0.4) * 100))

            self.fullyStart3 = self.fullyEnd3
            self.fullyEnd3 = Math.abs(Math.floor((Math.random() - 0.4) * 100))

            self.errorStart = self.errorEnd
            self.errorEnd = Math.abs(Math.floor((Math.random() - 0.4) * 10))
            self.click();

            self.animateUp = true
            setTimeout(() => {
                self.listData.push(self.listData[0])
                self.listData.shift()
                self.animateUp = false
            }, 3000)

        },30000);

        this.click();
        
        tctSubway = new tct_subway({
            tmpId: 'subway',
            fullload:true
        })
        tctSubway.listener('loaded', function() {
            // tctSubway.showLine(self.value);
            tctSubway.loadRateMultiply(tctSubway.getPosition('西直门'),tctSubway.getPosition('积水潭'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('积水潭'),tctSubway.getPosition('鼓楼大街'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('鼓楼大街'),tctSubway.getPosition('安定门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('安定门'),tctSubway.getPosition('雍和宫'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('雍和宫'),tctSubway.getPosition('东直门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('东直门'),tctSubway.getPosition('东四十条'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('东四十条'),tctSubway.getPosition('朝阳门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('朝阳门'),tctSubway.getPosition('建国门'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('建国门'),tctSubway.getPosition('北京站'),Number((Math.random(1)*100).toFixed(2)))
            tctSubway.loadRateMultiply(tctSubway.getPosition('北京站'),tctSubway.getPosition('崇文门'),Number((Math.random(1)*100).toFixed(2)))
        })
        // tctSubway.on('lineName.touch',function(info){
        //     self.loadingPage(info.lineId)
        // })
    },
    methods:{
        click() {
            TweenMax.to(this, this.duration, {
                ease: Power2.easeInOut,
                log: this.end,
                log1:this.fullyEnd,
                log2:this.errorEnd,
                log3:this.fullyEnd1,
                log4:this.fullyEnd2,
                log5:this.fullyEnd3,
                log6: this.end1,
                log7: this.end2,
                log8: this.end3,
                onUpdate: () => {
                    this.counter = this.formatter.format(Math.floor(this.log))
                    this.counter1 = this.formatter.format(Math.floor(this.log6))
                    this.counter2 = this.formatter.format(Math.floor(this.log7))
                    this.counter3 = this.formatter.format(Math.floor(this.log8))
                    this.fullyNum = this.formatter.format(Math.floor(this.log1))
                    this.fullyNum1 = this.formatter.format(Math.floor(this.log3))
                    this.fullyNum2 = this.formatter.format(Math.floor(this.log4))
                    this.fullyNum3 = this.formatter.format(Math.floor(this.log5))
                    this.errorNum = this.formatter.format(Math.floor(this.log2))
                }
            })
        },
        changePeople(){
            var myChart2 = this.$echarts.init(this.$refs.numDom)
            for (let index = 0; index < NumberPeople.series[0].data.length; index++) {
                NumberPeople.series[0].data[index] = Math.abs(Math.floor((Math.random() - 0.4) * 100))
            }
            myChart2.setOption(NumberPeople);
        }
    },
    destroyed() {
        clearInterval(this.timer)
    }
}
</script>

<style>
@keyframes title_bg{
    0%{background: #2284c2;}
    49%{background: #2284c2;}
    50%{background: #24d9ff;}
    100%{background: #24d9ff;}
}

.index{width: 100vw;height: 100vh;overflow: hidden;position: relative;color: #fff;}
header{width: 100%;height: 82px;background: url(../assets/basie/header.png) no-repeat center center;position: absolute;top: 0;left: 0;z-index: 10;text-align: center;line-height: 82px;}
header .time{position: absolute;left:36px;top: 10px;font-size: 18px;}
header .location{position: absolute;right:36px;top: 10px;font-size: 18px;}
header .location span{padding: 0 0 0 20px;margin-left: 20px;}
header .location .loc{background: url(../assets/basie/icon1.png) no-repeat center left;}
header .location .weather{background: url(../assets/basie/icon2.png) no-repeat center left;}
header img{padding: 15px 0 0 0;}
.main{padding:82px 32px 0 32px;position: relative; z-index: 11;height: 100vh;}
.main .group{position: relative;}
.main .group .topBorder{width: 100%;height: 1px;background: #103665;display: block;position: relative;}
.main .group .child{position: relative;min-height: 200px;z-index: 2;background: #121626;border-radius: 4px;border:1px solid #29304D;margin-bottom: 16px;}
.main .group .child .childMain{position: relative;height: calc((100vh - 285px) / 3);overflow: hidden;}
.main .group .child .title{height: 50px; line-height: 50px;position: relative;border-bottom: 1px solid #29304D;font-size: 20px;font-family: Source Han Sans CN;}
.main .group .child .title h4{padding-left: 40px;}
.main .group .child .title .titleMain{position: absolute;right: 20px;top: 0;}
.main .group .child .title .el-input__suffix{right: 5px;top: -8px;}
.main .group .child .title span .el-select{width: 60px;vertical-align: top;}
.main .group .child .title span .el-select .el-input--suffix .el-input__inner{margin-top: 8px;display: block;height: 30px;line-height: 30px;border:1px solid #29304D;background-color: #161A2E;}
.main .group .child .title span .el-select .el-input--suffix .el-input__icon{line-height: 30px;}
.main .left::after,.main .right::after{opacity: .6;content: '';width: 100%;height: 100%;display: block;position: absolute;left: 0;top: 0;}

.loaded ul{display: flex;justify-content: space-around;padding: 20px 0 0 0;flex-wrap: wrap;height: 100%;}
.loaded ul li{width: 180px;display: inline-block;height: 20%;}
.loaded ul li h3{font-size: 16px;font-weight: bold;position: relative;line-height: 20px;padding-bottom: 14px;}
.loaded ul li h3 span{font-size:12px;font-weight: normal;float: right;}
.loaded ul li .pic{background: url(../assets/basie/train.png) no-repeat center center;width: 180px;height: 16px;position: relative;margin: 0 auto 6px auto;}
.loaded ul li .pic span{background: url(../assets/basie/Jianbian.png) no-repeat left center;width: 100%;height: 16px;display: block;transition: all 0.5s linear;}
.loaded ul li .num{font-size: 26px;font-weight: bold;}
.loaded ul li .num sub{font-size: 13px;font-weight: normal;vertical-align: middle;}
.loaded ul li .num img{vertical-align: middle;}
.loaded ul li .num span{vertical-align: middle;margin: 0 2px 0 4px;}

.cheart{width: 100%;height: 100%;}
.tooltip{position: absolute;z-index: 2;right: 20px;top: 16px;font-size: 14px;}
.tooltip span{display: inline-block;margin: 0 0 0 20px;}
.tooltip span::before{content: '';display: inline-block;width: 13px;height: 1px;vertical-align: middle;margin-right: 5px;}
.tooltip .span1::before{border-top: 1px solid #23B899;}
.tooltip .span2::before{border-top: 1px dashed #FF5858;}

.el-radio-group{padding:10px 0 0 0;height: 30px;vertical-align: middle;text-align: center;display: flex;justify-content: space-around;}
.el-radio-group .el-radio__input{display: none;}
.el-radio-group .el-radio{margin: 0 !important;display: inline-block;padding:0;height: 30px;line-height: 30px;border:1px solid #29304D;color: #6d717d;}
.el-radio-group .el-radio__label{padding: 0 5px;}
.el-radio-group .el-radio.is-bordered.is-checked{border:1px solid #333FFF;background: #333FFF;}
.el-radio-group .el-radio__input.is-checked+.el-radio__label{color: #fff;}

.fault h3{height: 50px;line-height: 50px;border-bottom: 1px solid #29304D;font-size: 14px;color: #6d717d;text-align: center;width: 100%;position: relative;}
.fault h3 span,.fault ul li span{display: inline-block;width: 32.5%;vertical-align: middle;}
.fault .srollList{height: calc(100% - 55px);position: relative;overflow: hidden;}
.fault ul{height: 100%;}
.fault ul li{display: table;width: 100%;text-align: center;height: 20%;color: #fff;border-bottom: 1px solid #29304D;font-size: 14px;cursor: pointer;}
.fault ul li:hover{color: #FF450D;}
.fault ul li span{position: relative;display: table-cell;}

.animate-up {transition: all 0.5s ease-in-out;transform: translateY(-20%);}
.alert ul li span:first-child{width: 40%;}
.main .group .alert .title span .el-select{width: 80px;}


.middle{padding:0 20px}
.main .group .middleBottom{position: absolute;bottom:0;width: calc(100% - 40px);}



.subway{width: 100%;height:calc((100vh - 104px) / 3 * 2);position: relative;}
#subway{width: 100%;height: calc(100% - 100px);}
.subway .btn{display: none;}
.subway p{text-align: center;width: calc(100% - 40px);display: flex;justify-content:space-around;padding:40px 0 0 0;}
.subway p span{font-size: 14px;}
.subway p b{display: block;font-size: 24px;color: #4EC1FB;}

.left{left:0;}

</style>