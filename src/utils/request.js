/* eslint-disable prefer-template */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {
  extend
} from 'umi-request';
import {
  notification,
} from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序 网络层
 */

const errorHandler = error => {
  const {
    response
  } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {
      status,
      url
    } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};


/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'omit' // 'include', 带上cookie七牛会跨域
});


// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let token = null;
  if (JSON.parse(localStorage.getItem('loginInfo'))) {
    // egg-jwt 切记 token 不要直接发送，要在前面加上 Bearer 字符串和一个空格 解密不能用直接verify要变结合设置的'Bearer ', 我他妈找了好久，才解决这个坑！ authorization.split(' ')[1]！！！！
    token = 'Bearer ' + JSON.parse(localStorage.getItem('loginInfo')).token
  }

  const headers = {
    'Authorization': token
  };
  return ({
    url,
    options: {
      ...options,
      headers
    },
  });

})

// response拦截器, 处理response
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  try {
    if (data && data.code && data.code !== 200) {
      notification.error({
        description: data.msg,
        message: '请求失败',
      });

      if (data.code === 401) {
        localStorage.setItem('loginInfo', null);
        localStorage.setItem('antd-pro-authority', null);
        router.push(`/login`);
      }
    }

  } catch (err) {
    console.log(err)
  }

  return response;
})

export default request;
