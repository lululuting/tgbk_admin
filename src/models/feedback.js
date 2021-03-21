import { getFeedbackList } from '@/services/feedback';
export default {
  namespace: 'feedback',
  state: {
   
  },
  effects: {
    *getFeedbackList({ payload, callback }, { call }) {
      const response = yield call(getFeedbackList, payload);
      if (response && response.code == 200) {
        callback(response)
      }
    },
  }
};
