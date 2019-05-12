import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import Tabs from 'antd/es/tabs';
import request from 'utils/request';

import OverviewRange from './components/Overview';
import OverviewDate from './index';
import OverviewWarning from './components/Warning'
import Icon from 'antd/es/icon';
const TabPane = Tabs.TabPane;

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Tabs type="card" defaultActiveKey="1">
          <TabPane tab={<span><Icon type="bar-chart" />Thống kê theo khoảng thời gian</span>} key="1">
            <OverviewRange />
          </TabPane>
          <TabPane tab={<span><Icon type="credit-card" />Thông kê chi tiết theo ngày</span>} key="2">
            <OverviewDate />
          </TabPane>
          <TabPane tab={<span><Icon type="team" />Thống kê chi tiết theo nhân viên</span>} key="3">
            <OverviewWarning />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Layout;
