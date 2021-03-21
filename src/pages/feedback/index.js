import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
	Card,
	Table,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './style.less';


@connect(({ feedback, loading }) => ({
	feedback,
	listLoading: loading.effects['feedback/getFeedbackList'],
}))


class Feedback extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataList: [],

			page: 1,
			limit: 10,
			dataTotal: 0,
		};
	}

	componentDidMount() {
		this.queryList();
	}


	// 查询列表 
	queryList = () => {
		this.props.dispatch({
			type: 'feedback/getFeedbackList',
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







	render() {

		const {
			dataList, limit, dataTotal
		} = this.state;

		const { listLoading } = this.props;

		const columns = [
			{
				title: '问题',
				dataIndex: 'title',
				key: 'title',
			},
			{
				title: '描述',
				dataIndex: 'description',
				key: 'description',
			},
			{
				title: '联系方式',
				dataIndex: 'contact',
				key: 'contact',
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				render: (createTime) => (
					<span>
						{
						moment(createTime).format('YYYY-MM-DD HH:mm')
						}
					</span>
				),

			},
		];

		const paginationProps = {
			showSizeChanger: true,
			showQuickJumper: true,
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
				<Card
					title="反馈列表"
					bordered={false}
					style={{ marginTop: 24 }}
				>
					<Table bordered loading={listLoading} dataSource={dataList} pagination={paginationProps} columns={columns} rowKey="id"/>
				</Card>

			</PageHeaderWrapper>
		);
	}
}

export default Feedback;
