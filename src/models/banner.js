import { getBannerList, getPreviewBanner, addEditBanner,delBanner, upload } from '@/services/Banner';
export default {
  namespace: 'banner',
  state: {

  },
  effects: {
    *getBannerList({ payload, callback }, { call }) {
      const response = yield call(getBannerList, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *getPreviewBanner({ payload, callback }, { call }) {
      const response = yield call(getPreviewBanner, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *addEditBanner({ payload, callback }, { call }) {
      const response = yield call(addEditBanner, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *delBanner({ payload, callback }, { call }) {
      const response = yield call(delBanner, payload);
      if (response && response.code == 200) {
        callback(response)
      }
    },
    *uploadImg({ payload, callback }, { call }) {
      const response = yield call(upload, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },

   
    

  },
  reducers: {

  },
};
