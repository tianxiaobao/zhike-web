import AjaxClient from '@/utils/ajaxClient.js';

export {
    getTrendHistory,
    getTrendAverage,
    getEnterAmountHistory,
    getEnterAmountAverage,
    getJumpOutRatioHistory,
    getJumpOutRatioAverage,
    getStayTime,
    getNewOldRatio,
    getHotAreaDistribution,
    getContributionTops,
    getHeatMap
};

function getTrendHistory (options) {
    return AjaxClient.fetch('/customerFlow/customerFlowTrend/history', 'get', options);
}
function getTrendAverage (options) {
    return AjaxClient.fetch('/customerFlow/customerFlowTrend/average', 'get', options);
}
function getEnterAmountHistory (options) {
    return AjaxClient.fetch('/customerFlow/enterShopCustomerAmount/history', 'get', options);
}
function getEnterAmountAverage (options) {
    return AjaxClient.fetch('/customerFlow/enterShopCustomerAmount/average', 'get', options);
}
function getJumpOutRatioHistory (options) {
    return AjaxClient.fetch('/customerFlow/enterShopJumpOutRatio/history', 'get', options);
}
function getJumpOutRatioAverage (options) {
    return AjaxClient.fetch('/customerFlow/enterShopJumpOutRatio/average', 'get', options);
}
function getStayTime (options) {
    return AjaxClient.fetch('/customerFlow/averageStayTime', 'get', options);
}
function getNewOldRatio (options) {
    return AjaxClient.fetch('/customerFlow/customerNewOldRatio', 'get', options);
};
function getHotAreaDistribution (options) {
    return AjaxClient.fetch('/customerFlow/customerFlowHotAreaDistribution', 'get', options);
};
function getContributionTops (options) {
    return AjaxClient.fetch('/customerFlow/customerFlowContributionTop5', 'get', options);
}
function getHeatMap (options) {
    return AjaxClient.fetch('/customerFlow/heatMap', 'get', options);
}