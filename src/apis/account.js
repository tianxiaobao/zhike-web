import AjaxClient from '@/utils/ajaxClient.js';

export { exit };

function exit (options) {
    return AjaxClient.fetch(`//sso.jdcloud.com/exit?t=${Date.now()}`, 'get', options);
}