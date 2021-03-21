import request from '@/utils/request';

// 获取七牛签名
export async function getQiniuToken() {
  return request('/api/getQiniuToken');
}


// 上传七牛
export async function uploadQiniu(params) {
    return request('http://upload-z2.qiniup.com',{
        method: 'POST',
        data: params,
    });
 }
  