<template>
    <div 
        class="dashboard-containerr"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
    >

        <div class="all">
            <div class="all1">
                <div class="calcH move1" ref="aaa" :class="{ 'left' : loading}" style="z-index:10"></div>
                <div class="calcH move" ref="1" :class="{ 'left' : loading}" style="z-index:9"></div>
                <div class="calcH move" ref="2" :class="{ 'left' : loading}" style="z-index:8"></div>
                <div class="calcH move" ref="3" :class="{ 'left' : loading}" style="z-index:7"></div>
                <div class="calcH move" ref="4" :class="{ 'left' : loading}" style="z-index:6"></div>
                <div class="calcH move" ref="5" :class="{ 'left' : loading}" style="z-index:5"></div>
                <div class="calcH move" ref="6" :class="{ 'left' : loading}" style="z-index:4"></div>
                <div class="calcH move" ref="7" :class="{ 'left' : loading}" style="z-index:3"></div>
                <div class="calcH move" ref="8" :class="{ 'left' : loading}" style="z-index:2"></div>
                <div class="calcH move" ref="9" :class="{ 'left' : loading}" style="z-index:1"></div>
                <div class="calcH move" ref="10" :class="{ 'left' : loading}"></div>
            </div>
        </div>
        
        <div class="tooltip"  v-if="rungrapData.multiply">
            满载率：
            <span class="leave1">0%</span>
            <span class="leave2">0% - 50%</span>
            <span class="leave3">50% - 75%</span>
            <span class="leave4">75% - 100%</span>
            <span class="leave5">>100%</span>
        </div>
        <el-dialog
        title="区段信息"
        :visible.sync="dialogVisible"
        width="30%">
            <ul>
                <li>车次号：{{clickData.seriesId}}</li>
                <li>站台：{{clickData.name}}</li>
                <li>时间：{{clickData.time}}</li>
                <li>满载率：{{clickData.multiply}}</li>
                <li>上下行：{{clickData.runDirect}}</li>
                <li>查看该车次此刻时间段的其他数据：</li>
                <li style="text-align:center;">
                    <el-button type="success">客流情况</el-button>
                    <el-button type="warning">指标查看</el-button>
                    <el-button type="danger">运行仿真</el-button>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
