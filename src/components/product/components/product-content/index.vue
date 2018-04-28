<style>
	.content-box{
		margin-bottom: 20px;
		width: 280px;
        height: 235px;
        box-sizing: border-box;
        -webkit-box-shadow: 0 0 7px 0 rgba(5,15,44,.1);
        -moz-box-shadow: 0 0 7px 0 rgba(5,15,44,.1);
        box-shadow: 0 0 7px 0 rgba(5,15,44,.1);
        text-align: center;
        padding: 40px 35px;
        background: #fff;
        & .icon-box{
        	& i{
        		width: 70px;
                height: 62px;
                display: inline-block;
        	}
        }
        & .title-box{
        	& p {
        		font-size: 16px;
        		font-weight: bold;
                line-height: 40px;
                color: #3e396b;
        	}
        }
        & .desc-box{
            text-align: center;
        	& span{
        		font-size: 14px;
                line-height: 25px;
                color: #8994c6;
        	}
        }
	}
	.big{
		width: 380px;
		height: 260px;
		border: 1px solid rgb(101, 158, 252);
        -webkit-box-shadow: 0 0 0px 0;
        -moz-box-shadow: 0 0 0px 0;
        box-shadow: 0 0 0px 0;
	}
</style>
<template>
	<div class = "content-box" :class = "{'big': flag}">
		<div class="main-box">
			<div class="icon-box">
				<i :class = "param.icon"></i>
			</div>
			<div class="title-box">
				<p>{{param.title}}</p>
			</div>
			<div class="desc-box">
				<span>{{param.desc}}</span>
			</div>
		</div>
	</div>
</template>
<script>
    export default {
        props: ['param','flag'],
        data () {
            return {
                msg: ""
            };
        }
    };
</script>