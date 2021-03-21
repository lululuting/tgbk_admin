import router from 'umi/router';
import { login, logout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);

      if (response.code == 200) {

        // Login 权限 单权限需求 用admin即可
        yield put({
          type: 'changeLoginStatus',
          payload: response
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      }
    },

    *logout({ payload }, { call }) {
      // jwt 机制的 token无法100%失效 所以登出功能不请求接口了

      // const response = yield call(logout, payload);
      // if (response.code == 200) {

        const { redirect } = getPageQuery(); // Note: There may be security issues, please note

        if (window.location.pathname !== '/login' && !redirect) {

          localStorage.setItem('loginInfo', null);
          localStorage.setItem('antd-pro-authority', null);
          // localStorage.setItem('loginInfo', null);

          router.replace({
            pathname: '/login',
          });
        }
      // }

    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      localStorage.setItem('loginInfo', JSON.stringify(payload.data));
      return { ...state, status: 'ok', type: 'account' };
    },
  },
};
export default Model;
