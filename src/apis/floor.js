import AjaxClient from '@/utils/ajaxClient.js';

export { getFloorList };

function getFloorList (options) {
    return AjaxClient.fetch('/floor/list', 'get', options);
}