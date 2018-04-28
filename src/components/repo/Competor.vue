<template>
    <div class="competor">
        <div class="competor-overview-area">
            <div class="map-container">
                <marked-map-chart ref="markedMap" class="competor-overview--map" :data="competorList" :distance="distance" :center="center" v-if="center"></marked-map-chart>
                <!-- <marked-map-chart ref="markedMap" class="competor-overview--map" :data="tableData.series" :distance="distance" :center="center" v-if="center"></marked-map-chart> -->
            </div>
            <div class="pie-container">
                <chart-container>
                    <span slot="header" class="competor-overview--pietitle">竞争对手分布</span>
                    <pie-chart :data="pieData" class="competor-overview--pie"></pie-chart>
                </chart-container>
            </div>
        </div>
        <div class="competor-detail-area">
            <table-container>
                <default-table-chart :data="tableData" v-on:row-click="handleRowClick"></default-table-chart>
                <div slot="footer">
                    <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="pageSizeConfig" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="competorList.length" v-show="competorList.length">
                    </el-pagination>
                </div>
            </table-container>
        </div>
    </div>
</template>
<script>
import TableContainer from '../common/TableContainer';
import MarkedMapChart from '@/components/charts/MarkedMapChart';
import PieChart from '@/components/charts/PieChart';
import DefaultTableChart from '@/components/charts/DefaultTableChart';
import ChartContainer from '@/components/common/ChartContainer';
import { getCompetorList } from '@/apis/regionAnalysis';
import AjaxClient from '@/utils/ajaxClient.js';

const pageSizeConfig = [10, 30, 50];

export default {
    components: {
        MarkedMapChart,
        PieChart,
        ChartContainer,
        DefaultTableChart,
        TableContainer
    },
    props: ['id', 'distance', 'lng', 'lat'],
    data () {
        return {
            competorList: [],
            currentPage: 1,
            pageSize: pageSizeConfig[0],
            pageSizeConfig: pageSizeConfig,
            token: null
        };
    },
    created () {
        this.token = AjaxClient.createCancleToken();
        this.queryData();
    },
    beforeDestroy () {
        this.token && this.token.cancel();
    },
    methods: {
        queryData () {
            getCompetorList({
                path: [this.id],
                cancelToken: this.token
            }).then(jsonObj => {
                this.competorList = jsonObj.message.list;
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取竞争对手数据失败: ' + err.message
                    });
                }
            });
        },
        handleRowClick (row) {
            const data = Object.assign({}, row);
            data.distance = row.distance.replace('米', '');
            this.$refs.markedMap.showInfoWindow(data);
            this.$refs.markedMap.scrollToMe();
        },
        onCurrentChange (pageNo) {
            this.currentPage = pageNo;
        },
        onSizeChange (pageSize) {
            this.currentPage = 1;
            this.pageSize = pageSize;
        }
    },
    computed: {
        pieData () {
            const distance = this.distance;
            const competorList = this.competorList;
            const pieData = {
                name: '竞争对手分布',
                series: []
            };
            if (distance & distance >= 1) {
                const series = [
                    {
                        name: '0.5公里以内',
                        value: 0
                    }, {
                        name: '0.5-1公里',
                        value: 0
                    }
                ];
                for (let i = 1; i < distance; ++i) {
                    series.push({
                        name: `${i}-${i + 1}公里`,
                        value: 0
                    });
                }
                competorList.forEach(row => {
                    const rowDis = row.distance / 1000;
                    if(rowDis < 1) {
                        ++series[rowDis < 0.5 ? 0 : 1].value;
                    } else if(rowDis < distance) {
                        ++series[Math.floor(rowDis + 1e-8) + 1].value;
                    } else {
                        ++series[series.length - 1].value;
                    }
                });
                pieData.series = series.filter(s => s.value);
            }
            return pieData;
        },
        tableData () {
            const competorList = this.competorList;
            const tableData = {
                labels: [
                    { text: '竞争对手名称', name: 'name', minWidth: '200' },
                    { text: '地址', name: 'address', minWidth: '350' },
                    { text: '距离', name: 'distance', type: 'val', minWidth: '100' }
                ]
            };
            const tableSeries = [];
            competorList.forEach(row => {
                tableSeries.push({
                    name: row.name,
                    address: row.address,
                    distance: row.distance + '米',
                    lat: row.lat,
                    lng: row.lng
                });
            });
            const pageSize = this.pageSize;
            const currentPage = this.currentPage;
            const l = (currentPage - 1) * pageSize;
            const r = l + pageSize;
            tableData.series = tableSeries.slice(l, r);
            return tableData;
        },
        center () {
            const lng = this.lng,
                lat = this.lat;
            if(lng !== '' && lat !== '') {
                return {
                    lng,
                    lat
                };
            }
            return null;
        }
    }
};
</script>

<style>
.competor-overview-area {
    margin-bottom: 30px;
    & .map-container {
        float: left;
        margin-right: 30px;
        width: calc(68% - 30px);
        height: 318px;
    }
    & .pie-container {
        float: right;
        width: 32%;
    }
    & .chart-container .c-body {
        padding: 0;
    }
    &::after {
        content: '';
        display: block;
        height: 0;
        clear: both;
    }
}

.competor-detail-area {
    margin-bottom: 30px;
    & .table-container .t-header {
        display: none;
    }
}

.competor-overview--pietitle {
    font-weight: bold;
    font-size: 14px;
}

.competor-overview--pie.pie-chart {
    height: 280px;
}
</style>
