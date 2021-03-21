import React, { Component } from 'react';
import { connect } from 'dva';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { uploadQiniu } from '@/utils/uploadQiniu';
import { CheckOutlined, PictureOutlined } from '@ant-design/icons';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible'; // v4兼容包
import '@ant-design/compatible/assets/index.css';
import { Modal, Card, Row, Col, Button, Select, Upload, Input, message, Switch } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Vditor from 'vditor'
import Prompt from 'umi/prompt';
import TagsAdd from '../../components/TagsAdd';
import styles from './style.less';
import "vditor/dist/index.css"

const imageUrlBoxCss = {
  display: 'flex',
  justifTyContent: 'centeIr',
  alignItems: 'center',
  marginTop: '10px',
}

const imageUrlCss = {
  flex: '1',
  marginRight: '10px',
  height: '32px',
}

const listener = e => {
  e.preventDefault();
  e.returnValue = '离开当前页后，所编辑的数据将不可恢复' // 浏览器有可能不会提示这个信息，会按照固定信息提示
}

@connect(({ article, qiniuyun, loading }) => ({
  article,
  loading: loading.models.user,
  uploading: loading.effects['qiniuyun/getQiniuToken'] || loading.effects['qiniuyun/uploadQiniu'],
  submitLoading: loading.effects['article/addEditArticle'],
}))

class ArticleEdit extends Component {
  constructor(props) {


    super(props);
    this.state = {
      currentItem: null,
      coverList: [],
      previewImage: '',
      previewVisible: false,
      uploadImageVisible: false, // 上传图片模态框
      uploadImageUrl: null,	// 上传图片地址
      // 上传设置
      uploadProps: {
        name: 'file',
        style: { marginRight: 20 },
        showUploadList: false,
        beforeUpload: file => {
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
          if (!isJpgOrPng) {
            message.error('老铁你检查一下是不是JPG/PNG/Gif的图片文件!');
            return false
          }
        },
        customRequest: this.upLoadImgFn,
      },
    };
  }

