import request from '@/utils/request';
import { stringify } from 'querystring';


// 登录
export async function login(params) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}

// 退出登录
export async function logout(params) {
  return request(`/api/logout?${stringify(params)}`);
}
