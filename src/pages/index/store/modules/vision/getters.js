/* eslint-disable no-unused-vars */
const getters = {
    willUploadCollection (state) {
        const collection = [];
        const photoList = state.photoStorage;
        const textList = state.textStorage;
        for (const index in photoList) {
            if (textList[index] === undefined) {
                break;
            }
            const currentPhoto = photoList[index];
            const currentText = textList[index];
            collection.push({
                name: currentText[0],
                gender: currentText[1],
                mobile: currentText[2],
                age: currentText[3],
                filename: currentPhoto.name,
                fileSize: currentPhoto.humanizedSize,
                fileObj: currentPhoto
            });
        }
        return collection;
    },
    hasUploadedCount (state) {
        const uploadedSignature = state.uploadedSignature;
        let count = 0;
        for (const index in uploadedSignature) {
            count++;
        }
        return count;
    },
    totalWillUploadCount (state, getters) {
        const willUploadCollection = getters.willUploadCollection;
        return willUploadCollection.length;
    }

};

export default getters;
