<template>
    <div class="submit-crowd" :class="{ shrink: shrink }">
        <div class="resize-btn expand" @click="shrink = !shrink"><i class="icon">&#xe64e;</i></div>
        <div class="content">
            <div class="resize-btn" @click="shrink = !shrink"><i class="icon">&#xe64f;</i></div>
            <div class="name">已选人群数</div>
            <div class="value">{{ crowdNumber }}</div>
            <div class="operation">
                <el-button type="primary" :disabled="!creatable" @click="onCreatePackage">创建人群包</el-button>
                <div class="message" :class="{ error: !loading }" :title="msg"><span>{{ msg }}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
import { getEstimateNumber } from '@/apis/filter.js';
import AjaxClient from '@/utils/ajaxClient.js';
import { stringToBase64, debounce } from '@/utils';
export default {
    props: ['crowdData'],
    data () {
        return {
            shrink: false,
            token: null,
            crowdNumber: '0',
            msg: '',
            creatable: false,
            loading: false
        };
    },
    watch: {
        crowdData: {
            immediate: true,
            handler (data) {
                this.token && this.token.cancel();
                this.crowdNumber = '--';
                this.creatable = false;
                if(!this._query) {
                    this._query = debounce(data => {
                        if(this.validate(data)) {
                            this.msg = '查询中...';
                            this.queryCrowdNumber(data);
                        }
                    }, 300);
                }
                this._query(data);
            }
        }
    },
    methods: {
        validate (data) {
            return data.behavior.detailList.every(detail => detail.skuValidated);
        },
        queryCrowdNumber (data) {
            const token = this.token = AjaxClient.createCancleToken();
            const cond = process.env.NODE_ENV !== 'production' ? JSON.stringify(data) : stringToBase64(JSON.stringify(data));
            this.loading = true;
            getEstimateNumber({
                params: {
                    cond
                },
                cancelToken: token
            }).then(data => {
                this.token = null;
                const {status, num, msg} = data.message.EstimateNum;
                this.creatable = status;
                this.crowdNumber = num;
                this.msg = msg;
                this.loading = false;
            }).catch(err => {
                this.token = null;
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取已选人群数失败: ' + err.message
                    });
                }
                this.msg = '查询失败';
                this.loading = false;
            });
        },
        onCreatePackage () {
            this.$emit('create');
        }
    }
};
</script>

<style lang="scss" scoped>
.submit-crowd {
    position: relative;
    transition: all .2s ease-out;
    width: 204px;
    height: 172px;
    overflow: hidden;
    .resize-btn {
        user-select: none;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        vertical-align: middle;
        position: absolute;
        left: 0;
        top: 0;
        color: #bfbfbf;
        &:hover {
            color: #777;
        }
        cursor: pointer;
    }
    .content {
        padding: 26px 0;
        width: 204px;
    }
    .expand {
        display: none;
    }
    &.shrink {
        width: 30px;
        height: 30px;
        .expand {
            display: block;
        }
        .content {
            visibility: hidden;
        }
    }
    background-color: #fff;
    background-clip: padding-box;
    border: 1px dashed #ecdfdf;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    .name, .value, .operation {
        text-align: center;
        line-height: 2;
    }
    .value {
        font-size: 26px;
        color: #06AEF1;
    }
    .message {
        padding: 0 15px;
        font-size: 12px;
        text-align: center;
        overflow: hidden;
        height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.error {
            color: red;
        }
    }
}
</style>
