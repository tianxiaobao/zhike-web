import AjaxClient from '@/utils/ajaxClient.js';

export {
    // getSummary,
    getAgeCoverage,
    getSexCoverage,
    getJobDistribution,
    getMarriageDistribution,
    getHaveChildren,
    getChildrenAge,
    getConsumePreference,
    getBrandPreference,
    getPurchasingPowerAnalysis,
    getSalesPromotionAnalysis,
    getJDLevelAnalysis,
    getMombabyAnalysis,
    getBeautyAnalysis,
    getWineAnalysis,
    getCustomerWorth,
    getCustomerLifeCycle,
    getResidenceAnalysis,
    getThirdBySelect,
    getThirdByUser,
    getBrandBySelect,
    getDimensionList,
    getMultiAnalysis,
    getRfmRValueAll,
    getRfmRScoreD7,
    getRfmRScoreD15,
    getRfmRScoreD30,
    getRfmRScoreM3,
    getRfmMScoreD7,
    getRfmMScoreD15,
    getRfmMScoreD30,
    getRfmMScoreM3,
    getRfmFScoreD7,
    getRfmFScoreD15,
    getRfmFScoreD30,
    getRfmFScoreM3,
    getDeviceBrand,
    getDeviceOs,
    getUploadList,
    CustomizeUpload
};

// function getSummary (options) {
//     return AjaxClient.fetch('/customerProfile/summary', 'get', options);
// }
// 年龄
function getAgeCoverage (options) {
    return AjaxClient.fetch('/customerProfile/cpp_base_age', 'get', options);
}
// 性别
function getSexCoverage (options) {
    return AjaxClient.fetch('/customerProfile/cpp_base_sex', 'get', options);
}
// 职业
function getJobDistribution (options) {
    return AjaxClient.fetch('/customerProfile/cpp_base_profession', 'get', options);
}
// 婚姻状况
function getMarriageDistribution (options) {
    return AjaxClient.fetch('/customerProfile/cpp_base_marriage', 'get', options);
}
// 是否有小孩
function getHaveChildren (options) {
    return AjaxClient.fetch('/customerProfile/cpp_seni_haschild', 'get', options);
}
// 小孩年龄
function getChildrenAge (options) {
    return AjaxClient.fetch('/customerProfile/cpp_seni_childage', 'get', options);
}
// 品类偏好
function getConsumePreference (options) {
    return AjaxClient.fetch('/customerProfile/cfv_cate_30dcate2', 'get', options);
}
// 品牌偏好
function getBrandPreference (options) {
    return AjaxClient.fetch('/customerProfile/cfv_brand_favor', 'get', options);
}
// 购买力
function getPurchasingPowerAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/cgp_cust_purchpower', 'get', options);
}
// 敏感度类型
function getSalesPromotionAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/cfv_sens_promotion', 'get', options);
}
// 京东等级
function getJDLevelAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/cpp_base_ulevel', 'get', options);
}
// 母婴用户购买力
function getMombabyAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/csf_medal_mombaby', 'get', options);
}
// 个护用户购买力
function getBeautyAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/csf_medal_beauty', 'get', options);
}
// 酒类用户购买力
function getWineAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/csf_medal_wine', 'get', options);
}
// 客户价值
function getCustomerWorth (options) {
    return AjaxClient.fetch('/customerProfile/cvl_rfm_all_group', 'get', options);
}
// 客户生命周期
function getCustomerLifeCycle (options) {
    return AjaxClient.fetch('/customerProfile/cgp_cycl_lifecycle', 'get', options);
}
function getResidenceAnalysis (options) {
    return AjaxClient.fetch('/customerProfile/residenceAnalysis', 'get', options);
}
function getThirdBySelect (options) {
    return AjaxClient.fetch('/customerProfile/thirdBySelect', 'get', options);
}
function getThirdByUser (options) {
    return AjaxClient.fetch('/customerProfile/thirdByUser', 'get', options);
}
function getBrandBySelect (options) {
    return AjaxClient.fetch('/customerProfile/brandBySelect', 'get', options);
}
// 最近一次购买距今天数
function getRfmRValueAll (options) {
    return AjaxClient.fetch('/customerProfile/rfm_r_value_all', 'get', options);
}
// 近7天最近一次购买距今天数得分
function getRfmRScoreD7 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_r_score_d7', 'get', options);
}
// 近15天最近一次购买距今天数得分
function getRfmRScoreD15 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_r_score_d15', 'get', options);
}
// 近30天最近一次购买距今天数得分
function getRfmRScoreD30 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_r_score_d30', 'get', options);
}
// 近90天最近一次购买距今天数得分
function getRfmRScoreM3 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_r_score_m3', 'get', options);
}
// 近7天下单金额得分
function getRfmMScoreD7 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_m_score_d7', 'get', options);
}
// 近15天下单金额得分
function getRfmMScoreD15 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_m_score_d15', 'get', options);
}
// 近30天下单金额得分
function getRfmMScoreD30 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_m_score_d30', 'get', options);
}
// 近90天下单金额得分
function getRfmMScoreM3 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_m_score_m3', 'get', options);
}
// 近7天购买次数得分
function getRfmFScoreD7 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_f_score_d7', 'get', options);
}
// 近15天购买次数得分
function getRfmFScoreD15 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_f_score_d15', 'get', options);
}
// 近30天购买次数得分
function getRfmFScoreD30 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_f_score_d30', 'get', options);
}
// 近90天购买次数得分
function getRfmFScoreM3 (options) {
    return AjaxClient.fetch('/customerProfile/rfm_f_score_m3', 'get', options);
}
// 常用设备品牌
function getDeviceBrand (options) {
    return AjaxClient.fetch('/customerProfile/device_common_brand', 'get', options);
}
// 常用设备操作系统
function getDeviceOs (options) {
    return AjaxClient.fetch('/customerProfile/device_common_os_plant', 'get', options);
}
function getDimensionList (options) {
    // return Promise.resolve({
    //     "status":"success",
    //     "message":{
    //         "DataResult":{
    //             "nameSerial":{
    //                 "name":"dimensions",
    //                 "cells":["年龄","性别","职业","婚姻状况","是否有小孩","小孩年龄","购买力","敏感度类型","京东等级"]
    //             },
    //             "dataSerials":[],
    //             "keySerial":{
    //                 "name":"key",
    //                 "cells":["Age","Sex","Job","Marriage","HasChildren","ChildrenAge","PurchasingPower","PromotionSensitive","JDLevel"]
    //             }
    //         }
    //     }
    // });
    return AjaxClient.fetch('/customerProfile/multiAnalysis/dimensions', 'get', options);
}
function getMultiAnalysis (options) {
    // return Promise.resolve({
    //     "status":"success",
    //     "message":{
    //         "DataResult":{
    //             "keySerial":{
    //                 "name":"key",
    //                 "cells":["alsdkjflasdjlfakjsdlkf"]
    //             },
    //             "nameSerial":{
    //                 "name":"多级筛选",
    //                 "cells":["16-25岁,土豪,公务员/事业单位"]
    //             },
    //             "dataSerials":[{
    //                 "name":"占比",
    //                 "cells":[11.11]
    //             }]
    //         }
    //     }
    // });
    return AjaxClient.fetch('/customerProfile/multiAnalysis', 'get', options);
}
// 指定mall的定制包上传记录
function getUploadList (options) {
    return AjaxClient.fetch('/customize/uploadList', 'get', options);
}
// 指定mall的定制记录上传
function CustomizeUpload (options) {
    return AjaxClient.fetch('/customize/upload', 'post', options);
}