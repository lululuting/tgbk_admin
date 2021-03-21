import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router'; // 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="没有这个页面"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        返回主页
      </Button>
    }
  ></Result>
);

export default NoFoundPage;
