import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';

const AuthComponent = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { routes = [] } = route;
  const isLogin = JSON.parse(localStorage.getItem('loginInfo'));
  console.log(123123)

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }) => ({
  user,
}))(AuthComponent);
