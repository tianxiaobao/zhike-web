import bannerImg from "@/components/product/assets/persona/banner.png";
import "@/components/product/assets/persona/persona.css";
const banner = {
    title: "人群画像",
    content: "融合京东数据及门店采集、客户上传的全量数据，分析顾客全网渠道行为及偏好，群体基本特征与兴趣偏好的多维数据，为商家进行顾客特征、会员分层和顾客忠诚度分析，帮助商家全面提升营销能力。",
    url: "https://zhike.jdcloud.com/index.html#/persona/customer-flow?initTab=population",
    img: bannerImg
};
const advantage = [
    {
        title:　"数据全面",
        icon: "icon-persona-1",
        desc: "京东全面数据"
    },
    {
        title:　"数据标签丰富",
        icon: "icon-persona-2",
        desc: "京东用户能在京东服务，服务覆盖商家、客户等多段"
    },
    {
        title:　"标签准确度高",
        icon: "icon-persona-3",
        desc: "京东的客户完成全流程购物行为，标签准确度高"
    },
    {
        title:　"提供完整的解决方案",
        icon: "icon-persona-4",
        desc: "依托京东云提供完整的行业解决方案，弹性扩展，稳定高效"
    }
];
const feature = [
    {
        title:　"客流画像",
        icon: "icon-persona-5",
        desc: "wifi、人脸识别收集来的人群与京东数据融合，输出画像"
    },
    {
        title:　"会员画像",
        icon: "icon-persona-6",
        desc: "对企业提供的会员信息通过接口方式传输，与京东画像融合输出画像"
    },
    {
        title:　"定制化用户画像",
        icon: "icon-persona-7",
        desc: "对于活动等收集的人群信息（支持本地上传），与京东画像融合输出画像"
    },
    {
        title:　"人群筛选",
        icon: "icon-persona-8",
        desc: "自定义组合标签（最多三个标签）筛选人群"
    },
    {
        title:　"精准人群包建立",
        icon: "icon-persona-9",
        desc: "画像可建立人群包，提供给小黑珑、京准通京东的自有广告投放系统识别，并广告可以落地自己的商城APP等"
    },
    {
        title:　"自定义人群标签",
        icon: "icon-persona-10",
        desc: "支持企业客户对京东云数据仓库的用户数据建模分析、自主设计用户标签及生成业务规则"
    }
];
const scene = [
    {
        title:　"营销支持",
        icon: "icon-persona-11",
        desc: "对商场、品牌、店铺的人群包建立并数字营销投放"
    },{
        title:　"商家选择合作伙伴的依据",
        icon: "icon-persona-12",
        desc: "商场根据会员、客流画像这部分人群的购物习惯、兴趣，对选定入驻店铺品牌提供参考"
    },{
        title:　"短信投放",
        icon: "icon-persona-13",
        desc: "对手机号的key识别的人群包，可投放短信，通知活动等支持在营销"
    },{
        title:　"自有人群包投放",
        icon: "icon-persona-14",
        desc: "支持可以提供建模算法、京东云计算，建立自有的人群包投放广告，以达到广告效果"
    }
];
export {
    advantage,
    banner,
    feature,
    scene
};