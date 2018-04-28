import bannerImg from "@/components/product/assets/face/banner.png";
import "@/components/product/assets/customer-flow/flow.css";
const banner = {
    title: "人脸识别",
    content: "实现了图像或视频中人脸的检测、分析和比对，包括人脸检测定位、人脸属性识别和人脸比对等独立服务模块，可为开发者和企业提供高性能的在线API服务，应用于人脸AR、人脸识别和认证、大规模人脸检索、照片管理等各种场景。",
    url: "https://zhike.jdcloud.com/index.html#/vision/face-entry/single",
    img:bannerImg
};
const advantage = [
    {
        title:　"识别精准度高",
        icon: "icon-customer-flow-1",
        desc: "人脸检测识别等算法先进"
    },
    {
        title:　"识别速度快",
        icon: "icon-customer-flow-2",
        desc: "支持毫秒级识别"
    },
    {
        title:　"识别算法领先",
        icon: "icon-customer-flow-3",
        desc: "弹性扩容，避免高负载"
    },
    {
        title:　"提供完整的解决方案",
        icon: "icon-customer-flow-4",
        desc: "依托京东云提供完整的行业解决方案，弹性扩展，稳定高效"
    }
];
const feature = [
    {
        title:　"人脸检测与分析",
        icon: "icon-customer-flow-5",
        desc: "检测图片或视频流中人脸并返回人脸框坐标"
    },
    {
        title:　"五官定位",
        icon: "icon-customer-flow-6",
        desc: "精准定位并返回高精度关键点"
    },
    {
        title:　"人脸比对与验证",
        icon: "icon-customer-flow-7",
        desc: "精准判断两张人脸是否是同一个人，并返回置信度分数和相应的阈值，以便评估相似度"
    },
    {
        title:　"活体检测",
        icon: "icon-customer-flow-8",
        desc: "获取精准的人脸属性信息，包括年龄、性别、表情、头部姿态、眼睛状态、人种等"
    },
    {
        title:　"人脸检索",
        icon: "icon-customer-flow-9",
        desc: "在现有的人脸集合中搜索相似的人脸"
    },
    {
        title:　"情绪识别",
        icon: "icon-customer-flow-10",
        desc: "分析检测到的人脸的情绪，并返回该人脸在各类不同情绪上的置信度分数"
    }
];
const scene = [
    {
        title:　"实名认证",
        icon: "icon-customer-flow-11",
        desc: "将人脸信息与身份证信息进行匹配认证"
    },{
        title:　"刷脸支付",
        icon: "icon-customer-flow-12",
        desc: "人脸作为用户活体，唯一身份特质信息，可作为交易密码用于支付场景"
    },{
        title:　"在线营销",
        icon: "icon-customer-flow-13",
        desc: "“人脸互动”为创造新的营销方式提供了更多可能，同时获得更多用户信息，为分析及精准营销提供支持"
    },{
        title:　"防伪攻击",
        icon: "icon-customer-flow-14",
        desc: "多种活体技术方案有效防止各类攻击，保障交易安全"
    }
];
export {
    advantage,
    banner,
    feature,
    scene
};