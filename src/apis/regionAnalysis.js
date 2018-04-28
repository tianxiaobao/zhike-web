import AjaxClient from '@/utils/ajaxClient.js';
export {
    createRegionAnalysis,
    deleteRegionAnalysis,
    getRegionAnalysisList,
    getRegionAnalysis,
    getMainInfo,
    getCompetorList,
    getFeatureRate,
    getClassRank
};
function createRegionAnalysis (options) {
    return AjaxClient.fetch('/regionAnalysis/create', 'post', options);
}
function deleteRegionAnalysis (options) {
    return AjaxClient.fetch('/regionAnalysis/deleteById', 'delete', options);
}
function getRegionAnalysisList (options) {
    return AjaxClient.fetch('/regionAnalysis/queryAll', 'get', options);
}
function getRegionAnalysis (options) {
    return AjaxClient.fetch('/regionAnalysis/queryById', 'get', options);
}
function getMainInfo (options) {
    return AjaxClient.fetch('/regionAnalysis/analysisMainInfo', 'get', options);
}
function getCompetorList (options) {
    return AjaxClient.fetch('/regionAnalysis/analysisMainList', 'get', options);
}
function getFeatureRate (options) {
    return AjaxClient.fetch('/regionAnalysis/proportion', 'get', options);
}
function getClassRank (options) {
    return AjaxClient.fetch('/regionAnalysis/classTopN', 'get', options);
}