import AjaxClient from '@/utils/ajaxClient.js';

export { getMallList,getProfile,getLoginUser,getAuths,getUserPms,getListMallTree };

function getMallList (options) {
    // return Promise.resolve({"status":"success","message":{"list":[{"id":1,"name":"北辰世纪中心","address":"北京市朝阳区北辰世纪中心","lat":40.00038,"lng":116.38722,"datasourceId":4,"topicName":"zhike_pre_beichen_dzww","topicId":"350359169DB6434F8D3E48D9E8079017","owner":"datajingdo_m"},{"id":2,"name":"测试商场","address":"北京市回龙观","lat":40.07077,"lng":116.33636,"datasourceId":4,"topicName":"zhike_pre_beichen_dzww","topicId":"350359169DB6434F8D3E48D9E8079017","owner":"datajingdo_m"},{"id":7,"name":"科码先锋试点1","address":"北京市朝阳区小关北里甲2号楼渔阳置业大厦A510","lat":39.98116,"lng":116.41576,"datasourceId":4,"topicName":"zhike_prod_wg","topicId":"9FF7A093E8A442E9BB75924FC5603051","owner":"datajingdo_m"},{"id":4,"name":"万谷商场","address":"江苏省南京市栖霞区栖霞街道华电路1号万谷-慧生活广场","lat":32.1024,"lng":118.8133,"datasourceId":4,"topicName":"zhike_prod_wg","topicId":"9FF7A093E8A442E9BB75924FC5603051","owner":"datajingdo_m"},{"id":8,"name":"方太","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":9,"name":"三只松鼠","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":10,"name":"劲酒","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":11,"name":"江小白","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":12,"name":"京东智慧门店","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":13,"name":"良品铺子","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":0,"name":"演示数据","address":null,"lat":40.00038,"lng":116.38722,"datasourceId":null,"topicName":null,"topicId":null,"owner":null}]}});
    return AjaxClient.fetch('/user/listMall', 'get', options);
}
function getProfile (options) {
    // return Promise.resolve({"status":"success","message":{"list":[{"id":1,"name":"北辰世纪中心","address":"北京市朝阳区北辰世纪中心","lat":40.00038,"lng":116.38722,"datasourceId":4,"topicName":"zhike_pre_beichen_dzww","topicId":"350359169DB6434F8D3E48D9E8079017","owner":"datajingdo_m"},{"id":2,"name":"测试商场","address":"北京市回龙观","lat":40.07077,"lng":116.33636,"datasourceId":4,"topicName":"zhike_pre_beichen_dzww","topicId":"350359169DB6434F8D3E48D9E8079017","owner":"datajingdo_m"},{"id":7,"name":"科码先锋试点1","address":"北京市朝阳区小关北里甲2号楼渔阳置业大厦A510","lat":39.98116,"lng":116.41576,"datasourceId":4,"topicName":"zhike_prod_wg","topicId":"9FF7A093E8A442E9BB75924FC5603051","owner":"datajingdo_m"},{"id":4,"name":"万谷商场","address":"江苏省南京市栖霞区栖霞街道华电路1号万谷-慧生活广场","lat":32.1024,"lng":118.8133,"datasourceId":4,"topicName":"zhike_prod_wg","topicId":"9FF7A093E8A442E9BB75924FC5603051","owner":"datajingdo_m"},{"id":8,"name":"方太","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":9,"name":"三只松鼠","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":10,"name":"劲酒","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":11,"name":"江小白","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":12,"name":"京东智慧门店","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":13,"name":"良品铺子","address":"","lat":0.0,"lng":0.0,"datasourceId":4,"topicName":"default","topicId":"","owner":"datajingdo_m"},{"id":0,"name":"演示数据","address":null,"lat":40.00038,"lng":116.38722,"datasourceId":null,"topicName":null,"topicId":null,"owner":null}]}});
    return AjaxClient.fetch('/user/profile', 'get', options);
}
// 产品页登录，获取当前用户
function getLoginUser (options) {
    return AjaxClient.fetch('/user/getLoginUser', 'get', options);
}
// 确认用户是否为管理员
function getAuths (options) {
    return AjaxClient.fetch('/user/isAdmin', 'get', options);
}
// 获取用户权限
function getUserPms (options) {
    return AjaxClient.fetch('/user/listPermissions', 'get', options);
}
// 获取左侧树
function getListMallTree (options) {
    return AjaxClient.fetch('/listMallTree', 'get', options);
}