  init = (content) => {
    this.vditor = new Vditor('vditor', {
      height: '100vh',
      minHeight: 800,
      icon: "ant",
      toolbarConfig: {
        pin: true,
      },
      mode: "sv",
      preview: {
        mode: "both",
        actions: [
          "desktop",
          "mobile",
          "mp-wechat",
          "zhihu",
        ],
        hljs: {
          style: "native",
        }
      },
      outline: true, // 大纲
      placeholder: "请开始你的表演...",
      cache: {
        enable: false,
      },
      after: () => {
        this.vditor.setValue(content ? content : '');
      },
      toolbar: [
        "emoji",
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        {
          name: 'upload-imges',
          tipPosition: 'ne',
          tip: '上传图片',
          className: 'right',
          icon: '<svg t="1607674631100" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13956" width="200" height="200"><path d="M52.736 128.512c-9.216 2.56-20.992 11.264-25.6 18.432-8.704 12.8-9.216 37.888-9.216 350.208 0 361.472-0.512 355.328 26.624 367.616 8.704 4.096 110.08 5.632 337.408 5.632h324.608l-17.92-26.112c-22.016-31.744-33.28-68.608-33.28-107.52 0-33.28 15.872-88.064 30.72-107.008l9.728-12.8-36.864-37.376-36.864-37.376L552.96 614.4l-69.12 71.68-94.208-117.76-94.72-117.76-93.696 140.8-93.696 140.8h-40.96V174.08H896v367.104l19.456 6.144c10.24 3.584 22.016 7.68 25.6 8.704 4.608 2.56 6.144-38.912 6.144-196.096 0-175.616-1.024-200.192-8.192-210.944-18.944-26.624-11.264-26.112-456.192-25.6-240.64 0-420.864 2.56-430.08 5.12z" p-id="13957"></path><path d="M693.76 270.848c-24.064 6.144-36.864 14.336-52.224 34.816-11.264 14.848-14.336 24.576-15.872 52.224-1.536 28.672 0 36.352 10.24 51.712 18.432 27.648 51.2 42.496 87.04 39.424 55.296-4.608 82.944-34.304 82.944-88.064 0-18.944-3.584-37.376-9.216-47.616-16.384-31.744-65.024-51.712-102.912-42.496zM794.112 589.312c-75.264 29.696-114.176 116.224-89.6 199.68 11.776 39.936 59.392 87.04 100.352 98.816 62.976 17.92 121.856 4.096 163.328-38.4 33.792-34.816 47.104-71.68 44.544-122.368-3.584-60.928-31.744-104.96-83.456-132.096-36.352-18.432-96.256-20.992-135.168-5.632z m103.424 99.328l39.936 43.52h-57.344l1.536 56.32 1.536 56.32h-53.76V732.672l-26.624-1.536-26.624-1.536 37.888-42.496c20.992-23.04 38.912-41.984 40.448-41.984 2.048 0 20.992 19.456 43.008 43.52z" p-id="13958"></path></svg>',
          click: () => {
            this.showUpdataModel()
          },
        },
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "both",
        "preview",
        "edit-mode",
        "outline",
        "|",
        {
          name: 'vditor-theme',
          tipPosition: 'ne',
          tip: '编辑器主题',
          className: 'right',
          icon: '<svg t="1607672328360" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3215" width="200" height="200"><path d="M465.499307 1021.354667c-21.504 0-44.117333-2.048-68.693334-5.12l-6.144-1.024c-174.336-26.624-293.290667-195.925333-298.410666-203.093334C-76.026027 555.776 8.11264 296.277333 167.08864 152.661333 325.04064 9.045333 588.635307-52.48 819.37664 133.205333c148.736 119.978667 193.877333 286.122667 195.925333 293.290667v2.048c21.504 116.906667 4.096 203.093333-52.309333 258.474667-86.186667 83.114667-228.693333 56.405333-248.234667 52.309333-26.709333-3.072-46.165333 5.12-60.501333 22.528-15.36 19.456-18.432 45.141333-13.312 60.501333 14.336 43.093333 16.384 75.861333 6.144 100.522667-29.781333 64.682667-90.282667 98.474667-181.589333 98.474667z m-65.621334-67.669334l6.144 1.024c99.498667 15.36 160-4.096 184.576-59.477333 0-1.024 5.12-14.336-8.192-55.381333-13.312-36.949333-3.072-85.162667 23.552-117.930667 27.733333-34.901333 68.693333-50.261333 116.906667-45.141333l3.072 1.024c1.024 0 128.170667 27.648 193.877333-35.925334 40.021333-38.997333 52.309333-106.666667 34.901334-201.045333-4.096-13.312-48.213333-157.952-175.36-259.498667C578.309973 17.322667 347.56864 71.68 208.04864 197.802667 79.877973 314.709333-14.500693 537.258667 143.451307 778.325333c1.024 0 108.714667 153.856 256.426666 175.36z m0 0" p-id="3216"></path><path d="M158.89664 538.282667c0 33.962667 27.562667 61.525333 61.525333 61.525333s61.525333-27.562667 61.525334-61.525333-27.562667-61.525333-61.525334-61.525334c-34.048 0-61.525333 27.562667-61.525333 61.525334z m71.765333-184.576c0 33.962667 27.562667 61.525333 61.525334 61.525333s61.525333-27.562667 61.525333-61.525333-27.562667-61.525333-61.525333-61.525334-61.525333 27.562667-61.525334 61.525334z m184.576-102.570667c0 33.962667 27.562667 61.525333 61.525334 61.525333s61.525333-27.562667 61.525333-61.525333-27.562667-61.525333-61.525333-61.525333-61.525333 27.562667-61.525334 61.525333z m205.141334 51.285333c0 33.962667 27.562667 61.525333 61.525333 61.525334s61.525333-27.562667 61.525333-61.525334-27.562667-61.525333-61.525333-61.525333-61.525333 27.562667-61.525333 61.525333z m102.570666 164.096c0 33.962667 27.562667 61.525333 61.525334 61.525334s61.525333-27.562667 61.525333-61.525334-27.562667-61.525333-61.525333-61.525333-61.525333 27.562667-61.525334 61.525333z m0 0" p-id="3217"></path></svg>',
          toolbar: [
            {
              icon: 'classic 亮白',
              click: () => { this.vditor.setTheme('classic') },
            },
            {
              icon: 'dark 暗黑',
              click: () => { this.vditor.setTheme('dark') },
            },
          ]
        },
        "content-theme",
        "code-theme",
        "export",
        "fullscreen",
        "|",
        "info",
        "devtools",
        "help",
      ],
      counter: {
        enable: true
      },
    })
  }

