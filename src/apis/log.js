import AjaxClient from '@/utils/ajaxClient.js';

export { recordLog };

function recordLog (options) {
    return AjaxClient.fetch('/log/record', 'get', options);
}