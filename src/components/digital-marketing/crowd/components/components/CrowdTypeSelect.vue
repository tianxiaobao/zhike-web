<template>
<div>
    <div class="create-way">
        <div class="item">
            <div class="button" v-for="(item, i) in typeOptions" :key="i"
                 :class="[i == clickIdx ? colorArr[i].click: colorArr[i].normal]"
                 @click="chooseType(i)" v-if="hasAuth[i]">
                {{item.label}}
            </div>
        </div>
    </div>
    <!-- <el-select v-model="innerType" @input="onInput">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select> -->
    <div class = "t-center">
        <el-button @click="onPrev" type = "primary">{{ prevText }}</el-button>
        <el-button @click="onNext" type = "primary">{{ nextText }}</el-button>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { sourceMapping, defaultSourceFilter,colorArr } from '../../config';
import * as ahthTypes from '@/pages/index/auth_types.js';
export default {
    props: ['value', 'step'],
    data () {
        const typeOptions = Object.keys(sourceMapping).filter(key => key !== defaultSourceFilter).map(key => ({ label: sourceMapping[key], value: key }));
        return {
            innerType: '',
            typeOptions,
            clickIdx: 0,
            colorArr: colorArr
        };
    },
    watch: {
        value: {
            immediate: true,
            handler (val) {
                this.innerType = val;
                this.clickIdx = this.typeOptions.findIndex(type => type.value === val);
                if(this.clickIdx < 0) this.clickIdx = 0;
            }
        }
    },
    computed: {
        ...mapGetters([
            'authsButton'
        ]),
        prevText () {
            return this.step === 'begin' ? '取消' : '上一步';
        },
        nextText () {
            return this.step === 'end' ? '完成' : '下一步';
        },
        hasAuth () {
            const authArr = [];
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_CUSTOMERPROFILEPACKAGE)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_CUSTOMIZEPROFILEPACKAGE)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_PACKAGEJD)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_LOCALPROFILEPACKAGE)>=0);
            return authArr;
        }
    },
    methods: {
        onInput (val) {
            this.$emit('input', val);
        },
        onPrev () {
            this.$emit('prev');
        },
        onNext () {
            this.$emit('next');
        },
        chooseType (idx) {
            this.clickIdx = idx;
            this.innerType = this.typeOptions[idx].value;
            this.onInput(this.innerType);
        }
    }
};
</script>

<style lang="scss" scoped>
$color0: #409EFF;
$color1: #67C23A;
$color2: #E6A23C;
$color3: #F56C6C;
    .create-way{
        width: 60%;
        margin: 20px auto;
        .item{
            width:100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            .button{
                margin: 2%;
                width: 46%;
                height: 100px;
                box-sizing: border-box;
                font-size: 32px;
                text-align: center;
                line-height: 100px;
            }
            .button:hover{
                cursor: pointer;
            }
        }
    }
    .t-center{
        width: 100%;
        text-align:center;
        & .el-button{
            min-width: 118px;
        }
    }
    .color0{
        border: 1px solid $color0;
        color: $color0;
    }
    .colorcheck0{
        border: 0;
        background: $color0;
        color: #fff;
    }
    .color1{
        border: 1px solid $color1;
        color: $color1;
    }
    .colorcheck1{
        border: 0;
        background: $color1;
        color: #fff;
    }
    .color2{
        border: 1px solid $color2;
        color: $color2;
    }
    .colorcheck2{
        border: 0;
        background: $color2;
        color: #fff;
    }
    .color3{
        border: 1px solid $color3;
        color: $color3;
    }
    .colorcheck3{
        border: 0;
        background: $color3;
        color: #fff;
    }
</style>

