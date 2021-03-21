import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './style.less';

@connect(({ login, loading }) => ({
  login,
  loading: loading.effects['login/login'],
}))

class NormalLoginForm extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			pwdActive: false
		};
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'login/login',
          payload: {
            mobile: values.mobile,
            password: values.password
          },
          callback: () => {}
        })
        localStorage.setItem('antd-pro-authority', '[admin]'); // auto reload
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { pwdActive } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
        <div id="owl-login"  className={classnames({'login-owl':true, 'password':pwdActive})}>
          <div className="hand"></div>
          <div className="hand hand-r"></div>
          <div className="arms">
            <div className="arm"></div>
            <div className="arm arm-r"></div>
          </div>
        </div>

        <Form.Item>
          {getFieldDecorator('mobile', {
            rules: [{ required: true, message: '请输入账号！' }],
          })(
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入账号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码！' }],
          })(
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入密码"
              onBlur={()=>this.setState({pwdActive: false})}
              onFocus={()=>this.setState({pwdActive: true})}
            />,
          )}
        </Form.Item>
        <Button size="large" loading={this.props.loading} type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default WrappedNormalLoginForm;