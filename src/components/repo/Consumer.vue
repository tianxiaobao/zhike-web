<template>
    <div class="consumer">
        <div class="consumer-analyze">
            <div class="pie-container">
                <chart-container>
                    <span slot="header" class="consumer-analyze--title">年龄分析</span>
                    <pie-chart :data="agePieData"></pie-chart>
                </chart-container>
            </div>
            <div class="table-container">
                <default-table-chart :data="ageTableData" class="consumer-analyze--table"></default-table-chart>
            </div>
        </div>
        <div class="consumer-analyze">
            <div class="pie-container">
                <chart-container>
                    <span slot="header" class="consumer-analyze--title">性别分析</span>
                    <pie-chart :data="sexPieData"></pie-chart>
                </chart-container>
            </div>
            <div class="table-container">
                <default-table-chart :data="sexTableData" class="consumer-analyze--table"></default-table-chart>
            </div>
        </div>
        <div class="consumer-analyze">
            <div class="pie-container">
                <chart-container>
                    <span slot="header" class="consumer-analyze--title">婚姻分析</span>
                    <pie-chart :data="marryPieData"></pie-chart>
                </chart-container>
            </div>
            <div class="table-container">
                <default-table-chart :data="marryTableData" class="consumer-analyze--table"></default-table-chart>
            </div>
        </div>
        <div class="consumer-analyze">
            <div class="pie-container">
                <chart-container>
                    <span slot="header" class="consumer-analyze--title">职业分析</span>
                    <default-hog-chart :data="careerHogData"></default-hog-chart>
                </chart-container>
            </div>
            <div class="table-container">
                <default-table-chart :data="careerTableData" class="consumer-analyze--table"></default-table-chart>
            </div>
        </div>
        <div class="consumer-analyze">
            <div class="pie-container">
                <chart-container>
                    <span slot="header" class="consumer-analyze--title">购买力分析</span>
                    <pie-chart :data="buyPieData"></pie-chart>
                </chart-container>
            </div>
            <div class="table-container">
                <default-table-chart :data="buyTableData" class="consumer-analyze--table"></default-table-chart>
            </div>
        </div>
    </div>
</template>
<script>
import PieChart from '@/components/charts/PieChart';
import DefaultTableChart from '@/components/charts/DefaultTableChart';
import DefaultHogChart from '../charts/DefaultHogChart';
import ChartContainer from '@/components/common/ChartContainer';
import { getFeatureRate } from '@/apis/regionAnalysis';
import AjaxClient from '@/utils/ajaxClient.js';

export default {
    components: {
        PieChart,
        DefaultHogChart,
        DefaultTableChart,
        ChartContainer
    },
    props: ['id'],
    data () {
        return {
            token: null,
            agePieData: {
                name: '',
                series: []
            },
            ageTableData: {
                labels: [
                    { text: '年龄', name: 'name' },
                    { text: '占比', name: 'value', type: 'val' }
                ],
                series: []
            },
            sexPieData: {
                name: '',
                series: []
            },
            sexTableData: {
                labels: [
                    { text: '性别', name: 'name' },
                    { text: '占比', name: 'value', type: 'val' }
                ],
                series: []
            },
            marryPieData: {
                name: '',
                series: []
            },
            marryTableData: {
                labels: [
                    { text: '婚姻', name: 'name' },
                    { text: '占比', name: 'value', type: 'val' }
                ],
                series: []
            },
            careerHogData: {
                series: []
            },
            careerTableData: {
                labels: [
                    { text: '职业', name: 'name' },
                    { text: '占比', name: 'value', type: 'val' }
                ],
                series: []
            },
            buyPieData: {
                name: '',
                series: []
            },
            buyTableData: {
                labels: [
                    { text: '购买力', name: 'name' },
                    { text: '占比', name: 'value', type: 'val' }
                ],
                series: []
            }
        };
    },
    created () {
        this.token = AjaxClient.createCancleToken();
        this.initData();
    },
    beforeDestroy () {
        this.token && this.token.cancel();
    },
    methods: {
        adaptPie (data) {
            const valueList = data.dataSerials[0].cells;
            const series = data.nameSerial.cells.map((name, i) => {
                return {
                    name: name,
                    value: valueList[i]
                };
            }).filter(s => s.value);
            return {
                name: data.nameSerial.name,
                series: series
            };
        },
        adaptTable (data) {
            const valueList = data.dataSerials[0].cells;
            const series = data.nameSerial.cells.map((name, i) => {
                return {
                    name: name,
                    value: valueList[i] + '%'
                };
            });
            return {
                labels: [
                    { text: data.nameSerial.name, name: 'name' },
                    { text: data.dataSerials[0].name, name: 'value', type: 'val' }
                ],
                series: series
            };
        },
        adaptHog (data) {
            const valueList = data.dataSerials[0].cells;
            const series = data.nameSerial.cells.map((name, i) => {
                return {
                    name: name,
                    value: valueList[i]
                };
            });
            return {
                tooltip: {
                    formatter (params) {
                        return `${params[0].name}
                                </br>
                                ${params[0].marker}
                                ${params[0].value}%`;
                    }
                },
                series
            };
        },
        queryAgeData () {
            getFeatureRate({
                path: [this.id, 'age'],
                cancelToken: this.token
            }).then(dataObj => {
                this.agePieData = this.adaptPie(dataObj.message.DataResult);
                this.ageTableData = this.adaptTable(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取年龄数据失败: ' + err.message
                    });
                }
            });
        },
        querySexData () {
            getFeatureRate({
                path: [this.id, 'sex'],
                cancelToken: this.token
            }).then(dataObj => {
                this.sexPieData = this.adaptPie(dataObj.message.DataResult);
                this.sexTableData = this.adaptTable(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取性别数据失败: ' + err.message
                    });
                }
            });
        },
        queryMerryData () {
            getFeatureRate({
                path: [this.id, 'marrage'],
                cancelToken: this.token
            }).then(dataObj => {
                this.marryPieData = this.adaptPie(dataObj.message.DataResult);
                this.marryTableData = this.adaptTable(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取婚姻数据失败: ' + err.message
                    });
                }
            });
        },
        queryCareerData () {
            getFeatureRate({
                path: [this.id, 'profession'],
                cancelToken: this.token
            }).then(dataObj => {
                this.careerHogData = this.adaptHog(dataObj.message.DataResult);
                this.careerTableData = this.adaptTable(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取职业数据失败: ' + err.message
                    });
                }
            });
        },
        queryBuyData () {
            getFeatureRate({
                path: [this.id, 'purchpower'],
                cancelToken: this.token
            }).then(dataObj => {
                this.buyPieData = this.adaptPie(dataObj.message.DataResult);
                this.buyTableData = this.adaptTable(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取购买力数据失败: ' + err.message
                    });
                }
            });
        },
        initData () {
            this.queryAgeData();
            this.querySexData();
            this.queryMerryData();
            this.queryCareerData();
            this.queryBuyData();
        }
    }
};
</script>

<style>
.consumer-analyze {
    margin-bottom: 30px;
    & .pie-container {
        float: left;
        margin-right: 30px;
        width: calc(65% - 30px);
    }
    & .table-container {
        float: right;
        width: 35%;
    }
    &::after{
        content: '';
        display: block;
        height: 0;
        clear: both;
    }
}

.consumer-analyze--title {
    font-weight: bold;
    font-size: 14px;
}

.consumer-analyze--table .el-table td,.consumer-analyze--table .el-table th {
    height: 35px;
}
</style>
