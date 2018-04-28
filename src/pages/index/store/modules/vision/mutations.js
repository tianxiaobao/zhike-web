import Vue from 'vue';

const mutations = {
    updateGroupId (state, group) {
        state.groupId = group;
    },
    updateStep (state, step) {
        state.step = step;
    },
    updatePhotoStorage (state, photoStorage) {
        state.photoStorage = photoStorage;
    },
    addPhotoStorage (state, additionPhotos) {
        const temp = [];
        for (let index = 0; index < additionPhotos.length; index++) {
            temp.push(additionPhotos[index]);
        }
        state.photoStorage.splice(state.photoStorage.length, 0, ...temp);
    },
    splicePhotoStorage (state, {index, willDelete, willInsert}) {
        if (willInsert === undefined) {
            state.photoStorage.splice(index, willDelete);
        } else {
            state.photoStorage.splice(index, willDelete, willInsert);
        }
    },
    spliceTextStorage (state, {index, willDelete, willInsert}) {
        if (willInsert === undefined) {
            state.textStorage.splice(index, willDelete);
        } else {
            state.textStorage.splice(index, willDelete, willInsert);
        }
    },
    updateTextStorage (state, textStorage) {
        state.textStorage = textStorage;
    },
    updateNextUploadedIndex (state, nextUploadedIndex) {
        state.nextUploadedIndex = nextUploadedIndex;
    },
    resetUploadedSignature (state) {
        state.uploadedSignature = {};
    },
    updateUploadedSignature (state, index) {
        Vue.set(state.uploadedSignature, index, true);
    },
    updateStatistic (state, statistic) {
        state.statistic = statistic;
    },

    updateInfoList (state, list) {
        state.infoList = list;
    },
    updateInfoCount (state, count) {
        state.infoCount = count;
    },

    updateHistoryViewType (state, historyViewType) {
        state.historyViewType = historyViewType;
    },
    updateHistoryUuid (state, historyUuid) {
        state.historyUuid = historyUuid;
    },
    updateHistoryData (state, historyData) {
        state.historyData = historyData;
    },
    updateHistoryStatistic (state, historyStatistic) {
        state.historyStatistic = historyStatistic;
    }
};

export default mutations;