  componentDidMount() {
    // 判断是否新增编辑， 新增没有id传过来，编辑有
    if (this.props.location.query.id) {
      this.props.dispatch({
        type: 'article/getArticleInfo',
        payload: {
          id: this.props.location.query.id
        },
        callback: res => {
          this.setState({
            currentItem: res.data,
            coverList: res.data.cover ? [{
              uid: res.data.id,
              name: 'cover.png',
              status: 'done',
              url: res.data.cover,
            }] : [],
          })
          this.init(res.data.content)
        }
      })
    } else {
      this.init()
    }

    window.addEventListener('beforeunload', listener)

  }

  componentWillUnmount() {
    // 离开注销监听事件
    window.removeEventListener('beforeunload', listener)
  }

  // 调取父组件回调
  callBackFn = () => {
    return this.props.callBack && this.props.callBack(this.props.id, this.vditor.getValue());
  }

  handleCancel = () => {
    this.setState({
      uploadImageVisible: false,
    }, () => {
      this.setState({
        uploadImageUrl: null
      })
    })
  }

  // 编辑提交
  handleOk = () => {
    const { dispatch, form, location } = this.props;
    const { coverList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      // 编辑 新增
      if (location.query.id) {
        fieldsValue.id = location.query.id
      }

      // 封面
      fieldsValue.cover = coverList && coverList[0] ? coverList[0].url : null;

      // 状态
      fieldsValue.status = fieldsValue.status ? '0' : '1';

      // 新增编辑文章
      const uploadArticle = (cover) => {
        if (cover) {
          fieldsValue.cover = cover;
        }
        if (!fieldsValue.cover) {
          message.error('必须要有封面！')
          return
        }
        fieldsValue.content = this.vditor.getValue();
        fieldsValue.tags = this.tagsRef.state.tags.join();

        return new Promise((resolve =>
          dispatch({
            type: 'article/addEditArticle',
            payload: fieldsValue,
            callback: res => {
              message.success('成功')
              this.setState({
                coverList: [{
                  uid: fieldsValue.id,
                  name: 'cover.png',
                  status: 'done',
                  url: fieldsValue.cover,
                }],
              })
              resolve(res);
            }
          })
        ))
      }

      // 判断封面是否更改
      if (coverList && coverList[0] && coverList[0].size) {
        uploadQiniu(dispatch, coverList[0], uploadArticle)
        return
      }

      uploadArticle()
    })
  }


  // 打开上传图片模态框
  showUpdataModel = () => {
    this.setState({
      uploadImageVisible: true,
    })
  }

  // 上传函数
  upLoadImgFn = (fileList) => {
    if (!fileList.file) return
    uploadQiniu(this.props.dispatch, fileList.file, (res) => {
      this.setState({
        uploadImageUrl: `![${fileList.file.name || 'image'}](${res})`
      })
      message.success('图片上传成功！')
    })
  }


  // 复制 图片上传地址
  onCopy1 = (text) => {
    if (text === this.state.uploadImageUrl) {
      message.success('复制成功！')
    } else {
      message.warning('复制失败！请手动复制')
    }
  }


  // 解析为base64位 
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    // 读取文件
    reader.readAsDataURL(img);
  }

  // // 图片预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const {
      currentItem,
      coverList,
      previewVisible,
      previewImage,
      uploadProps,
      uploadImageVisible,
      uploadImageUrl
    } = this.state;
    const { form: { getFieldDecorator }, uploading, submitLoading } = this.props;

    const props = {
      action: '',
      onRemove: file => {
        this.setState(state => {
          const index = state.coverList.indexOf(file);
          const newFileList = state.coverList.slice();
          newFileList.splice(index, 1);

          return {
            coverList: newFileList,
          };
        });
      },
      // 仅作用封面 图片上传不限大小
      beforeUpload: file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('老铁你检查一下是不是JPG/PNG的图片文件!');
          return false
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('2MB以下!');
          return false
        }

        this.getBase64(file, (imageUrl) => {
          file.url = imageUrl
          this.setState({
            previewImage: imageUrl,
            coverList: [file],
          })
        });

        // 封面上传是在提交后 所以永远返回false
        return false
      },
      fileList: this.state.coverList,
    };

    // 模态框底部按钮
    const footerBtn1 = (
      <div style={{ textAlign: 'center' }}>
        <Button loading={uploading} type="primary" onClick={this.handleCancel}>返回</Button>
      </div>
    )


    const PagesHeader = (
      <Card bordered={false} bodyStyle={{ padding: '0 24px' }} className={styles.articEditHeader}>

        <Prompt
          when={true}
          message={(location) => {
            return window.confirm(`确定要离开吗？离开之前记得保存！`);
          }}
        />

        <Form onSubmit={this.handleOk}>
          <Row>
            <Col sm={12} xs={24} style={{ paddingRight: 24 }}>

              <Form.Item label="类型">
                {getFieldDecorator('typeId', {
                  initialValue: currentItem ? currentItem.typeId.toString() : undefined,
                  rules: [{ required: true, message: '请选择类型!' }],
                })(
                  <Select disabled={currentItem && currentItem.isPreview} style={{ width: '100%' }} placeholder="请选择文章类型">
                    <Select.Option value="1">技术</Select.Option>
                    <Select.Option value="2">摄影</Select.Option>
                    <Select.Option value="3">生活</Select.Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="标题">
                {getFieldDecorator('title', {
                  initialValue: currentItem ? currentItem.title : undefined,
                  rules: [{ required: true, message: '请输入标题!' }],
                })(
                  <Input disabled={currentItem && currentItem.isPreview} placeholder="请输入标题" />
                )}
              </Form.Item>

              <Form.Item label="介绍">
                {getFieldDecorator('introduce', {
                  initialValue: currentItem ? currentItem.introduce : undefined,
                  rules: [{ required: true, message: '请输入介绍!' }],
                })(
                  <Input.TextArea disabled={currentItem && currentItem.isPreview} rows={7} placeholder="请输入介绍" />
                )}
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <Form.Item colon={false} label={(<>状态：<span style={{ color: 'rgba(0,0,0,.45)' }}>文章默认状态为公开，设置为隐藏时他人将不可见。</span></>)}>
                {getFieldDecorator('status', {
                  initialValue: !(currentItem && currentItem.status == '1'),
                  valuePropName: 'checked'
                })(
                  <Switch checkedChildren="公开" unCheckedChildren="隐藏" />
                )}
              </Form.Item>

              <Form.Item label="标签">
                <TagsAdd
                  data={currentItem && currentItem.tags ? currentItem.tags.split(',') : []}
                  ref={(dom) => { this.tagsRef = dom }}
                  isEdit={!((currentItem && currentItem.isPreview))}
                />
              </Form.Item>

              <Form.Item label="封面" className={styles.updateCoverBox}>
                <Upload.Dragger
                  {...props}
                  name="files"
                  listType="picture-card"
                  onPreview={this.handlePreview}
                  style={coverList.length >= 1 ? null : { padding: 18, border: '1px dashed #d9d9d9' }}
                  disabled={currentItem && currentItem.isPreview}
                >
                  {coverList.length >= 1 ? null :
                    <>
                      <p className="ant-upload-drag-icon">
                        <PictureOutlined />
                      </p>
                      <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
                      <p className="ant-upload-hint">只能上传限png、jpg 格式的图片，2m以下！</p>
                    </>
                  }
                </Upload.Dragger>

                <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    )

    return (
      <PageHeaderWrapper
        onBack={() => window.history.back()}
        title={currentItem ? (currentItem.isPreview ? "预览文章" : "编辑文章") : "新增文章"}
        subTitle="Article editor"
        content={PagesHeader}
        extra={
          !currentItem || (currentItem && !currentItem.isPreview) ? [
            <Button loading={submitLoading} onClick={this.handleOk} key="1" type="primary" icon={<CheckOutlined />} style={{ marginRight: 24 }}>
              发布
        </Button>,
          ] : null}
      >

        <div className={styles.articDetail}>
          <div id="vditor" />

          <Modal
            title="图片上传"
            visible={uploadImageVisible}
            onCancel={this.handleCancel}
            maskClosable={false}
            destroyOnClose
            footer={footerBtn1}
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <LegacyIcon type={uploading ? "loading" : "picture"} />
              </p>
              <p className="ant-upload-text">点击或拖拽上传图片</p>
              <p className="ant-upload-hint">仅限2M以下jpg、 png、 gif格式的图片</p>
            </Upload.Dragger>

            {
              uploadImageUrl && uploadImageUrl !== '' &&
              <div style={imageUrlBoxCss}>
                <Input value={uploadImageUrl} style={imageUrlCss} onChange={() => false} />
                <CopyToClipboard text={uploadImageUrl} onCopy={this.onCopy1}>
                  <Button type="primary">复制</Button>
                </CopyToClipboard>
              </div>
            }
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

const ArticleEditForm = Form.create()(ArticleEdit);
export default ArticleEditForm;