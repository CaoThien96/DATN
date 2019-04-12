import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import Tabs from 'antd/es/tabs';
import request from 'utils/request';

import OverviewRange from './components/Overview';
import OverviewDate from './index';
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thống kê theo khoảng thời gian" key="1">
            <OverviewRange />
          </TabPane>
          <TabPane tab="Thông kê chi tiết theo ngày" key="2">
            <OverviewDate />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Layout;
