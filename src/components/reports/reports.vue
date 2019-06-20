<template>
    <el-card>
        <my-bread level1="数据统计" level2="数据报表"></my-bread>
        <div id="myEchart"></div>
    </el-card>
</template>
<script>
    // var myEchart = require('echarts')
    var echarts = require('echarts')
    export default {
        data() {
            return {

            }
        },
        mounted() {
            this.initEcharts()
        },
        methods: {
            async initEcharts() {
                //初始化  因为牵扯到 用到DOM结构 所以要在mounted里进行调用
                var myEchart = echarts.init(document.getElementById('myEchart'));
                const res = await this.$http.get(`reports/type/1`)
                console.log(res, 222)
                const { data, meta: { msg, status } } = res.data
                if (status === 200) {
                    this.$message.success(msg)
                    let option2 = data
                    // 静态定死的图表数据
                    let option1 = {
                        title: {
                            text: '堆叠区域图'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                    }
                    /* option 来源于两部分 静态参数来源于文档 动态参数来源于请求接口 */
                    let option = { ...option1, ...option2 }
                    myEchart.setOption(option)
                }

            }
        }
    }
</script>
<style>
    #myEchart {
        margin-top: 20px;
        width: 600px;
        height: 400px;
    }
</style>