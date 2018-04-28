import AjaxClient from '@/utils/ajaxClient.js';

export { getOverview };

function getOverview (options) {
    return AjaxClient.fetch('/overview/query', 'get', options);
}