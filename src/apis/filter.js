// 京东标签人群包筛选

import AjaxClient from '@/utils/ajaxClient.js';

export {
    getCategoryOptions,
    getBrandOptions,
    getShopOptions,
    getProfileEnum,
    getBySku,
    getEstimateNumber,
    createPackage,
    skuValidate
};

function getCategoryOptions (options) {
    // AjaxClient.fetch('/filter/getClassBrand', 'get', options);
    // return new Promise(resolve => {
    //     let ret;
    //     switch (options.params.type) {
    //     case 0:
    //         ret = {"status":"success","message":{"list":[{"id":"11842","cateName":"母婴"}]}};
    //         break;
    //     case 1:
    //         ret = {"status":"success","message":{"list":[{"id":"1184211","cateName":"母婴1-1"},{"id":"1184212","cateName":"母婴1-2"},{"id":"1184213","cateName":"母婴1-3"}]}};
    //         break;
    //     case 2:
    //         ret = {"status":"success","message":{"list":[{"id":"11842111","cateName":"母婴1-1-1"},{"id":"11842112","cateName":"母婴1-1-2"},{"id":"11842113","cateName":"母婴1-1-3"},{"id":"11842114","cateName":"母婴1-1-4"}]}};
    //         break;
    //     case 3:
    //         ret = {"status":"success","message":{"list":[{"id":"217343","brandName":"修正（XiuZheng）"},{"id":"217323","brandName":"葵花制药"}]}};
    //         break;
    //     }
    //     console.log(JSON.stringify(ret, null, 2));
    //     setTimeout(() => resolve(ret), 1000);
    // });
    return AjaxClient.fetch('/filter/getClassBrand', 'get', options);
}

function getBrandOptions (options) {
    // AjaxClient.fetch('/filter/getBrand', 'get', options);
    // return new Promise(resolve => {
    //     const ret = {"status":"success","pageResult":{"resultList":[{"id":"123456","brandName":"特仑苏"},{"id":"1234","brandName":"蒙牛纯甄"},{"id":"12342","brandName":"蒙牛纯甄"},{"id":"12134","brandName":"蒙牛纯甄"},{"id":"11234","brandName":"蒙牛纯甄"}],"total":235}};
    //     console.log(JSON.stringify(ret, null, 2));        
    //     setTimeout(() => resolve(ret), 1000);
    // });
    return AjaxClient.fetch('/filter/getBrand', 'get', options);
}

function getShopOptions (options) {
    // AjaxClient.fetch('/filter/getBrand', 'get', options);
    // return new Promise(resolve => {
    //     const ret = {"status":"success","pageResult":{"resultList":[{"id":"123456","brandName":"特仑苏"},{"id":"1234","brandName":"蒙牛纯甄"},{"id":"12342","brandName":"蒙牛纯甄"},{"id":"12134","brandName":"蒙牛纯甄"},{"id":"11234","brandName":"蒙牛纯甄"}],"total":235}};
    //     console.log(JSON.stringify(ret, null, 2));        
    //     setTimeout(() => resolve(ret), 1000);
    // });
    return AjaxClient.fetch('/filter/getShop', 'get', options);
}
function getProfileEnum (options) {
    // AjaxClient.fetch('/filter/getProfileEnum', 'get', options);
    // return new Promise(resolve => {
    //     let ret;
    //     switch (options.params.profileType) {
    //     case 'age':
    //         ret = {"status":"success","message":{"HashMap":{"15岁以下": "15岁以下","16-25岁": "16-25岁","26-35岁": "26-35岁","36-45岁": "36-45岁","46-55岁": "46-55岁","56岁以上": "56岁以上"}}};
    //         break;
    //     case 'sex':
    //         ret = {"status":"success","message":{"HashMap":{"男": "男", "女": "女"}}};
    //         break;
    //     case 'city':
    //         ret = {"status":"success","message":{"list":[{"pid":1,"provinceName":"河南省","city":[{"cid":"11","cityName":"洛阳市"},{"cid":"22","cityName":"郑州市"}]},{"pid":2,"provinceName":"河北省"}]}};
    //         break;
    //     }
    //     console.log(JSON.stringify(ret, null, 2));        
    //     setTimeout(() => resolve(ret), 1000);
    // });
    return AjaxClient.fetch('/filter/getProfileEnum', 'get', options);
}
function getBySku (options) {
    // AjaxClient.fetch('/filter/getBySku', 'get', options);
    // return new Promise(resolve => {
    //     const ret = {"status":"success","message":{"ClassBrand":{"firstClass":"母婴","secondClass":"洗护用品","thirdClass":"洗衣液/皂","brandName":"希望宝宝"}}};
    //     console.log(JSON.stringify(ret, null, 2));        
    //     setTimeout(() => resolve(ret), 1000);
    // });
    return AjaxClient.fetch('/filter/getBySku', 'get', options);
}
function getEstimateNumber (options) {
    // AjaxClient.fetch('/filter/estimateNum', 'post', options);
    // return new Promise(resolve => {
    //     const ret = {"status":"success","message":{"String": "1000万"}};
    //     console.log(JSON.stringify(ret, null, 2));
    //     setTimeout(() => resolve(ret), 1000);
    // });
    options.type = 'formData';
    return AjaxClient.fetch('/filter/estimateNum', 'post', options);
}
function createPackage (options) {
    // AjaxClient.fetch('/fileter/createPackage', 'post', options);
    // return new Promise(resolve => {
    //     const ret = {"status":"success","message":""};
    //     console.log(JSON.stringify(ret, null, 2));
    //     setTimeout(() => resolve(ret), 1000);
    // });
    options.type = 'formData';
    return AjaxClient.fetch('/filter/createPackage', 'post', options);
}
function skuValidate (options) {
    options.type = 'formData';
    return AjaxClient.fetch('/filter/skuValidate', 'post', options);
}
