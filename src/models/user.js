import { 
  queryUserInfo, 
  updateAvatar, 
  updatePassword,
  updateUserInfo, 
  getUserArticleList, 
  getUserArticleTotal, 
  uploadCode, 
  addEditContact, 
  delContact,
  uploadRewardCode,
  addEditReward
} from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    userInfo: {},
  },
  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryUserInfo, payload);
      if (response && response.code == 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
   *updateAvatar({ payload, callback }, { call, put, select }) {
      const response = yield call(updateAvatar, payload);
      if (response && response.code == 200) {
        callback(response)
      }
    },
    *updatePassword({ payload, callback }, { call, put }) {
      const response = yield call(updatePassword, payload);
      if (response.code == 200) {
        callback(response)
      }
    },
    *getUserArticleList({ payload, callback }, { call, put }) {
      const response = yield call(getUserArticleList, payload);
      if (response.code == 200) {
        callback(response)
      }
    },
    *getUserArticleTotal({ payload, callback }, { call, put }) {
      const response = yield call(getUserArticleTotal, payload);
      if (response.code == 200) {
        callback(response)
      }
    },


    *updateUserInfo({ payload, callback }, { call, put, select }) {
      const response = yield call(updateUserInfo, payload);
      if (response.code == 200) {

         // 重新查询用户信息
         yield put({
          type:'fetchCurrent',
          payload: {
            id: yield select((state)=>state.user.userInfo.userId )
          }
        })

        callback(response)
      }
    },
    *uploadCode({ payload, callback }, { call, put, select }) {
      const response = yield call(uploadCode, payload);
      if (response.code == 200) {
        callback(response)
      }
    },

    
    *addEditContact({ payload, callback }, { call, put, select }) {
      const response = yield call(addEditContact, payload);
      if (response.code == 200) {

         // 重新查询用户信息
         yield put({
          type:'fetchCurrent',
          payload: {
            id: yield select((state)=>state.user.userInfo.userId )
          }
        })

        callback(response)
      }
    },

    
    *delContact({ payload, callback }, { call, put, select }) {
      const response = yield call(delContact, payload);
      if (response.code == 200) {

        // 重新查询用户信息
        yield put({
          type:'fetchCurrent',
          payload: {
            id: yield select((state)=>state.user.userInfo.userId )
          }
        })

        callback(response)
      }
    },

    *uploadRewardCode({ payload, callback }, { call, put, select }) {
      const response = yield call(uploadRewardCode, payload);
      if (response.code == 200) {

        callback(response)
      }
    },
    *addEditReward({ payload, callback }, { call, put, select }) {
      const response = yield call(addEditReward, payload);
      if (response.code == 200) {

         // 重新查询用户信息
         yield put({
          type:'fetchCurrent',
          payload: {
            id: yield select((state)=>state.user.userInfo.userId )
          }
        })

        callback(response)
      }
    },
    
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, userInfo: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
