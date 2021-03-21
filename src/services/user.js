import request from '@/utils/request';
import { stringify } from 'querystring';


// 获取用户信息 userId
export async function queryUserInfo() {
  return request(`/api/getUserInfo`);
}

export async function updateAvatar(params) {
  return request(`/api/uploadAvatar`, {
    method: 'POST',
    data: params,
  });
}

export async function updatePassword(params) {
  return request(`/api/updatePassword`, {
    method: 'POST',
    data: params,
  });
}


// 跟新用户信息
export async function updateUserInfo(params) {
  return request(`/api/updateUserInfo`, {
    method: 'POST',
    data: params,
  });
}

// 获取当前用户所发表的文章
export async function getUserArticleList(params) {
  return request(`/api/getUserArticleList?${stringify(params)}`);
}

// 获取当前用户所发表的文章 统计
export async function getUserArticleTotal() {
  return request(`/api/getUserArticleTotal`);
}



// 上传联系方式的二维码
export async function uploadCode(params) {
  return request(`/api/uploadCode`, {
    method: 'POST',
    data: params,
  });
}

// 新增、编辑联系方式
export async function addEditContact(params) {
  return request(`/api/addEditContact`,{
    method: 'POST',
    data: params,
  });
}


// 删除联系方式
export async function delContact(params) {
  return request(`/api/delContact`,{
    method: 'POST',
    data: params,
  });
}


// 上传赞赏码
export async function uploadRewardCode(params) {
  return request(`/api/uploadRewardCode`, {
    method: 'POST',
    data: params,
  });
}

// 新增、编辑赞赏码
export async function addEditReward(params) {
  return request(`/api/addEditReward`,{
    method: 'POST',
    data: params,
  });
}


