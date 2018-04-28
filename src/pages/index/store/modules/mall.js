import { getListMallTree } from '@/apis/user';
// import { getShopList } from '@/apis/promotion';
import * as types from '../mutation-types';

const state = {
    mallList: [],
    fetchMallListError: null,
    currentMall: null,
    currentShop: null
};

// getters
const getters = {
    mallList: state => state.mallList,
    fetchMallListError: state => state.fetchMallListError,
    currentMall: state => state.mallList.find(mall => mall.id === state.currentMall),
    currentShop: (state, getters) => getters.currentMall && getters.currentMall.children.find(shop => shop.id === state.currentShop)
};

// mutations
const mutations = {
    [types.INIT_MALL] (state) {
        state.mallList = [];
        state.fetchMallListError = null;
        state.currentMall = null;
    },
    [types.SET_MALL_LIST] (state, list) {
        state.mallList = list;
    },
    [types.SET_FETCH_MALL_LIST_ERROR] (state, err) {
        state.fetchMallListError = err;
    },
    [types.SET_CURRENT_MALL] (state, mallId) {
        state.currentMall = mallId;
    },
    [types.SET_CURRENT_SHOP] (state, shopId) {
        state.currentShop = shopId;
    }
};

// actions
const actions = {
    fetchMallList ({ commit }) {
        commit(types.INIT_MALL);
        // getMallList().then(data => {
        //     const list = data.message.list;
        //     const length = list.length;
        //     let index = 0;
        //     for(let i=0;i< length;i++) {
        //         getShopList({
        //             path: [list[i].id]
        //         }).then(dataObj => {
        //             list[i].children = dataObj.message.list;
        //             list[i].children.unshift({name:'全部',id:0, mallId: list[i].id});
        //             index = index + 1;
        //             if(length==index) {
        //                 commit(types.SET_MALL_LIST, list);
        //                 commit(types.SET_CURRENT_MALL, list.length ? list[0].id : null);
        //                 commit(types.SET_CURRENT_SHOP, list.length && list[0].children.length ? list[0].children[0].id : null);
        //             }
        //         }).catch(err => {
        //             throw err;
        //         });
        //     }
        // }).catch(err => {
        //     commit(types.SET_FETCH_MALL_LIST_ERROR, err);
        // });
        getListMallTree().then(data => {
            data.message.list.forEach((item) => {
                item.children.unshift({name:'全部',id:0, mallId: item.id});
            });
            commit(types.SET_MALL_LIST, data.message.list);
            commit(types.SET_CURRENT_MALL, data.message.list.length ? data.message.list[0].id : null);
            commit(types.SET_CURRENT_SHOP, data.message.list.length && data.message.list[0].children.length ? data.message.list[0].children[0].id : null);
        }).catch(err => {
            commit(types.SET_FETCH_MALL_LIST_ERROR, err);
        });
    },
    setCurrentMall ({ commit }, mallId) {
        commit(types.SET_CURRENT_MALL, mallId);
    },
    setCurrentShop ({ commit }, shopId) {
        commit(types.SET_CURRENT_SHOP, shopId);
    },
    setCurrentMallShop ({ commit }, { mallId, shopId }) {
        commit(types.SET_CURRENT_MALL, mallId);
        commit(types.SET_CURRENT_SHOP, shopId);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};