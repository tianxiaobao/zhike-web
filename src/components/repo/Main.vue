<template>
    <div class="repo">
        <title-bar title="分析报告">
            <div class="bar-options">
                <el-button type="default" @click="onBack">返回</el-button>
            </div>
        </title-bar>
        <div class="repo-content">
            <div class="repo-location">
                <i></i>
                <dl>
                    <dt>商圈位置：</dt>
                    <dd>{{ address }}</dd>
                </dl>
            </div>
            <div class="repo-overview-container">
                <div class="repo-overview">
                    <div class="repo-overview--inner">
                        <div class="repo-overview--icon">
                            <img src="./images/xz_4.png">
                        </div>
                        <div class="repo-overview--info">
                            <h2>竞争对手
                                <span>（{{ mainData && mainData.distance }}公里范围内）</span>
                            </h2>
                            <div class="repo-overview--val">{{ mainData && mainData.competitorNum }}
                                <span>家</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="repo-overview">
                    <div class="repo-overview--inner">
                        <div class="repo-overview--icon">
                            <img src="./images/xz_5.png">
                        </div>
                        <div class="repo-overview--info">
                            <h2>停车场
                                <span>（{{ mainData && mainData.distance }}公里范围内）</span>
                            </h2>
                            <div class="repo-overview--val">{{ mainData && mainData.parkingNum }}
                                <span>个</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="repo-analyze">
                <div class="repo-analyze--tab">
                    <ul>
                        <li :class="{'hover': currentView == 'competor'}" @click="setTab('competor')">
                            <p>竞争对手分析</p>
                        </li>
                        <li :class="{'hover': currentView == 'consumer'}" @click="setTab('consumer')">
                            <p>消费人群分析</p>
                        </li>
                        <li :class="{'hover': currentView == 'buy'}" @click="setTab('buy')">
                            <p>购物特征分析</p>
                        </li>
                    </ul>
                </div>
                <div class="repo-analyze--result">
                    <component v-bind:is="currentView" :id="repoId" :distance="mainData && mainData.distance" :lat="mainData && mainData.lat" :lng="mainData && mainData.lng"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TitleBar from '../common/TitleBar';
import Competor from './Competor';
import Consumer from './Consumer';
import Buy from './Buy';

import { getMainInfo } from '@/apis/regionAnalysis';
import AjaxClient from '@/utils/ajaxClient.js';

export default {
    created () {
        const region = this.$route.params.region.replace(/-/g, '%');;
        const strArr = (unescape(region) || ',').split(',');
        this.repoId = Number(strArr[0]);
        this.address = strArr[1] || '未知';
        this.token = AjaxClient.createCancleToken();
        this.queryData();
    },
    beforeDestroy () {
        this.token && this.token.cancel();
    },
    data () {
        return {
            currentView: 'competor',
            mainData: '',
            token: null
        };
    },
    components: {
        'competor': Competor,
        'consumer': Consumer,
        'buy': Buy,
        'title-bar': TitleBar
    },
    methods: {
        queryData () {
            if(!this.repoId) {
                this.$message({
                    type: 'error',
                    message: '获取商圈数据失败: 无效商圈信息'
                });
                return;
            }
            getMainInfo({
                path: [this.repoId],
                cancelToken: this.cancel
            }).then(jsonObj => {
                this.mainData = jsonObj.message.RegionAnalysisMainInfoResult;
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取商圈数据失败: ' + err.message
                    });
                }
            });
        },
        setTab (viewParam) {
            this.currentView = viewParam;
        },
        onBack () {
            global.history.back();
        }
    }
};
</script>
<style lang="scss">
.repo .title-bar {
    .bar-options {
        float: right;
        .el-button.el-button--default {
            transform: translateY(-2px);
        }
    }
    h1 {
        float: left;
    }
}
.repo-content {
    margin: 0 30px;
}

.repo-content img {
    vertical-align: middle;
}

.repo-location {
    margin-bottom: 30px;
    padding: 30px 0 10px 0;
    border-bottom: 2px solid #dce1e7;
    & i {
        background: url(./images/xz_3.png) no-repeat;
        float: left;
        width: 28px;
        height: 50px;
    }
    & dl {
        margin-left: 35px;
        line-height: 30px;
    }
    & dt {
        font-size: 18px;
        color: #4c5e70;
    }
    & dd {
        font-size: 16px;
        color: #7b8da0;
    }
}

.repo-overview-container {
    overflow: hidden;
    margin-bottom: 30px;
}

.repo-overview {
    float: left;
    width: calc(50% - 15px);
    border-radius: 5px;
    background: #fff;
    padding: 36px 0;
    text-align: center;
    &:nth-of-type(odd) {
        margin-right: 15px;
    }
    &:nth-of-type(even) {
        margin-left: 15px;
    }
}

.repo-overview--inner {
    display: inline-block;
    transform: translate(0, 2px);
}

.repo-overview--icon {
    float: left;
    padding-right: 50px;
    border-right: 1px solid #ebebeb;
}

.repo-overview--info {
    float: left;
    padding: 0 50px;
    text-align: left;
    line-height: 1.5em;
    & h2 {
        color: #4c5e70;
        font-size: 18px;
    }
    & h2 span {
        color: #999;
        font-size: 12px;
    }
}

.repo-overview--val {
    font-size: 42px;
    color: #1276e5;
    margin-top: 40px;
    & span {
        font-size: 18px;
    }
}

.repo-analyze {
    margin-bottom: 30px;
}

.repo-analyze--tab {
    overflow: hidden;
    background: #fff;
    height: 40px;
    line-height: 40px;
    border-bottom: 6px solid #1276e5;
    border-radius: 5px 5px 0 0;
    & li {
        float: left;
        padding: 0 20px;
        cursor: pointer;
        color: #1276e5;
        font-size: 16px;
    }
    & li>p {
        font-size: 16px;
        line-height: inherit;
    }
    & li.hover {
        background: #1276e5;
        color: #fff;
        border-radius: 5px 5px 0 0;
    }
}

.repo-analyze--result {
    background-color: #fff;
    border: 1px solid #f0f1f1;
    padding: 30px 30px 0 30px;
    overflow: hidden;
}
</style>
