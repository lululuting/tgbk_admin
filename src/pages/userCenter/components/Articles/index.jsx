import { Icon as LegacyIcon } from '@ant-design/compatible';
import { EditOutlined } from '@ant-design/icons';
import { List, Tag, Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import router from 'umi/router';

import { connect } from 'dva';
import styles from './index.less';

export default (props) => {
  const { data } = props;

  const IconText = ({ type, text }) => (
    <span>
      <LegacyIcon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );

  // 前往编辑
  const linkEdit = (id) => {
    console.log(123)
    router.push({
      pathname: '/articleManage/articleEdit',
      query: {
        id
      }
    })
  }

  return (
    <List
      size="large"
      className={styles.articleList}
      rowKey="id"
      itemLayout="vertical"
      dataSource={data}
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 5,
      }}
      renderItem={item => (
        <List.Item
          key={item.id}
          actions={[
            <IconText key="view" type="fire" text={item.viewCount} />,
            <IconText key="like" type="like" text={item.likeCount} />,
            <IconText key="time" type="clock-circle" text={moment(item.createTime).format('YYYY-MM-DD HH:mm')} />,
            <span onClick={()=>linkEdit(item.id)}>
              <EditOutlined style={{ marginRight: 8 }} />
              编辑
            </span>
          ]}
          extra={
            item.cover && <div className={styles.itemCover} style={{ backgroundImage: `url(${item.cover})` }} ></div>
          }
        >
          <List.Item.Meta
            description={
              <span>
                {item.tags && item.tags.split(',').map((tag, index) => (
                  <Tag color="blue" key={index}>{tag}</Tag>
                ))}
              </span>
            }
            title={
              <a className={styles.listItemMetaTitle} href={item.link}>
                {item.title}
              </a>
            }

          />
          <div className={styles.listContent}>
            <div className={styles.description}>{item.introduce}</div>
          </div>
        </List.Item>
      )}
    />
  );
};
