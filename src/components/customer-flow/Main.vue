<template>
    <div class="customer-flow">
        <div class="content">
            <el-row>
                <el-col :span="24">
                    <div class="card-grid">
                        <overview></overview>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="card-grid">
                        <trend :floorOptions="floorData"></trend>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="card-grid">
                        <customer :floorOptions="floorData"></customer>
                    </div>
                </el-col>
                <el-col :span="retentionColWidth">
                    <div class="card-grid">
                        <retention @change="onTimeChange"></retention>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="card-grid">
                        <new-customer-rate></new-customer-rate>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="card-grid">
                        <floor-customer-rate></floor-customer-rate>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="card-grid">
                        <customer-contribution></customer-contribution>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Overview from './components/Overview';
import Trend from './components/Trend';
import Customer from './components/CustomerNumber';
import Retention from './components/Retention';
import NewCustomerRate from './components/NewCustomerRate';
import FloorCustomerRate from './components/FloorCustomerRate';
import CustomerContribution from './components/CustomerContribution';

import { getFloorList } from '@/apis/floor.js';
import AjaxClient from '@/utils/ajaxClient.js';

import { mapGetters } from 'vuex';

export default {
    components: {
        Overview,
        Trend,
        Customer,
        Retention,
        NewCustomerRate,
        FloorCustomerRate,
        CustomerContribution
    },
    beforeDestroy () {
        this.init();
    },
    data () {
        return {
            retentionColWidth: 12,
            floorData: [],
            token: null
        };
    },
    watch: {
        currentMall: {
            immediate: true,
            handler (val) {
                this.init();
                if(val) {
                    this.queryData();
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'currentMall'
        ])
    },
    methods: {
        init () {
            if(this.token) {
                this.token.cancel();
                this.token = null;
            }
            this.floorData = [];
        },
        onTimeChange (isMoreThan7) {
            this.retentionColWidth = isMoreThan7 ? 24 : 12;
        },
        queryData () {
            this.token = AjaxClient.createCancleToken();
            getFloorList({
                path: [this.currentMall.id],
                cancelToken: this.token
            }).then(dataObj => {
                this.floorData = dataObj.message.list;
                this.token = null;
            }).catch(err => {
                this.handleQueryError(err);
            });
        },
        handleQueryError (err) {
            if(AjaxClient.isCancel(err)) {
                return;
            }
            if(err.message) {
                this.$message({
                    type: 'error',
                    message: '获取楼层数据失败: ' + err.message
                });
            }
        }
    }
};
</script>
<style>
.customer-flow {
    min-width: 1130px;
    & .content {
        padding: 10px;
    }
    & .card-grid {
        background-color: #fff;
        margin: 10px;
    }
}
</style>
