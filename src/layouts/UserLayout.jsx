import { getPageTitle, DefaultFooter } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';

import React from 'react';
import { connect } from 'dva';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;

  const title = getPageTitle({
    pathname: location.pathname,
    ...props,
  });



  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>

        <DefaultFooter
          copyright="Tingge 博客"
          links={[]}
        />

      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
