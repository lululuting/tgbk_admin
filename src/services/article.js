import request from '@/utils/request';
import { stringify } from 'querystring';


// 获取文章列表
export async function getArticleList(params) {
  return request(`/api/getArticleList?${stringify(params)}`);
}

// 获取文章总数
export async function getArticleTotal() {
  return request(`/api/getArticleTotal`);
}

// 获取文章详情
export async function getArticleInfo(params) {
  return request(`/api/getArticleInfo?${stringify(params)}`);
}


// 删除
export async function delArticle(params) {
  return request(`/api/delArticle`, {
    method: 'POST',
    data: params,
  });
}


// 添加或修改文章
export async function addEditArticle(params) {
  return request(`/api/addEditArticle`, {
    method: 'POST',
    data: params,
  });
}

// 上传
export async function upload(params) {
  return request(`/api/uploadArticleImg`, {
    method: 'POST',
    data: params,
  });
}


