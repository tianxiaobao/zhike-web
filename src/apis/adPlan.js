import AjaxClient from '@/utils/ajaxClient.js';

export {
    createAdPlan,
    adPlanList,
    adPlanRestart,
    adPlanStop,
    getAdPlan,
    tagList,
    tagAdd,
    listResult
};

// 创建任务
function createAdPlan (options) {
    return AjaxClient.fetch('/adPlan/create', 'post', options);
}
// 任务列表
function adPlanList (options) {
    return AjaxClient.fetch('/adPlan/list', 'get', options);
}
// 重启任务
function adPlanRestart (options) {
    return AjaxClient.fetch('/adPlan/restart', 'post', options);
}
// 取消任务
function adPlanStop (options) {
    return AjaxClient.fetch('/adPlan/stop', 'post', options);
}
// 编辑任务
function getAdPlan (options) {
    return AjaxClient.fetch('/adPlan/get', 'get', options);
}
// 类别列表
function tagList (options) {
    return AjaxClient.fetch('/adPlan/tag/list','get', options);
}
// 添加类别
function tagAdd (options) {
    return AjaxClient.fetch('/adPlan/tag/add','post', options);
}
// 短信效果列表
function listResult (options) {
    return AjaxClient.fetch('/adPlan/listResult','get', options);
}
