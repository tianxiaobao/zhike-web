import AjaxClient from '@/utils/ajaxClient.js';

export { getCategoryList };

function getCategoryList (options) {    
    return AjaxClient.fetch('/category/list', 'get', options);
}
