import AjaxClient from '@/utils/ajaxClient.js';

export {
    getProfileVerifyCode
};

function getProfileVerifyCode (options) {
    return AjaxClient.fetch('/sms/getProfileVerifyCode', 'get', options);
}
