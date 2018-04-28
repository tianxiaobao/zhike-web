import AjaxClient from '../utils/ajaxClient.js';

const csvTemplateURL = '/face-vision/sample.csv';

const URL_PREFIX = '/face-vision';

export {
    csvTemplateURL,
    uploadFile,
    getStatistic,
    getSlideShow,
    getInfoList,
    updateInfo,
    deleteInfo,
    getHistorySearch,
    getHistoryStatistic
};
// /face-vision
function uploadFile (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/upload', 'post', {
        type: 'form',
        params: data
    });
}
function getStatistic (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/stats', 'get', {
        params: data
    });
}
function getSlideShow (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/slideShow', 'get', {
        params: data
    });
}

function getInfoList (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/info/list', 'get', {
        params: data
    });
}
function updateInfo (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/info/update', 'post', {
        type: 'form',
        params: data
    });
}
function deleteInfo (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/info/delete', 'post', {
        type: 'form',
        params: data
    });
}

function getHistorySearch (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/history/search', 'get', {
        params: data
    });
}
function getHistoryStatistic (data) {
    return AjaxClient.fetch(URL_PREFIX + '/vision/history/statistic', 'get', {
        params: data
    });
}
