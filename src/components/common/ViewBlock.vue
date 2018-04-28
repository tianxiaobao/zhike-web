<template>
<div class="view-block">
    <slot name="icon"></slot>
    <div class="view-right">
        <p><slot name="value"></slot></p>
        <p><slot name="sub"></slot></p>
        <slot name="upDown"></slot>
    </div>
</div>
</template>
<style scoped lang="scss">
.view-block{
    width: 24%;
    height: 80px;
    background-color: #8788ca;
    box-sizing: border-box;
    padding: 15px 20px;
    & img{
        height: 50px;
    }
    &:nth-child(2){
        background-color: #00beba;
    }
    &:nth-child(3){
        background-color: #00aed3;
    }
    &:nth-child(4){
        background-color: #c482e6;
    }
    & .view-right{
        float: right;
        color: #fff;
        text-align: right;
        & p:nth-child(1){
            font-size: 16px;
        }
        & p{
            line-height: 1.2;
        }
        & img{
            height: 18px;
            vertical-align: middle;
            margin-top: -3px;
        }
    }
}
</style>