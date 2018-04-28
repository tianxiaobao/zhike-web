import {
    uploadFile,
    getStatistic,
    getSlideShow,
    getInfoList,
    updateInfo,
    deleteInfo,
    getHistorySearch,
    getHistoryStatistic
} from '../../../../../../src/apis/vision';

const actions = {
    postUploadFile ({state, rootGetters}, formData) {
        formData.append('shop_id', rootGetters.currentShop.id);
        formData.append('mall_id', rootGetters.currentShop.mallId);
        return uploadFile(formData);
    },
    resetUpload ({commit}) {
        commit('resetUploadedSignature');
        commit('updateNextUploadedIndex', -1);
        commit('updateTextStorage', []);
        commit('updatePhotoStorage', []);
    },
    getStatistic ({commit, rootGetters}) {
        return getStatistic({
            'shop_id': rootGetters.currentShop.id,
            'mall_id': rootGetters.currentShop.mallId
        }).then(data => {
            commit('updateStatistic', JSON.parse(data['result_data']));
        });
    },
    getSlideShow ({rootGetters}, data) {
        if (!!!data) data = {id: -1};
        return getSlideShow({
            ...data,
            'shop_id': rootGetters.currentShop.id,
            'mall_id': rootGetters.currentShop.mallId
        });
    },
    getInfoList ({commit, rootGetters}, params) {
        return getInfoList({
            ...params,
            'shop_id': rootGetters.currentShop.id,
            'mall_id': rootGetters.currentShop.mallId
        }).then(data => {
            const resultObj = data['result_data'];
            // console.log(resultObj);
            commit('updateInfoList', resultObj);
            commit('updateInfoCount', data.total);
        });
    },
    updateInfo ({rootGetters}, formData) {
        formData.append('shop_id', rootGetters.currentShop.id);
        formData.append('mall_id', rootGetters.currentShop.mallId);

        return updateInfo(formData);
    },
    deleteInfo ({rootGetters}, formData) {
        formData.append('shop_id', rootGetters.currentShop.id);
        formData.append('mall_id', rootGetters.currentShop.mallId);
        return deleteInfo(formData);
    },
    // 历史检索
    getHistorySearch ({rootGetters, commit}, params) {
        return getHistorySearch({
            ...params,
            'shop_id': rootGetters.currentShop.id,
            'mall_id': rootGetters.currentShop.mallId
        }).then(data => {
            commit('updateHistoryData', data['result_data']);
        });
    },
    // 历史统计面板
    getHistoryStatistic ({rootGetters, commit}, params) {
        return getHistoryStatistic({
            ...params,
            'shop_id': rootGetters.currentShop.id,
            'mall_id': rootGetters.currentShop.mallId
        }).then(data => {
            commit('updateHistoryStatistic', data['result_data']);
        });
    }

};

export default actions;
