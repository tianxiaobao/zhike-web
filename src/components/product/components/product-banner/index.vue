<style>
    .root .product-abox a:hover{
    color: #fff;
}
.product-banner{
    height: 500px;
    & .word{
        float: left;
        width: 480px;
        height: 500px;
        word-break: break-all;
    }
    & .img{
        float: right;
        & img{
            width:688px;
            height: 500px;
        }
    }
}
.product-banner h2{
    font-size: 50px;
    color: #fff;
    padding: 55px 0 5px;
}
.product-banner p{
    margin: 10px 0 10px;
    color: #fff;
    font-size: 14px;
    line-height: 25px;
}
.product-abox{
    margin: 20px 0 15px;
}
.product-btn{
    display: inline-block;
    height: 35px;
    line-height: 35px;
    padding: 0 32px;
    color: #fff;
    font-size: 14px;
    transition: all .5s ease;
    border: 1px solid #448aff;
    background: rgb(68, 137, 251);
}
.disable{
    cursor: not-allowed;
}
.product-btn:hover{
    background: #4733F9;
    border: 1px solid #4733F9;
}
</style>
<template>
    <div class="darkBluebg">
        <div class="container">
            <div class="product-banner">
                <div class="word">
                    <h2>{{params.title}}</h2>
                    <p>{{params.content}}</p>
                    <div class="product-abox">
                        <a href="javascript:void(0)" target="_blank" class="product-btn disable" v-show = "params.url == '' "> 立即使用</a>
                        <a :href="params.url" target="_blank" class="product-btn" v-show = "params.url != '' "> 立即使用</a>
                    </div>
                </div>
                <div class="img">
                    <img :src="params.img">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['params'],
    data () {
        return {
            title: ""
        };
    }
};
</script>