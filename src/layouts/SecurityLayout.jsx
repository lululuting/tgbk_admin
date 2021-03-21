import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });

    const { dispatch } = this.props;
    
    // let userId = null;
    // if (JSON.parse(localStorage.getItem('loginInfo'))) {
    //   userId = JSON.parse(localStorage.getItem('loginInfo')).userId
    // }
    // if (dispatch && userId) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 判断 loginInfo 是否存在
    // const isLogin = JSON.parse(localStorage.getItem('loginInfo'));
    // const queryString = stringify({
    //   redirect: window.location.href,
    // });

    // if ((!isLogin && loading) || !isReady) {
    //   return <PageLoading />;
    // }

    // if (!isLogin) {
    //   return <Redirect to={`/login?${queryString}`}></Redirect>;
    // }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.userInfo,
  loading: loading.models.user,
}))(SecurityLayout);
