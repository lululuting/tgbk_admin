import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {

        let userId = null;
        if (JSON.parse(localStorage.getItem('loginInfo'))) {
          userId = JSON.parse(localStorage.getItem('loginInfo')).userId
        }

        dispatch({
          type: 'login/logout',
          payload: {
            userId
          }
        });
      }

      return;
    }

    router.push(`/login`);
  };

  render() {
    const { currentUser } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.userName}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }
}

export default connect(({ login,user }) => ({
  currentUser: user.userInfo,
}))(AvatarDropdown);
