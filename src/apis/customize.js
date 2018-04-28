import AjaxClient from '@/utils/ajaxClient.js';

export {
    getCustomAgeCoverage,
    getCustomSexCoverage,
    getCustomJobDistribution,
    getCustomMarriageDistribution,
    getCustomHaveChildren,
    getCustomChildrenAge,
    getCustomConsumePreference,
    getCustomBrandPreference,
    getCustomPurchasingPowerAnalysis,
    getCustomSalesPromotionAnalysis,
    getCustomJDLevelAnalysis,
    getCustomMombabyAnalysis,
    getCustomBeautyAnalysis,
    getCustomWineAnalysis,
    getCustomCustomerWorth,
    getCustomCustomerLifeCycle,
    // getCustomResidenceAnalysis,
    getCustomThirdBySelect,
    getCustomThirdByUser,
    getCustomBrandBySelect,
    getCustomDimensionList,
    getCustomMultiAnalysis,
    getCustomRfmRValueAll,
    getCustomRfmRScoreD7,
    getCustomRfmRScoreD15,
    getCustomRfmRScoreD30,
    getCustomRfmRScoreM3,
    getCustomRfmMScoreD7,
    getCustomRfmMScoreD15,
    getCustomRfmMScoreD30,
    getCustomRfmMScoreM3,
    getCustomRfmFScoreD7,
    getCustomRfmFScoreD15,
    getCustomRfmFScoreD30,
    getCustomRfmFScoreM3,
    getCustomDeviceBrand,
    getCustomDeviceOs
};

// 客户三级品类偏好
function getCustomThirdByUser (options) {
    options.path.push('thirdByUser');
    return AjaxClient.fetch(`/customize`, 'get', options);
}

// 三级品类偏好
function getCustomThirdBySelect (options) {
    options.path.push('thirdBySelect');
    return AjaxClient.fetch(`/customize`, 'get', options);
}

function getCustomBrandBySelect (options) {
    options.path.push('brandBySelect');
    return AjaxClient.fetch(`/customize`, 'get', options);
}

// 定制画像

// 年龄
function getCustomAgeCoverage (options) {
    options.path.push('profile/cpp_base_age');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 性别
function getCustomSexCoverage (options) {
    options.path.push('profile/cpp_base_sex');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 婚姻状况
function getCustomMarriageDistribution (options) {
    options.path.push('profile/cpp_base_marriage');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 职业
function getCustomJobDistribution (options) {
    options.path.push('profile/cpp_base_profession');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 敏感度类型
function getCustomSalesPromotionAnalysis (options) {
    options.path.push('profile/cfv_sens_promotion');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 购买力
function getCustomPurchasingPowerAnalysis (options) {
    options.path.push('profile/cgp_cust_purchpower');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 母婴用户购买力
function getCustomMombabyAnalysis (options) {
    options.path.push('profile/csf_medal_mombaby');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 个护用户购买力
function getCustomBeautyAnalysis (options) {
    options.path.push('profile/csf_medal_beauty');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 酒类用户购买力
function getCustomWineAnalysis (options) {
    options.path.push('profile/csf_medal_wine');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 京东等级
function getCustomJDLevelAnalysis (options) {
    options.path.push('profile/cpp_base_ulevel');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 是否有小孩
function getCustomHaveChildren (options) {
    options.path.push('profile/cpp_seni_haschild');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 小孩年龄
function getCustomChildrenAge (options) {
    options.path.push('profile/cpp_seni_childage');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 客户价值
function getCustomCustomerWorth (options) {
    options.path.push('profile/cvl_rfm_all_group');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 常用设备操作系统
function getCustomDeviceOs (options) {
    options.path.push('profile/device_common_os_plant');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 常用设备品牌
function getCustomDeviceBrand (options) {
    options.path.push('profile/device_common_brand');
    return AjaxClient.fetch(`/customize`, 'get', options);
}

// 最近一次购买距今天数
function getCustomRfmRValueAll (options) {
    options.path.push('profile/rfm_r_value_all');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近7天最近一次购买距今天数得分
function getCustomRfmRScoreD7 (options) {
    options.path.push('profile/rfm_r_score_d7');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近15天最近一次购买距今天数得分
function getCustomRfmRScoreD15 (options) {
    options.path.push('profile/rfm_r_score_d15');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近30天最近一次购买距今天数得分
function getCustomRfmRScoreD30 (options) {
    options.path.push('profile/rfm_r_score_d30');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近90天最近一次购买距今天数得分
function getCustomRfmRScoreM3 (options) {
    options.path.push('profile/rfm_r_score_m3');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近7天下单金额得分
function getCustomRfmMScoreD7 (options) {
    options.path.push('profile/rfm_m_score_d7');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近15天下单金额得分
function getCustomRfmMScoreD15 (options) {
    options.path.push('profile/rfm_m_score_d15');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近30天下单金额得分
function getCustomRfmMScoreD30 (options) {
    options.path.push('profile/rfm_m_score_d30');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近90天下单金额得分
function getCustomRfmMScoreM3 (options) {
    options.path.push('profile/rfm_m_score_m3');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近7天购买次数得分
function getCustomRfmFScoreD7 (options) {
    options.path.push('profile/rfm_f_score_d7');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近15天购买次数得分
function getCustomRfmFScoreD15 (options) {
    options.path.push('profile/rfm_f_score_d15');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近30天购买次数得分
function getCustomRfmFScoreD30 (options) {
    options.path.push('profile/rfm_f_score_d30');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 近90天购买次数得分
function getCustomRfmFScoreM3 (options) {
    options.path.push('profile/rfm_f_score_m3');
    return AjaxClient.fetch(`/customize`, 'get', options);
}

// 品类偏好
function getCustomConsumePreference (options) {
    options.path.push('profile/cfv_cate_30dcate2');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 品牌偏好
function getCustomBrandPreference (options) {
    options.path.push('profile/cfv_brand_favor');
    return AjaxClient.fetch(`/customize`, 'get', options);
}
// 客户生命周期
function getCustomCustomerLifeCycle (options) {
    options.path.push('profile/cgp_cycl_lifecycle');
    return AjaxClient.fetch(`/customize`, 'get', options);
}

function getCustomDimensionList (options) {
    return AjaxClient.fetch('/customize/multiProfile', 'get', options);
}
function getCustomMultiAnalysis (options) {
    return AjaxClient.fetch('/customize/multiSearch', 'get', options);
}