import AjaxClient from '@/utils/ajaxClient.js';
export {
    createMessage,
    getMessageList,
    appealMessage,
    deleteMessage
};
function createMessage (options) {
    // return new Promise((resolve) => setTimeout(() => resolve({status:"success", message:""}), 1000));
    return AjaxClient.fetch('/shortMessage/create', 'post', options);
}
function getMessageList (options) {
    // return new Promise((resolve) => setTimeout(() => resolve({"status":"success","message": {
    //     "list":[
    //         {"id":1,"userPin":"datajingdo","mallId":123,"modelName":"测试模板","modelContent":"这就是个测试的模板！","useTime":1,"modelStatus": 0,"approvalSug":"同意","approvalerPin":"leader","createDate":"2017-12-25","approvalTime":"2017-12-26"},
    //         {"id":2,"userPin":"datajingdo","mallId":123,"modelName":"测试模板","modelContent":"这就是个测试的模板！","useTime":1,"modelStatus": 1,"approvalSug":"同意","approvalerPin":"leader","createDate":"2017-12-25","approvalTime":"2017-12-26"},
    //         {"id":3,"userPin":"datajingdo","mallId":123,"modelName":"测试模板","modelContent":"这就是个测试的模板！","useTime":1,"modelStatus": 2,"approvalSug":"同意","approvalerPin":"leader","createDate":"2017-12-25","approvalTime":"2017-12-26"},
    //         {"id":4,"userPin":"datajingdo","mallId":123,"modelName":"测试模板","modelContent":"这就是个测试的模板！","useTime":1,"modelStatus": 3,"approvalSug":"同意","approvalerPin":"leader","createDate":"2017-12-25","approvalTime":"2017-12-26"}
    //     ]}
    // }), 1000));
    return AjaxClient.fetch('/shortMessage/list', 'get', options);
}
function appealMessage (options) {
    // return new Promise((resolve) => setTimeout(() => resolve({"status": "success","message": ""}), 1000));
    return AjaxClient.fetch('/shortMessage/toappeal', 'post', options);
}
function deleteMessage (options) {
    // return new Promise((resolve) => setTimeout(() => resolve({"status":"success","message":""}), 1000));
    return AjaxClient.fetch('/shortMessage/delete', 'get', options);
}  