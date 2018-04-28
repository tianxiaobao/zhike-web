import AjaxClient from '@/utils/ajaxClient.js';

export {
    getMemberAgeCoverage,
    getMemberSexCoverage,
    getMemberJobDistribution,
    getMemberMarriageDistribution,
    getMemberHaveChildren,
    getMemberChildrenAge,
    getMemberConsumePreference,
    getMemberBrandPreference,
    getMemberPurchasingPowerAnalysis,
    getMemberSalesPromotionAnalysis,
    getMemberJDLevelAnalysis,
    getMemberMombabyAnalysis,
    getMemberBeautyAnalysis,
    getMemberWineAnalysis,
    getMemberCustomerWorth,
    getMemberCustomerLifeCycle,
    // getMemberResidenceAnalysis,
    getMemberThirdBySelect,
    getMemberThirdByUser,
    getMemberBrandBySelect,
    getMemberDimensionList,
    getMemberMultiAnalysis,
    getMemberRfmRValueAll,
    getMemberRfmRScoreD7,
    getMemberRfmRScoreD15,
    getMemberRfmRScoreD30,
    getMemberRfmRScoreM3,
    getMemberRfmMScoreD7,
    getMemberRfmMScoreD15,
    getMemberRfmMScoreD30,
    getMemberRfmMScoreM3,
    getMemberRfmFScoreD7,
    getMemberRfmFScoreD15,
    getMemberRfmFScoreD30,
    getMemberRfmFScoreM3,
    getMemberDeviceBrand,
    getMemberDeviceOs
};

function dealMallId (options) {
    let mallId = 'unknow';
    if(options.path && options.path.length) {
        mallId = options.path[0];
        if(options.path.length == 1) {
            delete options.path;
        } else {
            options.path = options.path.slice(1);
        }
    }
    return mallId;
}

// 客户三级品类偏好
function getMemberThirdByUser (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/thirdByUser`, 'get', options);
}

// 三级品类偏好
function getMemberThirdBySelect (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/thirdBySelect`, 'get', options);
}

function getMemberBrandBySelect (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/brandBySelect`, 'get', options);
}

// 会员画像

// 年龄
function getMemberAgeCoverage (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_base_age`, 'get', options);
}
// 性别
function getMemberSexCoverage (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_base_sex`, 'get', options);
}
// 婚姻状况
function getMemberMarriageDistribution (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_base_marriage`, 'get', options);
}
// 职业
function getMemberJobDistribution (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_base_profession`, 'get', options);
}
// 敏感度类型
function getMemberSalesPromotionAnalysis (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cfv_sens_promotion`, 'get', options);
}
// 购买力
function getMemberPurchasingPowerAnalysis (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cgp_cust_purchpower`, 'get', options);
}
// 母婴用户购买力
function getMemberMombabyAnalysis (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/csf_medal_mombaby`, 'get', options);
}
// 个护用户购买力
function getMemberBeautyAnalysis (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/csf_medal_beauty`, 'get', options);
}
// 酒类用户购买力
function getMemberWineAnalysis (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/csf_medal_wine`, 'get', options);
}
// 京东等级
function getMemberJDLevelAnalysis (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_base_ulevel`, 'get', options);
}
// 是否有小孩
function getMemberHaveChildren (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_seni_haschild`, 'get', options);
}
// 小孩年龄
function getMemberChildrenAge (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cpp_seni_childage`, 'get', options);
}
// 客户价值
function getMemberCustomerWorth (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cvl_rfm_all_group`, 'get', options);
}
// 常用设备操作系统
function getMemberDeviceOs (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/device_common_os_plant`, 'get', options);
}
// 常用设备品牌
function getMemberDeviceBrand (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/device_common_brand`, 'get', options);
}

// 最近一次购买距今天数
function getMemberRfmRValueAll (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_r_value_all`, 'get', options);
}
// 近7天最近一次购买距今天数得分
function getMemberRfmRScoreD7 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_r_score_d7`, 'get', options);
}
// 近15天最近一次购买距今天数得分
function getMemberRfmRScoreD15 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_r_score_d15`, 'get', options);
}
// 近30天最近一次购买距今天数得分
function getMemberRfmRScoreD30 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_r_score_d30`, 'get', options);
}
// 近90天最近一次购买距今天数得分
function getMemberRfmRScoreM3 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_r_score_m3`, 'get', options);
}
// 近7天下单金额得分
function getMemberRfmMScoreD7 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_m_score_d7`, 'get', options);
}
// 近15天下单金额得分
function getMemberRfmMScoreD15 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_m_score_d15`, 'get', options);
}
// 近30天下单金额得分
function getMemberRfmMScoreD30 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_m_score_d30`, 'get', options);
}
// 近90天下单金额得分
function getMemberRfmMScoreM3 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_m_score_m3`, 'get', options);
}
// 近7天购买次数得分
function getMemberRfmFScoreD7 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_f_score_d7`, 'get', options);
}
// 近15天购买次数得分
function getMemberRfmFScoreD15 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_f_score_d15`, 'get', options);
}
// 近30天购买次数得分
function getMemberRfmFScoreD30 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_f_score_d30`, 'get', options);
}
// 近90天购买次数得分
function getMemberRfmFScoreM3 (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/rfm_f_score_m3`, 'get', options);
}

// 品类偏好
function getMemberConsumePreference (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cfv_cate_30dcate2`, 'get', options);
}
// 品牌偏好
function getMemberBrandPreference (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cfv_brand_favor`, 'get', options);
}
// 客户生命周期
function getMemberCustomerLifeCycle (options) {
    const mallId = dealMallId(options);
    return AjaxClient.fetch(`/member/${mallId}/profile/cgp_cycl_lifecycle`, 'get', options);
}
function getMemberDimensionList (options) {
    return AjaxClient.fetch('/member/multiProfile', 'get', options);
}
function getMemberMultiAnalysis (options) {
    return AjaxClient.fetch('/member/multiSearch', 'get', options);
}