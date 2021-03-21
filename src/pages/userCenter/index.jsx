import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { uploadQiniu } from '@/utils/uploadQiniu';

import { EnvironmentOutlined, LockOutlined, ToolOutlined, UploadOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
  Modal,
  Card,
  Input,
  Upload,
  message,
  Divider,
  Button,
  Avatar,
  Spin,
  Row,
  Col,
  Typography,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Articles from './components/Articles';
import Contact from './components/Contact';
import TagsAdd from '../../components/TagsAdd';
import Reward from './components/Reward';
import styles from './style.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
  updateLoading: loading.effects['user/updateAvatar'],
  updatePwdLoading: loading.effects['user/updatePassword'],
}))


class Center extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      modalVisible: false,
      articleList: [],
      articleTotal: null,
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      imageUrl: null,
      updateAvatarFile: [],
      tabKey: '0'
    };
  }

  componentDidMount() {
    this.queryArticleTotal();
    this.queryArticleList();
  }


  // 获取自己发的文件数量 统计
  queryArticleTotal = () => {
    this.props.dispatch({
      type: 'user/getUserArticleTotal',
      callback: res => {
        this.setState({
          articleTotal: res.data
        })
      }
    })
  }

  // 查询自己发表的文章
  queryArticleList = () => {
    const { tabKey } = this.state;
    this.props.dispatch({
      type: 'user/getUserArticleList',
      payload: {
        type: tabKey !== '0' ? tabKey : null,
      },
      callback: res => {
        this.setState({
          articleList: res.data.list
        })

      }
    })
  }

  // 修改密码 打开
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  // 关闭模态框
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  //上传图片前 不顾产品反对,特意留个gif格式. 头像就是要gif才好玩
  handleImgBeforeUpload = (file, fileList, callback) => {
    if (file.type) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png';
      if (!isJPG) {
        message.error('只支持jpg、png、gif格式,请重新选择');
        return false;
      }
    } else {
      //大小写转换用名称进行判断
      let imgName = file.name ? file.name.toLowerCase() : '';
      if (!(imgName === 'jpg' || file.type === 'gif' || imgName === 'png')) {
        message.error('只支持jpg、png格式,请重新选择');
        return false;
      }
    }
    console.log('file', file);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小大于2M，请重新选择');
      return false;
    }
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener('load', res => {
      this.setState({
        updateAvatarFile: file,
      }, () => {
        callback();
      });
    });
    return false;
  };
  
  //上传头像图片方法
  changeupload = () => {
    uploadQiniu(this.props.dispatch,  this.state.updateAvatarFile, (res)=>{
      this.updateUserInfo({ avatar: res })
    })
  };

  //上传用户封面图片方法
  changeuploadCover = () => {
    uploadQiniu(this.props.dispatch,  this.state.updateAvatarFile, (res)=>{
      this.updateUserInfo({ cover: res })
    })
  };


  onTabChange = (key) => {
    this.setState({
      tabKey: key,
    }, () => {
      this.queryArticleList();
    });
  };


  // 修改密码
  handleEditPwd = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'user/updatePassword',
        payload: fieldsValue,
        callback: res => {
          message.success('修改成功, 请重新登录！')
          localStorage.setItem('loginInfo', null);
          localStorage.setItem('antd-pro-authority', null);
          router.replace({
            pathname: '/login',
          });
        }
      })
    })
  }

  // 添加标签组件 改变回调
  tagsChangeCallback = (value) => {
    let str = value.join();
    this.updateUserInfo({ tags: str })
  }

  // 更新用户信息方法 @payload  {url: xxx}
  updateUserInfo = (payload) => {
    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload,
      callback: (res) => {
        message.success('操作成功！')
      }
    })
  }


  userNameChange = str => {
    this.updateUserInfo({ userName: str })
  };

  autographChange = str => {
    this.updateUserInfo({ autograph: str })
  }

  postChange = str => {
    this.updateUserInfo({ post: str })
  }
  addressChange = str => {
    this.updateUserInfo({ address: str })
  }



  render() {

    const { isEdit, modalVisible, formLayout, tabKey, articleList, articleTotal } = this.state;
    const { form: { getFieldDecorator }, updateLoading, updatePwdLoading, user: { userInfo } } = this.props;

    const operationTabList = [
      {
        key: '0',
        tab: (
          <span>
            全部 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.js + articleTotal.sy + articleTotal.shh})</span>
          </span>
        ),
      },
      {
        key: '1',
        tab: (
          <span>
            技术 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.js})</span>
          </span>
        ),
      },
      {
        key: '2',
        tab: (
          <span>
            摄影 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.sy})</span>
          </span>
        ),
      },
      {
        key: '3',
        tab: (
          <span>
            生活 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.shh})</span>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <div className={styles.userCover} style={{ backgroundImage: `url(${userInfo && userInfo.cover})`}} >
            <div className={styles.editCover}>
            
              <Upload
                  name="avatar"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file, fileList) =>this.handleImgBeforeUpload(file, fileList, this.changeuploadCover)}
                  disabled={updateLoading}
                  accept="image/*"
                >
                  修改
                </Upload>
            
            </div>
        </div> 


        <Row gutter={24}>
          <Col lg={7} md={24}>

            <Card
              bordered={false}
              title="个人信息"
              style={{ marginBottom: 24 }}
              className={isEdit ? styles.userInfo : `${styles.hideActive} ${styles.userInfo}`}
              extra={<a onClick={() => this.setState({ isEdit: !this.state.isEdit })}>{isEdit ? '完成' : '修改'}</a>}
            >

              <div className={styles.avatarHolder}>
                {updateLoading && <Spin size="large" className={styles.updateLoading} />}
                <Avatar size={120} src={userInfo && userInfo.avatar} style={{ color: '#fff', backgroundColor: '#69c0ff' }}>
                  {userInfo && userInfo.userName}
                </Avatar>
                <Upload
                  name="avatar"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file, fileList)=>this.handleImgBeforeUpload(file, fileList, this.changeupload)}
                  disabled={updateLoading || !isEdit}
                  accept="image/*"
                >
                  {
                    isEdit &&
                    <>
                      <UploadOutlined style={{ marginRight: 5 }} />
                      更改头像
                    </>
                  }
                </Upload>
              </div>

              <div className={styles.detail}>
                <div style={{ textAlign: 'center' }}>
                  <Paragraph className={styles.name} editable={{ onChange: this.userNameChange }}>{userInfo && userInfo.userName}</Paragraph>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Paragraph className={styles.autograph} editable={{ onChange: this.autographChange }}>{userInfo && userInfo.autograph}</Paragraph>
                </div>

                <div className={styles.userOption}>
                  <ToolOutlined />
                  <Paragraph editable={{ onChange: this.postChange }}>{userInfo && userInfo.post}</Paragraph>
                </div>

                <div className={styles.userOption}>
                  <EnvironmentOutlined />
                  <i className={styles.group} />
                  <Paragraph editable={{ onChange: this.addressChange }}>{userInfo && userInfo.address}</Paragraph>
                </div>

                <Divider dashed />
                <div className={styles.tags}>
                  <div className={styles.tagsTitle}>标签</div>
                  <TagsAdd isEdit={isEdit} data={userInfo && userInfo.tags ? userInfo.tags.split(',') : []} callback={this.tagsChangeCallback} />
                </div>

                <Divider dashed />
                <div className={styles.tagsTitle}>联系方式</div>

                <div>
                  <Contact isEdit={isEdit} />
                </div>

                <Divider dashed />
                <div className={styles.tagsTitle}>赞赏码</div>

                <div>
                  <Reward isEdit={isEdit} />
                </div>

                

                <Divider dashed />
                <div className={styles.tagsTitle}>密码</div>

                <p>
                  <LockOutlined style={{ marginRight: 10 }} />
                  ******
                  {
                    isEdit &&
                    <Button style={{ marginLeft: 20 }} type="primary" onClick={this.showModal}>
                      更改密码
                    </Button>
                  }
                </p>
              </div>
            </Card>

            <Modal
              title="更改密码"
              width={500}
              destroyOnClose
              visible={modalVisible}
              okText="保存"
              onOk={this.handleEditPwd}
              onCancel={this.handleCancel}
              maskClosable={false}
              confirmLoading={updatePwdLoading}
            >
              <Form onSubmit={this.handleEditPwd}>
                <FormItem label="旧密码" {...formLayout}>
                  {getFieldDecorator('oldPassword', {
                    rules: [{ required: true, message: '旧密码不能为空' }],
                    initialValue: '',
                  })(<Input.Password placeholder="请输入旧密码" />)}
                </FormItem>
                <FormItem label="新密码" {...formLayout}>
                  {getFieldDecorator('newPassword', {
                    rules: [
                      { required: true, message: '新密码不能为空' },
                      { message: '密码长度应为6~20位之间', min: 6, max: 20 },
                    ],
                    initialValue: '',
                  })(<Input.Password placeholder="请输入新密码（6~20位）" />)}
                </FormItem>
              </Form>
            </Modal>
          </Col>


          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              <Articles data={articleList} />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

const CenterForm = Form.create()(Center);
export default CenterForm;


