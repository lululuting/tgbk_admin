import request from '@/utils/request';
import { stringify } from 'querystring';


// 获取banner列表
export async function getBannerList(params) {
  return request(`/api/getBannerList?${stringify(params)}`);
}


// 获取banner列表
export async function getPreviewBanner() {
  return request(`/api/getPreviewBanner`);
}


// 删除
export async function delBanner(params) {
  return request(`/api/delBanner`, {
    method: 'POST',
    data: params,
  });
}

// 添加或修改banner
export async function addEditBanner(params) {
  return request(`/api/addEditBanner`, {
    method: 'POST',
    data: params,
  });
}

// 上传
export async function upload(params) {
  return request(`/api/uploadBanner`, {
    method: 'POST',
    data: params,
  });
}


