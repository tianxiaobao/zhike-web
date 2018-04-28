<style>
    .title{
        margin-top: 40px;
    }
	.product-h2{
		position: relative;
        border-top: 1px solid transparent;
        color: #333;
        font-size: 24px;
        margin: 50px 0;
	}
	.product-h2 span{
		display: inline-block;
        position: absolute;
        left: 0;
        top: -20px;
        padding: 0 30px 0 0;
        margin-bottom: .1rem;
	}
    .content{
        display: flex;
        flex-flow: row wrap;
        padding-bottom: 40px;
        justify-content: space-between;
    }
</style>
<template>
    <div class = "title">
        <h2 class = "product-h2">
            <span>{{title}}</span>
        </h2>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default{
        props:['title']
    };
</script>