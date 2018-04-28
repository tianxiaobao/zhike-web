<template>
    <div class="feature-group">
        <div class="feature-item" v-for="(feature, idx) in data.featureList" :key="feature.key">
            <div class="feature-operation">
                <div class="feature-btn" @click="removeFeature(idx)" v-show="data.featureList.length > featureSize.min"><i class="el-icon-minus"></i></div>
            </div>
            <consumer-feature :data="feature" :disable-list="selectedFeature" :cache="cache" class="feature-selecter"></consumer-feature>
        </div>
        <div class="add-item" v-show="data.featureList.length < featureSize.max">
            <div class="feature-operation">
                <div class="feature-btn" @click="addFeature"><i class="el-icon-plus"></i></div>
            </div>
        </div>
    </div>
</template>

<script>
import ConsumerFeature from './ConsumerFeature';
export default {
    components: {
        ConsumerFeature
    },
    props: ['data', 'cache', 'closeable'],
    data () {
        return {
            featureSize: {
                min: 1,
                max: 3
            }
        };
    },
    created () {
        if(this.data.featureList) {
            while(this.data.featureList.length < this.featureSize.min) {
                this.addFeature();
            }
        }
    },
    computed: {
        selectedFeature () {
            return this.data.featureList.map(feature => feature.type);
        }
    },
    methods: {
        addFeature () {
            const featureList = this.data.featureList;
            const len = featureList.length;
            if (len >= this.featureSize.max) {
                return;
            }
            const key = len ? featureList[len - 1].key + 1 : 1;
            featureList.push({
                key,
                type: '',
                values: []
            });
        },
        removeFeature (idx) {
            const featureList = this.data.featureList;
            if (featureList.length <= this.featureSize.min) {
                return;
            }
            featureList.splice(idx, 1);
        },
        close () {
            if(this.closeable) {
                this.$emit('close');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.feature-group {
    .feature-item:not(:last-of-type), .add-item {
        margin-bottom: 20px;
        display: flex;
        .feature-selecter {
            margin-left: 20px;
            flex-grow: 1;
        }
        .feature-operation {
            height: 22px;
            width: 22px;
            padding: 5px;
            flex-shrink: 0;
        }
        .feature-btn {
            line-height: 20px;
            height: 20px;
            width: 20px;
            text-align: center;
            color: #bfbfbf;
            border: 1px dashed #bfbfbf;
            border-radius: 15px;
            cursor: pointer;
            &:hover {
                color: #777;
                border: 1px dashed #777;
            }
        }
    }
}
</style>
