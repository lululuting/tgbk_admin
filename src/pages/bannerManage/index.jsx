import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { uploadQiniu } from '@/utils/uploadQiniu';

import { InboxOutlined, PlusOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
    Modal,
    Card,
    Row,
    Col,
    List,
    Carousel,
    Badge,
    Radio,
    Button,
    Avatar,
    Select,
    Switch,
    Upload,
    Input,
    message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './style.less';

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({	qiniuyun, banner, loading, user }) => ({
	qiniuyun,
	banner,
	listLoading: loading.effects['banner/getBannerList'],
	currentUser: user.userInfo
}))


class Banner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			currentItem: null,
			fileList: [],
			uploading: false,
			previewImage: '',
			previewVisible: false,
			BannerTotal: null,
			dataList: [],
			previewBanner: {},
			type: null,
			page: 1,
			limit: 10,
			dataTotal: 0,
		};
	}

	componentDidMount() {
		this.queryPreviewBanner();
		this.queryList();
	}

	// 查询预览
	queryPreviewBanner = () => {
		this.props.dispatch({
			type: 'banner/getPreviewBanner',
			callback: res => {
				this.setState({
					previewBanner: res.data,
				}, () => {
					console.log(this.state.previewBanner)
				})
			}
		})
	}

	// 查询列表 
	queryList = () => {
		this.props.dispatch({
			type: 'banner/getBannerList',
			payload: {
				type: this.state.type,
				page: this.state.page,
				limit: this.state.limit,
			},
			callback: res => {
				this.setState({
					dataList: res.data.list,
					dataTotal: res.data.total,
				})
			}
		})
	}

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

	// 编辑
	editBanner = (item) => {
		this.setState({
			currentItem: item,
			fileList: [{
				uid: item.id,
				name: 'image.png',
				status: 'done',
				url: item.url,
			}]
		}, () => {
			this.setState({
				visible: true,
			})
		})
	}

	// 删除
	deleteBanner = (id) => {
		Modal.confirm({
			title: '删除Banner',
			content: '老铁，确定删除该Banner吗？删了就没了哦！',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				this.props.dispatch({
					type: 'banner/delBanner',
					payload: {
						id,
					},
					callback: (res) => {
						message.success('删除成功！');
						this.queryList();
						this.queryPreviewBanner();
					}
				})
			}
		});
	};

	// 编辑提交
	handleOk = () => {

		const { dispatch, form } = this.props;
		const { fileList, currentItem } = this.state;

		form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}

			// 编辑 新增
			if (currentItem && currentItem.id) {
				fieldsValue.id = currentItem.id
			}

			// 图片
			fieldsValue.url = fileList && fileList[0] ? fileList[0].url : null;
			fieldsValue.status = fieldsValue.status ? '1' : '0';


				// 新增编辑banner
				const uploadBanner = (url) => {

					if(url){
						fieldsValue.url = url;
					}

					return new Promise((resolve =>
						dispatch({
							type: 'banner/addEditBanner',
							payload: fieldsValue,
							callback: res => {
								message.success('操作成功！')
								this.handleCancel();
								form.resetFields();
	
								resolve();
								this.queryList();
								this.queryPreviewBanner();
							}
						})
					))
				}
	

		
			// 判断封面是否更改
			if (fileList && fileList[0] && fileList[0].size) {
				uploadQiniu(dispatch, fileList[0], uploadBanner)
				return false;
			}

			uploadBanner()
		})
	}



	// 关闭
	handleCancel = () => {
		this.setState({
			visible: false
		}, () => {
			this.setState({
				fileList: [],
				currentItem: null
			})
		})
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
			visible,
			currentItem,
			fileList,
			previewVisible,
			previewImage,
			previewBanner,
			dataList, page, limit, dataTotal
		} = this.state;

		const { form, form: { getFieldDecorator }, listLoading, currentUser } = this.props;

		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 16 },
		};


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

		const extraContent = (
			<div>
				<RadioGroup defaultValue="0" onChange={this.typeChange}>
					<RadioButton value="0">全部</RadioButton>
					<RadioButton value="1">轮播</RadioButton>
					<RadioButton value="2">推荐</RadioButton>
					<RadioButton value="3">广告</RadioButton>
					<RadioButton value="4">首页</RadioButton>
					<RadioButton value="5">列表</RadioButton>
					<RadioButton value="6">详情</RadioButton>
					<RadioButton value="7">搜索</RadioButton>
					<RadioButton value="8">消息</RadioButton>
				</RadioGroup>
			</div>
		);



		const props = {
			onRemove: file => {
				this.setState(state => {
					const index = state.fileList.indexOf(file);
					const newFileList = state.fileList.slice();
					newFileList.splice(index, 1);
					return {
						fileList: newFileList,
					};
				});
			},
			beforeUpload: file => {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					message.error('老铁你检查一下是不是JPG/PNG的图片文件!');
					return false
				}

				const isLt15M = file.size / 1024 / 1024 < 15;
				if (!isLt15M) {
					message.error('15MB以下!');
					return false
				}

				this.getBase64(file, (imageUrl) => {
					file.url = imageUrl
					this.setState({
						previewImage: imageUrl,
						fileList: [file],
					})
				});
				return false;
			},
			fileList: this.state.fileList
		};

		return (
            <PageHeaderWrapper>

				<div className={styles.bannerManage}>
					<Card bordered={false} bodyStyle={{ padding: 0 }}>
						<Row>
							<Col md={17} sm={24}>
								<Card bordered={false} title="轮播、推荐预览">
									<div className={styles.bannerView}>
										<div className={styles.leftBanner}>
											<Carousel autoplay>
												{
													previewBanner && previewBanner.lb &&
													previewBanner.lb.map((item, index) => (
														<a href={item.link} target="_blank" key={index}>
															<div className={styles.bannerItem} style={{ backgroundImage: `url(${item.url})` }}></div>
														</a>
													))
												}
											</Carousel>
										</div>
										<div className={styles.rightBanner}>
											{
												previewBanner && previewBanner.tj &&
												previewBanner.tj.map((item, index) => (
													<a href={item.link} target="_blank" key={index} className={styles.bannerItem} style={{ backgroundImage: `url(${item.url})` }}>
														<span className={styles.bannerText}>{item.title}</span>
													</a>
												))
											}
										</div>
									</div>
								</Card>
							</Col>

							<Col md={7} sm={24}>
								<Card bordered={false} title="广告位预览" >
									<div className={styles.otherBanner}>
										{
											previewBanner && previewBanner.gg &&
											previewBanner.gg.map((item, index) => (
												<a href={item.link} target="_blank" key={index} className={styles.bannerItem} style={{ backgroundImage: `url(${item.url})` }}>
													<span className={styles.bannerText}>{item.title}</span>
												</a>
											))
										}
									</div>

								</Card>
							</Col>
						</Row>
					</Card>

					<Card
						title="Banner列表"
						bordered={false}
						style={{ marginTop: 24 }}
						className={styles.listCard}
						extra={extraContent}
					>
						<Button
							type="dashed"
							style={{ width: '100%', marginBottom: 8 }}
							icon={<PlusOutlined />}
							onClick={() => this.setState({ visible: true })}
							disabled={currentUser && ~~currentUser.auth !== 2}
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
									actions={ currentUser && ~~currentUser.auth == 2 ?[
										<a
											onClick={e => {
												e.preventDefault();
												this.editBanner(item)
											}}
										>
											编辑
                      					</a>,
										<a
											onClick={e => {
												e.preventDefault();
												this.deleteBanner(item.id)
											}}
										>
											删除
										</a>,
									]: [<span>无权操作</span>,]}
								>
									<List.Item.Meta
										avatar={<Avatar src={item.url} shape="square" />}
										title={<a href={item.link} target="_blank" >{item.title}</a>}
									/>


									<div className={styles.listContent}>T
										<div className={styles.listContentItem}>
											<span>Type</span>
											<p>
												{(() => {
													switch (item.type) {
														case "1": return '轮播'; break;
														case "2": return '推荐'; break;
														case "3": return '广告'; break;
														case "4": return '首页'; break;
														case "5": return '列表页'; break;
														case "6": return '详情页'; break;
														case "7": return '搜索页'; break;
														case "8": return '消息页'; break;
														default: return null;
													}
												}
												)(item.type)}
											</p>
										</div>

										<div className={styles.listContentItem}>
											<span>Status</span>
											<p>
												{
													item.status === '1' ?
														<Badge status="processing" text="生效中" />
														:
														<Badge status="error" text="已下架" />
												}
											</p>
										</div>

										<div className={styles.listContentItem}>
											<span>Author</span>
											<p>{item.userName}</p>
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



					<Modal
						title={currentItem ? '编辑Banner' : '新增Banner'}
						visible={visible}
						onOk={this.handleOk}
						confirmLoading={false}
						onCancel={() => { this.handleCancel(); form.resetFields() }}
						maskClosable={false}
						className={styles.formModal}
					>

						<Form {...formItemLayout} onSubmit={this.handleOk}>

							<Form.Item label="类型">
								{getFieldDecorator('type', {
									initialValue: currentItem ? currentItem.type : undefined,
									rules: [{ required: true, message: '请选择类型!' }],
								})(
									<Select placeholder="请选择类型">
										<Option value="1">轮播</Option>
										<Option value="2">推荐</Option>
										<Option value="3">广告</Option>
										<Option value="4">首页</Option>
										<Option value="5">列表页</Option>
										<Option value="6">详情页</Option>
										<Option value="7">搜索页</Option>
										<Option value="8">消息页</Option>
									</Select>
								)}
							</Form.Item>

							<Form.Item label="标题">
								{getFieldDecorator('title', {
									initialValue: currentItem ? currentItem.title : undefined,
									rules: [{ required: true, message: '请输入标题!' }],
								})(
									<Input placeholder="请输入标题" />
								)}
							</Form.Item>

							<Form.Item label="链接">
								{getFieldDecorator('link', {
									initialValue: currentItem ? currentItem.link : undefined,
									rules: [{ required: true, message: '请输入链接!' }],
								})(
									<Input placeholder="请输入链接" />
								)}
							</Form.Item>

							<Form.Item label="状态">
								{getFieldDecorator('status', {
									initialValue: currentItem ? (currentItem.status === '1' ? true : false) : true,
									valuePropName: 'checked'
								})(<Switch checkedChildren="开" unCheckedChildren="关" />)}
							</Form.Item>

							<Form.Item label="图片" required>

								<Upload.Dragger
									{...props}
									name="files"
									listType="picture-card"
									onPreview={this.handlePreview}
									style={fileList.length >= 1 ? null : { padding: 10, border: '1px dashed #d9d9d9' }}
								>
									{fileList.length >= 1 ? null :
										<>
											<p className="ant-upload-drag-icon">
												<InboxOutlined />
											</p>
											<p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
											<p className="ant-upload-hint">只能上传限png、jpg 格式的图片，15m以下！</p>
										</>
									}
								</Upload.Dragger>


								<Modal visible={previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
									<img alt="example" style={{ width: '100%' }} src={previewImage} />
								</Modal>
							</Form.Item>

						</Form>

					</Modal>


				</div>
			</PageHeaderWrapper>
        );
	}
}

const BannerForm = Form.create()(Banner);
export default BannerForm;
