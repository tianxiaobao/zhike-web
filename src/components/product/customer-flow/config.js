import bannerImg from "@/components/product/assets/customer-flow/banner.png";
import "@/components/product/assets/customer-flow/flow.css";
const banner = {
    title: "客流分析",
    content: "基于京东大数据优势，融合商家周边客流、进店人群数据，整合顾客购物意向与到店行为，识别活跃与高价值顾客，为商家提供实时客流量、停留时长、客流趋势等多维筛选分析，帮助商家全方位管理门店，智能运营；提供决策依据，制定营销推广方案。",
    url: "https://zhike.jdcloud.com/index.html#/customer-flow/overview",
    img:bannerImg
};
const advantage = [
    {
        title:　"数据维度全面",
        icon: "icon-customer-flow-1",
        desc: "融合客户和京东数据进行分析"
    },
    {
        title:　"算法领先",
        icon: "icon-customer-flow-2",
        desc: "算法领先，能识别店员与常客"
    },
    {
        title:　"准确的决策依据",
        icon: "icon-customer-flow-3",
        desc: "结合客流分析、商圈分析，为商家选址及智能运营提供依据"
    },
    {
        title:　"获取人群方案业界领先",
        icon: "icon-customer-flow-4",
        desc: "集合自有硬件提供商，提供专业稳定的服务，以扩大覆盖率、更准确的基础人群信息来支持高识别率"
    }
];
const feature = [
    {
        title:　"商场/店铺总流量分析",
        icon: "icon-customer-flow-5",
        desc: "在商场与外界连通的所有通道部署客流统计点，可以获取购物中心整体的客流量数据、店铺的客流总量"
    },
    {
        title:　"各区域、楼层客流分析",
        icon: "icon-customer-flow-6",
        desc: "在商场各区域、各楼层通道间部署客流统计点，可以获取购物中心各个区域的客流量数据"
    },
    {
        title:　"店铺（/品牌）客流吸引度分析",
        icon: "icon-customer-flow-7",
        desc: "为商场各租户部署客流统计点。到达这一层的数据统计深度，几乎已经能够掌握到所有客流动态的细节"
    },
    {
        title:　"数据云平台",
        icon: "icon-customer-flow-8",
        desc: "任何地方、任何时间都可以直接访问数据云平台，直接实现客流分析报表的查询、远程视频巡店、门店冷热区数据、门店动线等功能"
    },
    {
        title:　"商圈分析",
        icon: "icon-customer-flow-9",
        desc: "对店铺或者指定地址的5公里范围内提供商圈分析"
    },
    {
        title:　"到场客流停留时间计算",
        icon: "icon-customer-flow-10",
        desc: "算法支持计算在各商场楼层区域，客户的停留时间；对店铺提供店内停留时间"
    }
];
const scene = [
    {
        title:　"商场营销指导",
        icon: "icon-customer-flow-11",
        desc: "商场智慧客流统计分析系统，为广场提供了精准智能化管理数据"
    },{
        title:　"商场入驻品牌选择指导",
        icon: "icon-customer-flow-12",
        desc: "根据商场常客的品牌偏好，对商场选择入驻品牌提供指导开店选址指导"
    },{
        title:　"店员轮班指导",
        icon: "icon-customer-flow-13",
        desc: "对商场/店铺的客流分析，对店员在班分布知道，以保障店铺的优质服务"
    },{
        title:　"开店选址指导",
        icon: "icon-customer-flow-14",
        desc: "提供指定地址内5公里范围内的人群画像，为商家开店选址提供决策依据"
    }
];
export {
    advantage,
    banner,
    feature,
    scene
};