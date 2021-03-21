import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  CameraOutlined,
  CoffeeOutlined,
  ExperimentOutlined,
  PlusOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Card, Row, Col, List, message, Radio, Button, Avatar, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ article, user, loading }) => ({
  article,
  currentUser: user.userInfo, // 当前用户
  listLoading: loading.effects['article/getArticleList'],
}))


class Article extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articleTotal: null,
      dataList: [],

      type: null,
      page: 1,
      limit: 10,
      dataTotal: 0,
    };
  }

  componentDidMount() {
    this.queryTotal();
    this.queryList();
  }

  // 查询总数 
  queryTotal = () => {
    this.props.dispatch({
      type: 'article/getArticleTotal',
      callback: res => {
        this.setState({
          articleTotal: res.data,
        })
      }
    })
  }

  // 查询列表 
  queryList = () => {
    this.props.dispatch({
      type: 'article/getArticleList',
      payload: {
        type: this.state.type,
        page: this.state.page,
        limit: this.state.limit,
      },
      callback: res => {
        this.setState({
          dataList: res.data.list,
          dataTotal: res.data.total
        })
      }
    })
  }


  // 添加文章
  addArticle = () => {
    router.push('/articleDetails/articleEdit');
  }


  // 编辑
  editArticle = (id) => {
    router.push({
      pathname: '/articleDetails/articleEdit',
      query: {
        id,
      },
    });
  }


  // 删除
  deleteArticle = (id) => {
    Modal.confirm({
      title: '删除文章',
      content: '确定删除该文章吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'article/delArticle',
          payload: {
            id,
          },
          callback: (res) => {
            message.success('删除成功！');
            this.queryList();
            this.queryTotal();
          }
        })
      },
    });

  };

  // 切换类型查询
  typeChange = (e) => {

    let type = e.target.value == 0 ? null : e.target.value;

    this.setState({
      type,
      page: 1,
    }, () => {
      this.queryList()
    })
  }



  render() {
    const { articleTotal, dataList, page, limit, dataTotal } = this.state;
    const { listLoading, currentUser } = this.props;


    console.log(this.props)
    const extraContent = (
      <div>
        <RadioGroup defaultValue="0" onChange={this.typeChange}>
          <RadioButton value="0">全部</RadioButton>
          <RadioButton value="1">技术</RadioButton>
          <RadioButton value="2">摄影</RadioButton>
          <RadioButton value="3">生活</RadioButton>
        </RadioGroup>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: page,
      pageSize: limit,
      total: dataTotal,
      onChange: (page) => {
        this.setState({
          page,
        }, () => {
          this.queryList();
        })
      },
      onShowSizeChange: (current, limit) => {
        this.setState({
          limit
        }, () => {
          this.queryList();
        })
      },

    };

    return (
      <PageHeaderWrapper>

        <div className={styles.articList}>
          <Card bordered={false}>
            <Row>
              <Col sm={6} xs={24} className={styles.typeBox} >
                <p className={styles.typeTitle}><ProfileOutlined /> 全部</p>
                <p className={styles.typeNum}><a>{articleTotal && articleTotal.js + articleTotal.sy + articleTotal.shh}</a> 篇</p>
              </Col>
              <Col sm={6} xs={24} className={styles.typeBox}>
                <p className={styles.typeTitle}><ExperimentOutlined /> 技术</p>
                <p className={styles.typeNum}><a>{articleTotal && articleTotal.js}</a> 篇</p>

              </Col>
              <Col sm={6} xs={24} className={styles.typeBox}>
                <p className={styles.typeTitle}><CameraOutlined /> 摄影</p>
                <p className={styles.typeNum}><a>{articleTotal && articleTotal.sy}</a> 篇</p>

              </Col>
              <Col sm={6} xs={24} className={styles.typeBox} style={{ borderRight: 'none' }}>
                <p className={styles.typeTitle}><CoffeeOutlined /> 生活</p>
                <p className={styles.typeNum}><a>{articleTotal && articleTotal.shh}</a> 篇</p>

              </Col>
            </Row>
          </Card>

          <Card
            title="文章列表"
            bordered={false}
            style={{ marginTop: 24 }}
            className={styles.listCard}
            extra={extraContent}

          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon={<PlusOutlined />}
              onClick={this.addArticle}
            >
              添加
          </Button>

            <List
              size="large"
              rowKey="id"
              loading={listLoading}
              pagination={paginationProps}
              dataSource={dataList}
              renderItem={item => (
                <List.Item
                  // 当前博主只可以对自己的的文章进行编辑和删除 ，除非是超管
                  actions={
                    currentUser && ~~currentUser.id === ~~item.userId || (~~currentUser.auth === 2) ?
                      [
                        <a onClick={e => {
                          e.preventDefault();
                          this.editArticle(item.id)
                        }}
                        >编辑</a>,
                        <a
                          onClick={e => {
                            e.preventDefault();
                            this.deleteArticle(item.id)
                          }}
                        >删除</a>,
                      ]
                      : [
                        <a
                          onClick={e => {
                            e.preventDefault();
                            this.editArticle(item.id)
                          }}
                        >
                          预览
                        </a>
                      ]
                  }
                >
                  <List.Item.Meta
                    avatar={item.cover && <Avatar src={item.cover} shape="square" />}
                    title={<a>{item.title}</a>}
                    description={item.introduce}
                  />


                  <div className={styles.listContent}>
                    <div className={styles.listContentItem}>
                      <span>View</span>
                      <p>{item.viewCount}</p>
                    </div>

                    <div className={styles.listContentItem}>
                      <span>Like</span>
                      <p>{item.likeCount}</p>
                    </div>

                    <div className={styles.listContentItem}>
                      <span>Author</span>
                      <p>{item.userName}</p>
                    </div>

                    <div className={styles.listContentItem}>
                      <span>状态</span>
                      <p>
                        {
                          ~~item.status == 0 ?
                          <Badge status="processing" text="公开" />
                          :
                          <Badge status="error" text="隐藏" />
                        }
                      </p>
                    </div>

                    <div className={styles.listContentItem}>
                      <span>CreateTime</span>
                      <p>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</p>
                    </div>
                  </div>

                </List.Item>
              )}
            />


          </Card>

        </div>
      </PageHeaderWrapper>
    );
  }
}

const ArticleForm = Form.create()(Article);
export default ArticleForm;
