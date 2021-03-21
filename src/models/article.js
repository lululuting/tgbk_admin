import { getArticleList, getArticleTotal, getArticleInfo, addEditArticle,delArticle, upload } from '@/services/article';
const GlobalModel = {
  namespace: 'article',
  state: {

  },
  effects: {
    *getArticleList({ payload, callback }, { call }) {
      const response = yield call(getArticleList, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *getArticleTotal({ payload, callback }, { call }) {
      const response = yield call(getArticleTotal, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *getArticleInfo({ payload, callback }, { call }) {
      const response = yield call(getArticleInfo, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *addEditArticle({ payload, callback }, { call }) {
      const response = yield call(addEditArticle, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *delArticle({ payload, callback }, { call }) {
      const response = yield call(delArticle, payload);
      if (response && response.code == 200) {
        callback(response)
      }
    },
    *uploadCover({ payload, callback }, { call }) {
      const response = yield call(upload, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },
    *uploadMdImg({ payload, callback }, { call }) {
      const response = yield call(upload, payload);

      if (response && response.code == 200) {
        callback(response)
      }
    },

  },
  reducers: {

  },
};
export default GlobalModel;
