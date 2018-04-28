<template>
    <div class="finish">
        <div class="finish-info">
            <el-progress type="circle" :width="80" :percentage="100" status="success"></el-progress>
            <div class="info-text">
                人群包创建完成，请点击“完成”按钮进入人群包列表页查看创建进度
            </div>
        </div>
        <div class = "t-center">
            <el-button type = "primary" @click="onFinish">完成</el-button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        onFinish () {
            this.$emit('next');
        }
    }
};
</script>

<style lang="scss" scoped>
.t-center{
    width: 100%;
    text-align:center;
    & .el-button{
        padding: 10px 40px;
    }
}
.finish {
    text-align: center;
    .finish-info {
        border: 1px dashed rgb(19, 206, 102);
        border-radius: 10px;
        padding: 50px;
        margin: 20px;
        display: inline-flex;
        .info-text {
            padding: 0 10px;
            line-height: 80px;
        } 
    }
}

</style>

