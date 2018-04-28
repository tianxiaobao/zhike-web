<style scoped lang="scss" type="text/scss">
    @mixin normal-flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @mixin normal-transition {
        transition: all .2s;
    }

    .step-bar-container{
        heigt: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 0 16px;
        background-color: #eee;
        /*border: 1px solid #ccc;*/
        font-size: 20px;
        border-radius: 2px;

        .step-item{
            display: flex;
            height: 100%;
            display: flex;
            align-items: center;
            @include normal-transition;
            color: #aaa;

            &.active{
                color: #2165c0 !important;
            }
        }

        .divider-icon{
            margin: 0 20px !important;
            color: #aaa;
        }

        .icon{
            margin-right: 8px;
        }

        span{
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
        }
    }
</style>

<template>
    <div class="step-bar-container">
        <div class="step-item"
             :class="{'active': step === 0}"
        >
            <i class="icon">&#xe62b;</i>
            <span>选择导入分组</span>
        </div>
        <i class="icon divider-icon">&#xe64c;</i>

        <div class="step-item"
             :class="{'active': step === 1}"
        >
            <i class="icon">&#xe610;</i>
            <span>上传用户照片</span>
        </div>
        <i class="icon divider-icon">&#xe64c;</i>

        <div class="step-item"
             :class="{'active': step === 2}"
        >
            <i class="icon">&#xe612;</i>
            <span>填写文本信息</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            step: {
                default: -1
            }
        },
        data () {
            return {
            };
        }
    };
</script>