<style>
    .scroll-desc{
    	min-width: 2200px;
        height: 390px;
        position: absolute;
        left: 0;
        top: 15px;
        transition: all .2s;
        & .ititle{
            width: 100%;
            height: 110px;
            box-sizing: border-box;
            padding-top: 30px;
            background: rgb(245, 245, 249);
            text-align: center;
            & i{
                width: 66px;
                height: 50px;
                display: inline-block;
                vertical-align: middle;
            }
            & span{
                display: inline-block;
                height: 50px;
                font-size: 20px;
                color: #3e3a6a;
            }
        }
        & .icontent{
        	box-sizing: border-box;
            padding: 30px 25px;
            height: 278px;
            width: 100%;
            background: #fff;
            font-size: 14px;
            color: #8a95c4;
            text-align: center;
        }
        & >li{
            width: 300px;
            height: 390px;
            display: inline-block;
            box-sizing: border-box;
            border: 1px solid rgb(214,218,222);
            border-right: 0;
            box-shadow: inset 0 0 5px rgba(0,0,0,.2);
            vertical-align: top;
            position: relative;
            & .li-hover{
               display: none;
            }
        }
        & >li:hover{
        	/*width: 310px;*/
        	border: 0;
        	box-shadow: 0 0 0;
        	& .li-hover{
        		display: block;
        		position: absolute;
        		left: 0;
        		top: -15px;
        		z-index: 10;
        	    width: 310px;
                height: 425px;
                box-sizing: border-box;
                border: 1px solid rgb(101, 158, 252);
                & .ititle{
                	width: 308px;
                	height: 110px;
                	background: #4489fb;
                	& i{
				        width: 80px;
				        height: 60px;
				        display: inline-block;
				        vertical-align: middle;
				    }
				    & span{
				        display: inline-block;
				        height: 50px;
				        font-size: 20px;
				        color: #fff;
				    }
                }
                & .icontent{
                	height: 313px;
                	background: #fff;
                	padding: 30px 25px;
                	position: relative;
                	& a{
                		display: inline-block;
                		width: 200px;
                		height: 40px;
                		background: #4489fb;
                		color: #fff;
                		position: absolute;
                		left: 55px;
                		bottom: 45px;
                		font-size: 16px;
                		line-height: 40px;
                		text-align:center;
                	}
                }
        	}
        }
    }
</style>
<template>
	<div>
		<ul class = "scroll-desc">
        	<li v-for = "item in list">
        		<div class = "ititle">
        			<i :class = "item.icon"></i>
        			<span>{{item.title}}</span>
        		</div>
        		<p class = "icontent">
        			{{item.content}}
        		</p>
        		<div class="li-hover">
        			<div class="ititle">
        				<i :class = "item.iconHover"></i>
        			    <span>{{item.title}}</span>
        			</div>
        			<p class="icontent">
        			    {{item.content}}
        			    <a :href="item.url">查看详情</a>
        			</p>
        		</div>
        	</li>
        </ul>
	</div>
</template>
<script>
import * as cfg from "./config.js";
export default {
    data () {
        return {
            list: cfg.desc
        };
    }
};
</script>