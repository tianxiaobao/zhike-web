import AjaxClient from '@/utils/ajaxClient.js';

export {
    // createPromotion,
    // deletePromotion,
    // putOffline,
    // putOnline,
    // getPromotionList,
    createShop,
    getShopList,
    updateShop,
    deleteShop
    // updatePromotion
};

// function createPromotion (options) {
//     return AjaxClient.fetch('/promotion/create', 'post', options);
// }
// function deletePromotion (options) {
//     return AjaxClient.fetch('/promotion/deleteById', 'delete', options);
// }
// function putOffline (options) {
//     return AjaxClient.fetch('/promotion/putOffline', 'get', options);
// }
// function putOnline (options) {
//     return AjaxClient.fetch('/promotion/putOnline', 'get', options);
// }
// function getPromotionList (options) {
//     return AjaxClient.fetch('/promotion/queryAll', 'get', options);
// }
function createShop (options) {
    return AjaxClient.fetch('/promotion/createShop', 'post', options);
}
function getShopList (options) {
    // return AjaxClient.fetch('/promotion/shoplist', 'get', options);
    return AjaxClient.fetch('/mall/'+options.path[0]+'/shops', 'get');
}
function updateShop (options) {
    return AjaxClient.fetch('/promotion/updateShop', 'post', options);
}
function deleteShop (options) {
    return AjaxClient.fetch('/promotion/deleteShopById', 'delete', options);
}
// function updatePromotion (options) {
//     return AjaxClient.fetch('/promotion/update', 'post', options);
// }