import echarts from "echarts";
var charts = null
var colors = ['#5793f3', '#d14a61']
var Time = []
var Option = {
    color: colors,
    tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //     type: 'cross'
        // }
    },
    grid: {
        top: 65,
        bottom: 65,
        left:80,
        right:0
    },
    xAxis: [
        {
            type: 'category',
            scale:true,
            boundaryGap: false,
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: '#f1f1f1',
                }
            },
            splitLine:{
                show:true
            },
            axisLabel:{
                interval:59,
                margin:40,
                rich: {
                    bold: {
                        fontSize: 20,
                        fontWeight:600
                    }
                }
            },
            data: Time
        },
        {
            type: 'category',
            boundaryGap: false,
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: '#f1f1f1'
                }
            },
            splitLine:{
                show:true
            },
            axisLabel:{
                interval:59,
                margin:40,
                rich: {
                    bold: {
                        fontSize: 20,
                        fontWeight:600
                    }
                }
            },
            data: Time
        }
    ],
    yAxis: {
        // min:0,
        // max: 3,
        // splitNumber:25,
        type: 'category',
        scale:true,
        boundaryGap: false,
        splitLine:{
            show:true
        },
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000'
            },
            // interval:(value,index)=>{
            //     if(index == ''){
            //         return false
            //     }else{
            //         return index
            //     }
            // },
            // formatter: (value, index) => {//过滤整点x标
            //     // console.log(value);
            //     if(value != undefined){
            //         return value
            //     }else{
            //         return ''
            //     }
            // }
        },
        data:[]
        // interval:1
    },
    animation:false,
    series: []
}
var lastOption = null
var chunkOption = []
var _start = 0
var _end = 0
var t = null
var echartsAll = {
    echarts1:null,
    echarts2:null,
    echarts3:null,
    echarts4:null,
    echarts5:null,
    echarts6:null,
    echarts7:null,
    echarts8:null,
    echarts9:null,
    echarts10:null
}
function getTime(time){
    return (parseInt(time.substr(0,2)) < 4 ? parseInt(time.substr(0,2)) + 20  : parseInt(time.substr(0,2)) - 4 ) * 60 * 6 + parseInt(time.substr(3,5)) * 6 + Math.round(parseInt(time.substr(6,8))/10) // 每10秒间隔
}
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
function secondToDate(result) {
    var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + ":" + m + ":" + s;
}
export default {
    name: 'Rungrap',
    data(){
        return{
            size:[0,0],
            time:[],
            clickData:{},
            dialogVisible:false,
            charts:'',
            length:0,
            main:[],
            onloadNum:0,
            loading:false,
            x:[],
            lock:true,
            oldW:0,
            newW:0,
            max:0,
            subStation:[],
            key:true
        }
    },
    props:['rungrapData'],
    created(){
        console.log('-------------透传数据-------');
        console.log(this.rungrapData);
        console.log('-------------透传数据-------');
        var hours = 4
        var min = 0
        var second = -10
        this.subStation = JSON.parse(JSON.stringify(this.rungrapData.station))

        for (const key in this.subStation) {
            this.max = key
        }
        for (let index = 1; index < this.subStation.length; index++) {
            this.subStation[index][1] = this.subStation[index][1] * 10
            this.subStation[index][1] += this.subStation[index - 1][1]
        }
        for (let index = 0; index < this.subStation.length; index++) {
            this.subStation[index][1] = this.subStation[index][1] + 3
        }

        var arr = []
        var arr1 = []
        for (let index = 0; index < this.subStation.length; index++) {
            arr.push([this.subStation[index][0] - .3,this.subStation[index][1] - 3,''])
            arr1.push([this.subStation[index][0] + .3,this.subStation[index][1] + 3,''])
        }
        this.subStation.push(...arr)
        this.subStation.push(...arr1)
        console.log(this.subStation);
    
        for (let index = 0; index < 8640; index++) {
            second += 10
            if(second > 50){
                second = 0
                min++
            }
            if(min > 59){
                min = 0
                hours++
            }
            if(hours > 23){
                hours = 0
            }
            if(hours < 10){
                hours = '0' + hours
            }
            if(min < 10){
                min = '0' + min
            }
            if(second == 0){
                second = '0' + second
            }
            this.time.push(hours + ':' + min + ':' + second)
            Time.push(hours + ':' + min + ':' + second)
            hours = +hours
            min = +min
            second = +second
        }

        this.initData()
    },
    mounted(){
        var self = this
        this.drawLine();
        $(".all1").each(function(index,element) {
            console.log(element);
            element.onwheel = function(event){
                var table = $(element).parents(".all");
                var right = $(element).width()-table[0].offsetWidth;
                if (table.scrollLeft()<right&&event.deltaY>0) {
                    //禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）  
                    event.preventDefault(); 
                    var left = (table.scrollLeft() + 50);
                    table.scrollLeft(left) 
                }
                if (table.scrollLeft()>0&&event.deltaY<0) {
                    //禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）  
                    event.preventDefault(); 
                    var left = (table.scrollLeft() - 50);
                    table.scrollLeft(left) 
                }
            }
        })
    },
    methods:{
        initData(plan){
            var self = this
            console.time();
            var svLst = plan ? JSON.parse(sessionStorage.planRungrap) : JSON.parse(sessionStorage.rungrap)
            // var svLst = JSON.parse(sessionStorage.planRungrap)
            console.log('-------------透传数据-------');
            console.log(svLst);
            console.log('-------------透传数据-------');
            for (let index = 0; index < svLst.length; index++) {
                for (let x = 0; x < svLst[index].tripList.length; x++) {                    
                    if(x == svLst[index].tripList.length - 1){
                        splitData(svLst[index].tripList[x],x,svLst[index].tripList[x].runDir,1)
                    }else{
                        splitData(svLst[index].tripList[x],x,svLst[index].tripList[x].runDir,0)
                    }
                }
                // return
            }

            function splitData(data,nummm,rundirect,lineNum){                
                var arr = []
                var list = []
                var i = 0
                var s = 1
                var num = -1
                var numm = 0
                var color = ''
                var width = 1
                var multiply = 0
                var opacity = 1
                var nulldata = {}
                var dataColl = {
                    type: 'line',
                    xAxisIndex: 1,
                    // connectNulls:true,
                    data: [],
                    hoverAnimation:false,
                    legendHoverLink:false,
                    animation:false,
                    clip:false,
                    markLine: {
                        data: [
                            [{
                                coord: [0, 0]
                            },
                            {
                                coord: [0,0]
                            }],
                        ],
                        label: {
                            normal: {
                                show: true,
                                position: 'insideStartBottom',
                                formatter: '',
                            },
                        },
                        silent:false,
                        symbol:'none',
                        animation:false,
                        lineStyle: {
                            normal: {
                                type: 'solid',
                                color: '#000',
                                opacity:0,
                                z:3
                            },
                        },
                        z:2
                    },
                    lineStyle:{
                        opacity:0,
                        color:'#05ff00',
                        width:0
                    },
                    // progressive:10
                }
                var tmpID = null

                dataColl.name = '' + data.tripNo
                dataColl.markLine.label.normal.formatter = '' + data.tripNo
                // if(plan){
                dataColl.markLine.label.normal.color = '#333'
                // }
                for (let index = 0; index < data.pathListStr.length; index++) {
                    var tmp = data.pathListStr[index].split(',')
                    if(tmp[1] == 0){
                        data.pathListStr.splice(index,1)
                        index--
                        continue
                    }
                    
                    data.pathListStr[index] = {}
                    data.pathListStr[index].stationId = parseInt(tmp[0])
                    data.pathListStr[index].arriveTime = secondToDate(tmp[1])
                    data.pathListStr[index].departTime = secondToDate(tmp[2])
                    data.pathListStr[index].loadRateMultiply10000 = tmp[4]

                    // 数据终起点改变
                    if(index == 0){
                        if(data.pathListStr.length > 1){
                            var tmp1 = data.pathListStr[index + 1].split(',')
                            if(data.pathListStr[index].stationId == parseInt(tmp1[0])){
                                if(data.runDir == 85){
                                    data.pathListStr[index].stationId = parseInt(tmp1[0]) - .3
                                }else{
                                    data.pathListStr[index].stationId = parseInt(tmp1[0]) + .3
                                }
                            }
                        }
                    }else if(index == data.pathListStr.length - 1){
                        var tmp2 = data.pathListStr[index - 1]
                        if(data.pathListStr[index].stationId == tmp2.stationId){
                            data.pathListStr[index].stationId = tmp2.stationId + .3
                        }
                    }else{
                        if(data.pathListStr[index].stationId == tmpID){
                            if(data.pathListStr[index-2].stationId > tmpID){
                                data.pathListStr[index].stationId = data.pathListStr[index].stationId - .3
                            }else if(data.pathListStr[index-2].stationId == tmpID){
                                // data.pathListStr[index].stationId = data.pathListStr[index].stationId
                            }else{
                                data.pathListStr[index].stationId = data.pathListStr[index].stationId + .3
                            }
                        }else{
                            tmpID = data.pathListStr[index].stationId
                        }
                    }
                    
                    arr.push(getTime(data.pathListStr[index].arriveTime))
                    arr.push(getTime(data.pathListStr[index].departTime))
                    
                }
                dataColl.addselfSecond = arr[1]                
                dataColl.addselfArrive = arr[arr.length - 2]
                dataColl.addselfEnd = arr[arr.length - 1]

                for (let x = 0; x <= arr[arr.length - 1]; x++) {
                    if(x != arr[i]){
                        if(num != -1){
                            list.push('a' + num)
                        }else{
                            list.push('-')
                        }
                    }else{
                        num = data.pathListStr[Math.floor(i/2)].stationId ? data.pathListStr[Math.floor(i/2)].stationId - 1 : 0
                        for (let index = 0; index < self.subStation.length; index++) {
                            if(num == self.subStation[index][0]){
                                num = self.subStation[index][1]
                                break
                            }
                        }
                        // Y轴站台根据实际站台距离，手动调整
                        list.push(num)
                        if(!dataColl.addself){
                            dataColl.addself = x
                        }
                        dataColl.index = i
                        if(arr[i] == arr[i+1]){
                            i+=2
                        }else{
                            i++
                        }
                        if(i <= data.pathListStr.length * 2 - 1){                            
                            dataColl.markLine.data[s] = [{
                                coord: [x, num]
                            }]
                        }
                        
                        if(s > 1){
                            multiply = data.pathListStr[Math.floor((s -1)/2)].loadRateMultiply10000 / 10000
                            if(multiply == 0){
                                opacity = 1
                                width = 1
                            }else if(multiply > 0 && multiply <= 0.5){
                                opacity = 1
                                width = 1.75
                            }else if(multiply > 0.5 && multiply <= 0.75){
                                opacity = 1
                                width = 2
                            }else if(multiply > 0.75 && multiply <= 1){                                
                                opacity = 1
                                width = 2.25
                            }else{
                                opacity = 1
                                width = 2.5
                            }

                            color = plan ? getColorByNumber(parseInt(multiply * 100)) : '#333'
                            
                            dataColl.markLine.data[s - 1][1] = {
                                coord: [x,num]
                            }
                            if(self.rungrapData.multiply){
                                dataColl.markLine.data[s - 1][2] = {
                                    lineStyle: {
                                        color: color,
                                        opacity: opacity,
                                        width:width,
                                        multiply:multiply
                                    },
                                    label: {
                                        formatter:'',
                                        name:data.tripNo,
                                    }
                                }
                            }else{
                                dataColl.markLine.data[s - 1][2] = {
                                    lineStyle: {
                                        color: rundirect == 170 ? self.rungrapData.colors[0] : self.rungrapData.colors[1],
                                        opacity: 1,
                                        width:1,
                                        multiply:multiply
                                    },
                                    label: {
                                        formatter:'',
                                        name:data.tripNo,
                                    }
                                }
                                if(nummm == 0 || lineNum == 1){
                                    dataColl.markLine.data[s - 1][2].lineStyle.color = '#000'
                                }else{
                                    dataColl.markLine.lineStyle.normal.color = rundirect == 170 ? self.rungrapData.colors[0] : self.rungrapData.colors[1]
                                }
                                if(nummm != 0){
                                    dataColl.markLine.data[1][2].lineStyle.color = rundirect == 85 ? self.rungrapData.colors[0] : self.rungrapData.colors[1]
                                    if(nummm == 1){
                                        dataColl.markLine.data[1][2].lineStyle.color = '#000'
                                    }
                                }
                            }
                        }
                        s++
                    }                    
                    if(x == arr[arr.length - 1]){                        
                    }
                }
                // dataColl.markLine.data[0][0].coord[0] = arr[3]
                // dataColl.markLine.data[0][1].coord[0] = arr[4]
                // dataColl.markLine.data[0][0].coord[1] = dataColl.markLine.data[4][0].coord[1]
                // dataColl.markLine.data[0][1].coord[1] = dataColl.markLine.data[4][1].coord[1]

                dataColl.markLine.data[0][0].coord[0] = arr[3]
                dataColl.markLine.data[0][1].coord[0] = arr[4]
                if(dataColl.markLine.data.length > 4){
                    dataColl.markLine.data[0][0].coord[1] = dataColl.markLine.data[4][0].coord[1]
                    dataColl.markLine.data[0][1].coord[1] = dataColl.markLine.data[4][1].coord[1]
                }
                
                // if(!self.rungrapData.multiply){
                //     dataColl.lineStyle.color = rundirect == 170 ? self.rungrapData.colors[0] : self.rungrapData.colors[1]
                //     dataColl.markLine.data = dataColl.markLine.data.slice(0,1)
                // }
                dataColl.data = list
                dataColl.runDirect = rundirect == 170 ? 0 : 1

                if(dataColl.markLine.data[dataColl.markLine.data.length - 1].length == 1){//防止最后一个画线不能赋值，直接删除
                    dataColl.markLine.data = dataColl.markLine.data.slice(0,dataColl.markLine.data.length - 2)
                }


                self.appendData(dataColl,svLst[0].tripList.length)
                return
            }
        },
        appendData(seriesData,num){
            var self = this
            this.length++
            this.main.push(seriesData)
            if(self.length == num){
                this.$nextTick(()=>{
                    Option.series = self.main
                    lastOption = self.main
                    self.loading = false
                    self.chunkSeries(0,10)
                })
            }
        },
        drawLine(){
            var self = this
            var tooltipInner = []
            var color = ''
            // charts = this.$echarts.init(this.$refs.aaa,null,{renderer: 'svg'}) 中文乱码
            charts = this.$echarts.init(this.$refs.aaa) 
            for (let index = 1; index < 11; index++) {
                echartsAll['echarts' + index] = self.$echarts.init(self.$refs[index]) 
                echartsAll['echarts' + index].on('click',this.handClick);
            }
            charts.on('click',this.handClick)
            Option.color = this.rungrapData.colors
            Option.tooltip.formatter = function(params, ticket, callback){
                tooltipInner = []
                for(var x in params){
                    if(params[x].value != '-'){
                        color = params[x].color == self.rungrapData.colors[1] ? self.rungrapData.colors[0] : self.rungrapData.colors[1]
                        if(typeof(params[x].value) == "number"){
                            tooltipInner += '<span style="border-radius:3px;background:' + params[x].color + '">车次号：' + params[x].seriesName + "-" + self.getSiteName(Number(params[x].value)) + "-" + params[x].name + "</br>" + '</span>'
                        }else{
                            if(params[x].value != undefined){
                                tooltipInner += '<span style="border-radius:3px;background:' + params[x].color + '">车次号：' + params[x].seriesName + "-" + self.getSiteName(Number(params[x].value.substr(1))) + "-" + params[x].name + "</br>" + '</span>'
                            }                        }
                        self.clickData.time = params[x].axisValue
                    }
                }
                return tooltipInner
            }
            // Option.yAxis.axisLabel.formatter = function(value) {
            //     return self.getSiteName(value)
            // }

            Option.xAxis[0].data = this.time
            Option.xAxis[1].data = this.time

            Option.xAxis[0].axisLabel.formatter = function(value, index){
                if(value != undefined){
                    var num = parseInt(value.replace(/[\:]/g,""))
                    if(num  % 10000 == 0){
                        return '{bold|' + value.substr(0,5) + '}'
                    }else{
                        return value.substr(0,5)
                    }
                }
            }
            Option.xAxis[1].axisLabel.formatter = function(value, index){
                if(value != undefined){
                    var num = parseInt(value.replace(/[\:]/g,""))
                    if(num  % 10000 == 0){
                        return '{bold|' + value.substr(0,5) + '}'
                    }else{
                        return value.substr(0,5)
                    }
                }
            }
            Option.yAxis.axisLabel.interval = function(value,index) {
                if(index == ''){
                    return false
                }else{
                    return index
                }
            }
            Option.yAxis.axisLabel.formatter = function(value,index) {
                if(value != undefined){
                    return value
                }else{
                    return ''
                }
            }

            Option.xAxis[0].axisLabel.color = this.rungrapData.colors[0]
            Option.xAxis[1].axisLabel.color = this.rungrapData.colors[1]
            
            Option.yAxis.data = []//修复切换数据源后Y轴数据清空
            for (let index = 0; index < this.subStation[this.subStation.length - 1][1]; index++) {
                Option.yAxis.data[index] = ''
            }
            
            for (let index = 0; index < this.subStation.length; index++) {
                Option.yAxis.data[this.subStation[index][1]] = this.subStation[index][2]
            }

            switch (this.rungrapData.line) {
                case 0:
                    Option.yAxis.splitNumber = 3
                    Option.yAxis.interval = .2
                break;
                case 7:
                    // Option.yAxis.splitNumber = 28
                    // Option.yAxis.interval = .1
                break;
            }
            // charts.setOption(Option,true)
            self.oldW = document.body.clientWidth
        },
        handClick(params){
            
            // this.$parent.getRungrapClick(params)

            var mainData = JSON.parse(sessionStorage.rungrap)
            var pushData = {}

            for (let index = 0; index < mainData.length; index++) {
                for (let i = 0; i < mainData[index].tripList.length; i++) {
                    if(mainData[index].tripList[i].tripNo == params.data.label.name){
                        pushData = mainData[index].tripList[i]
                    }
                }
            }

            pushData.endStationId = this.subStation[pushData.endStationId - 1][2]
            pushData.startStationId = this.subStation[pushData.startStationId - 1][2]
            pushData.runDir = pushData.runDir == 170 ? '下行' : '上行'
            pushData.list = []

            for (let index = 0; index < pushData.pathListStr.length; index++) {
                var tmp = pushData.pathListStr[index].split(',')
                if(tmp[1] != 0){
                    pushData.list.push({
                        stationId : this.subStation[parseInt(tmp[0]) - 1][2],
                        arriveTime : secondToDate(tmp[1]),
                        departTime : secondToDate(tmp[2])
                    })
                }
            }

            this.$parent.getRungrapClick(pushData)

            return
            var data = charts.getOption().series[params.seriesIndex]
            this.clickData.seriesId = data.name
            this.clickData.name = this.getSiteName(params.data.coord[1],1)
            
            if(data.runDirect == 85){
                this.clickData.runDirect = '下行'
            }else{
                this.clickData.runDirect = '上行'
            }
            this.clickData.multiply = (params.data.lineStyle.multiply * 100).toFixed(3) + '%'
            this.dialogVisible = true
        },
        jump(to){
            console.log(to,this.clickData);
        },
        chunkSeries(start,end){
            chunkOption = []
            var self = this
            var tmp = 840
            _start = 0
            _end = tmp
            Option.xAxis[0].data = Time.slice(_start,_end)
            Option.xAxis[1].data = Time.slice(_start,_end)
            Option.yAxis.axisLabel.inside = false
            Option.yAxis.axisLabel.align = 'right'
            Option.yAxis.axisLabel.textStyle.color = '#000'
            Option.yAxis.axisLabel.margin = 8
            for (let index = 0; index < lastOption.length; index++) {
                if(lastOption[index].addself >= _start && lastOption[index].addself <= _end){
                    chunkOption.push(lastOption[index])
                }
            }
            Option.series = chunkOption
            console.log(Option);
            charts.setOption(Option,true)
            console.timeEnd()

            // return

            for (let index = 1; index < 11; index++) {
                tmp = 600
                chunkOption = []
                _start = index * 720 - 60
                _end = (index + 1) * 720 + 60                
                for (let index = 0; index < lastOption.length; index++) {
                    if(lastOption[index].addselfSecond >= _start && lastOption[index].addselfSecond <= _end){                                         
                        chunkOption.push(lastOption[index])
                    }else{
                        if(lastOption[index].addselfArrive >= _start && lastOption[index].addself < _start){
                            chunkOption.push(lastOption[index])
                        }
                    }
                }
                Option.xAxis[0].data = Time.slice(_start,_end)
                Option.xAxis[1].data = Time.slice(_start,_end)
                Option.yAxis.axisLabel.inside = true
                Option.yAxis.axisLabel.align = 'center'
                Option.yAxis.axisLabel.textStyle.color = '#ccc'
                Option.yAxis.axisLabel.margin = 0

                chunkOption = JSON.parse(JSON.stringify(chunkOption))

                for (let i = 0; i < chunkOption.length; i++) {
                    chunkOption[i].addself -= _start
                    chunkOption[i].addselfArrive -= _start
                    chunkOption[i].addselfEnd -= _start
                    chunkOption[i].addselfSecond -= _start
                    for (const key in chunkOption[i].data) {
                        if(chunkOption[i].data[key] != '-'){
                            chunkOption[i].data[key - _start] = chunkOption[i].data[key]
                            delete chunkOption[i].data[key]
                        }
                    }
                    chunkOption[i].data = chunkOption[i].data.slice(0,chunkOption[i].addselfEnd)
                    chunkOption[i].markLine.data.forEach(element => {
                        element.forEach(ele => {
                            if(ele.coord){
                                ele.coord[0] -= _start
                            }
                        });
                    });
                }
                // Option.series = chunkOption
                self.timeSet(index,chunkOption,Time.slice(_start,_end))
            }
            if(this.key){
                this.key = false
                setTimeout(()=>{
                    // self.drewPlan()
                },2000)
            }
        },
        timeSet(index,data,xData,xData1){
            setTimeout(()=>{
                Option.series = data
                Option.xAxis[0].data = xData
                Option.xAxis[1].data = xData
                echartsAll['echarts' + index].setOption(Option,true)
            },1000)
        },
        getSiteName(value,font){
            var texts = []
            var text = ''
            for (let index = 0; index < this.subStation.length; index++) {
                if(value == this.subStation[index][1]){
                    texts.push(this.subStation[index][2])
                    text = this.subStation[index][2]
                }
            }
            if(font){
                return text
            }else{
                return texts
            }
        },
        drewPlan(){
            var self = this
            this.loading = true
            this.length = 0
            setTimeout(()=>{
                self.initData(1)
            },500)
        }
    },
    beforeDestroy() {
        this.lock = false
        charts.clear()
        charts.dispose()
        charts = null;
        for (let index = 1; index < 11; index++) {
            echartsAll['echarts' + index].clear()
            echartsAll['echarts' + index].dispose()
            echartsAll['echarts' + index] = null
        }
        echartsAll = {
            echarts1:null,
            echarts2:null,
            echarts3:null,
            echarts4:null,
            echarts5:null,
            echarts6:null,
            echarts7:null,
            echarts8:null,
            echarts9:null,
            echarts10:null
        }
        Option.tooltip.formatter = {}
        Option.xAxis[0].axisLabel.formatter = {}
        Option.xAxis[1].axisLabel.formatter = {}
        Option.yAxis.axisLabel.interval = {}
        Option.yAxis.axisLabel.formatter = {}
        lastOption = null;
        chunkOption = [];
        _start = 0;
        _end = 0;
        t = null;
    },

}
</script>
<style>
.dashboard-containerr{height: 100%;width: 100%;position: relative;z-index: 99;}
.calcH{height: 100%;width: 1920px;position: relative;min-width: 800px;float: left;}
.move{margin-left: -341px;}
.move1{margin-right: -132px;}
.left{left: 100vw;}
.tooltip{position: fixed;top:70px;right:0;height: 50px;line-height: 50px;font-size: 12px;}
.tooltip span{padding:0 20px;position: relative;display: inline-block;}
.tooltip span::after{content: '';width: 15px;height: 2px;display: block;position: absolute;left: 0;top:50%;}
.tooltip .leave1::after{background: #05ff00;margin-top: -1px;}
.tooltip .leave2::after{background: #7fff00;margin-top: -2px;height: 4px;}
.tooltip .leave3::after{background: #ffc100;margin-top: -3px;height: 6px;}
.tooltip .leave4::after{background: #ff4200;margin-top: -4px;height: 8px;}
.tooltip .leave5::after{background: #ff0200;margin-top: -4px;height: 8px;}
.el-dialog ul li{line-height: 50px;font-size: 16px;font-weight: bold;}
.rungrap{padding: 20px 0 0 20px;height:40px}
.all{width: 100%;overflow-x: auto;height: 100%;position: relative;}
.all1{width: 17580px;height:100%;overflow: hidden;}
</style>