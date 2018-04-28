<template>
    <div class="extend-select">
        <card class="extend-select-item" v-for="(extendItem, idx) in data.profile" :key="extendItem.key" :closeable="data.profile.length > extendSize.min" @close="removeExtendItem(idx)">
            <feature-group :cache="optionCache" :data="extendItem"></feature-group>
        </card>
        <div class="add-group-btn" v-show="data.profile.length < extendSize.max">
            <div class="icon-add" @click="addExtendItem"><i class="el-icon-plus"></i></div>
        </div>
    </div>
</template>

<script>

import Card from '@/components/common/Card';
import FeatureGroup from './FeatureGroup';

export default {
    components: {
        Card,
        FeatureGroup
    },
    props: ['data'],
    data () {
        return {
            extendSize:{
                max: 3,
                min: 0
            },
            optionCache: {}
        };
    },
    created () {
        if(this.data.profile) {
            while(this.data.profile.length < this.extendSize.min) {
                this.addExtendItem();
            }
        }
    },
    methods: {
        removeExtendItem (idx) {
            this.data.profile.splice(idx, 1);
        },
        addExtendItem () {
            const extendItemList = this.data.profile;
            const len = extendItemList.length;
            if(len >= this.extendMax) {
                return;
            }
            const key = len ? extendItemList[len - 1].key + 1 : 1;
            extendItemList.push({
                key,
                featureList: []
            });
        }
    }
};
</script>

<style scoped lang="scss">
.extend-select {
    .extend-select-item:not(:first-child), .add-group-btn:not(:first-child) {
        margin-top: 10px;
    }
    .add-group-btn {
        overflow: hidden;
        border: 1px dashed #bfbfbf;
        color: #bfbfbf;
        background-color: #fff;
        cursor: pointer;
        &:hover {
            color: #777;
            border-color: #777;
        }
        .icon-add {
            text-align: center;
            line-height: 100px;
            transform: scale(2);
        }
    }
}
</style>
