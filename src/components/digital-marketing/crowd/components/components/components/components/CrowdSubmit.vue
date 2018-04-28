<template>
    <div class="submit-crowd" :class="{ shrink: shrink }">
        <div class="resize-btn expand" @click="shrink = !shrink"><i class="icon">&#xe64e;</i></div>
        <div class="content">
            <div class="resize-btn" @click="shrink = !shrink"><i class="icon">&#xe64f;</i></div>
            <div class="name">已选人群数</div>
            <div class="value">{{ number }}</div>
        </div>    
    </div>
</template>

<script>
export default {
    props: ['number'],
    data () {
        return {
            shrink: false
        };
    }
};
</script>

<style lang="scss" scoped>
.submit-crowd {
    position: relative;
    transition: all .2s ease-out;
    width: 174px;
    height: 136px;
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
        width: 174px;
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
    .name, .value {
        text-align: center;
        line-height: 2;
    }
    .value {
        font-size: 26px;
        color: #06AEF1;
    }
}
</style>
