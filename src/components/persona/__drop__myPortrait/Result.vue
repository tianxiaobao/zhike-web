<template>
<div>
    <title-bar class="bar">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>我的画像</el-breadcrumb-item>
            <el-breadcrumb-item>结果</el-breadcrumb-item>
        </el-breadcrumb>
    </title-bar>
    <div class="content">
        <div class="wrapper">
            <div class="box box1">
                <div class="title">购买力标签</div>
                <div class="item-box">
                    <span class="item" v-if="userInfo.cgp_cust_purchpower">{{userInfo.cgp_cust_purchpower}}</span>
                    <span class="item" v-if="userInfo.csf_medal_mombaby">母婴{{userInfo.csf_medal_mombaby}}</span>
                    <span class="item" v-if="userInfo.csf_medal_beauty">个护{{userInfo.csf_medal_beauty}}</span>
                    <span class="item" v-if="userInfo.csf_medal_wine">酒类{{userInfo.csf_medal_wine}}</span>
                </div>
            </div>
            <div class="box box2">
                <div class="title">行为标签</div>
                <div class="item-box right">
                    <span class="item" v-if="userInfo.rfm_r_value_all">您已{{userInfo.rfm_r_value_all}}天未在京东购买</span>
                    <span class="item" v-if="userInfo.cfv_cate_30dcate2">品类偏好：{{userInfo.cfv_cate_30dcate2}}</span>
                    <span class="item" v-if="userInfo.cfv_brand_favor">品牌偏好：{{userInfo.cfv_brand_favor}}</span>
                </div>
            </div>
            <div class="box box3">
                <div class="title">习惯标签</div>
                <div class="item-box">
                    <span class="item" v-if="userInfo.device_common_brand">常用设备品牌：{{userInfo.device_common_brand}}</span>
                    <span class="item" v-if="userInfo.device_common_os_plant">常用设备操作系统：{{userInfo.device_common_os_plant}}</span>
                    <span class="item" v-if="userInfo.csf_sale_paytype">常用支付方式：{{userInfo.csf_sale_paytype}}</span>
                </div>
            </div>
            <div class="box box4">
                <div class="title">京东特征</div>
                <div class="item-box right">
                    <span class="item" v-if="userInfo.cfv_sens_promotion">敏感度类型：{{userInfo.cfv_sens_promotion}}</span>
                    <span class="item" v-if="userInfo.cpp_base_ulevel">京东等级：{{userInfo.cpp_base_ulevel}}</span>
                    <span class="item" v-if="userInfo.cvl_rfm_all_group">客户价值：{{userInfo.cvl_rfm_all_group}}</span>
                </div>
            </div>
            <div class="box5">
                <img :src="iconSrc">
                <canvas  id="can" width="330" height="330"></canvas>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
import female from '@/assets/female.png';
import male from '@/assets/male.png';
import unknown from '@/assets/unknown.png';
export default {
    components: {
        'title-bar':TitleBar
    },
    computed: {
        iconSrc () {
            const userSex = this.$store.getters.profile.cpp_base_sex;
            const sexImg = userSex=='男'?male:(userSex=="女"? female:unknown);
            return sexImg;
        },
        userInfo () {
            return this.$store.getters.profile;
        }
    },
    mounted () {
        const arr = [
            this.userInfo.cpp_base_age,
            this.userInfo.cpp_base_marriage,
            this.userInfo.cpp_base_profession
        ];
        const pos = [
            {
                x:70,
                y:60
            },
            {
                x:80,
                y:260
            },
            {
                x:210,
                y:240
            },
            {
                x:10,
                y:160
            },
            {
                x:230,
                y:160
            }
        ];
        const len= arr.length;
        const can = this.$$('can');
        const cans = can.getContext('2d');
        cans.font = '100 14px Georgia';
        cans.fillStyle = '#a3cfd0';
        for(let i = len; i >= 0; i--) {
            if(arr[i]=='未知'|| arr[i]==undefined) {
                arr.splice(i, 1);
            }
        }
        for(let i = 0; i < arr.length; i++) {
            cans.fillText(arr[i], pos[i].x, pos[i].y);
        }
    },
    data () {
        return {
        };
    },
    methods: {
        $$ (id) {
            return document.getElementById(id);
        }
    }
};
</script>

<style scoped>
.wrapper{
    width: 1100px;
    height: 600px;
    margin: 0 auto;
    margin-top: 70px;
    position: relative;
}
.box{
    width: 500px;
    height: 250px;
    background: #d5eaed;
    border-radius: 125px;
    position: relative;
}
.box .title{
    position: absolute;
    background: #fff;
    padding: 5px 20px 10px 20px;
    left: 50%;
    transform:translate(-50%,-50%);
    border: 3px solid #7ac1bd;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    color: #186f80;
}
.item-box{
    width: 320px;
    margin-left: 50px;
    margin-top: 80px;
}
.item-box.right{
    margin-left: 150px;
}
.box .item{
    display: inline-block;
    border:1px solid #d2dcdd;
    padding: 5px 10px;
    text-align: center;
    border-radius: 5px;
    background: #fff;
    color: #000;
    margin-bottom: 5px;
}
.box:nth-child(2){
    background: #edeae5;
}
.box:nth-child(2) .title{
    border: 3px solid #dec1c5;
    color: #814456;
}
.box:nth-child(3){
    background: #e4e8eb;
}
.box:nth-child(3) .title{
    border: 3px solid #eec897;
    color: #b18440;
}
.box:nth-child(4){
    background: #e0e9f0;
}
.box:nth-child(4) .title{
    border: 3px solid #abbec5;
    color: #0682f4;
}
.box1,.box2,.box3,.box4,.box5{
    position: absolute;
}
.box2,.box4{
    left:600px;
}
.box3,.box4{
    top: 280px;
}
.box5{
    width: 330px;
    height: 330px;
    box-sizing: border-box;
    left: 550px;
    top: 265px;
    background: #fff;
    border-radius: 50%;
    border: 2px dashed #cddddc;
    transform:translate(-50%,-50%);
    & img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 50%;
    }
}
</style>
