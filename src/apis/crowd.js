import AjaxClient from '@/utils/ajaxClient.js';

export {
    addCrowd,
    getCrowdList,
    getSmsCrowdList,
    uploadCrowd,
    getPortrayalList,
    importCrowd,
    deleteUploaded,
    deleteUnupload,
    reupload
};

function addCrowd (options) {
    return AjaxClient.fetch('/userPackage/add', 'get', options);
}
function getCrowdList (options) {
    return AjaxClient.fetch('/userPackage/list', 'get', options);
}
// 获取可创建短信任务的人群包
function getSmsCrowdList (options) {
    return AjaxClient.fetch('/userPackage/smsList', 'get', options);
}
// 上传本地投放人群包
function uploadCrowd (options) {
    return AjaxClient.fetch('/userPackage/uploadFile', 'post', options);
}
// 上传客流人群包
function importCrowd (option) {
    return AjaxClient.fetch('/userPackage/import', 'post', option);
}
// 获取本地客流人群包列表
function getPortrayalList (options) {
    return AjaxClient.fetch('/userPackage/listDmp', 'get', options);
}
// 删除投放到DMP的人群包
function deleteUploaded (option) {
    return AjaxClient.fetch('/userPackage/deleteDmp', 'post', option);
}
// 删除未上传到DMP的人群包
function deleteUnupload (option) {
    return AjaxClient.fetch('/userPackage/deleteUserPackage', 'post', option);
}
function reupload (option) {
    return AjaxClient.fetch('/userPackage/reuploadFile', 'post', option);
}
