import { getQiniuToken, uploadQiniu } from '@/services/qiniuyun';
export default {
  namespace: 'qiniuyun',
  state: {

  },
  effects: {
    *getQiniuToken({ payload, callback }, { call }) {
      const response = yield call(getQiniuToken, payload);
      if (response && response.code == 200) {
        callback(response)
      }
    },
    
    *uploadQiniu({ payload, callBack }, { call }) {
        const response = yield call(uploadQiniu, payload);
        if (response) {
            callBack(response)
        }
      },
  },
  reducers: {

  },
};
