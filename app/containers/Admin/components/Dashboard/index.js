import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';

import Calendar from './components/Calendar';
import Result from './components/Result';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
class LayoutDashboard extends Component {
  constructor(props) {
    super(props);
    this.state={
      listCheckIn : []
    }
  }

  onShowResult= (listCheckIn)=>{
    this.setState({listCheckIn})
  }
  render() {
    return (
      <div>
        <Row>
          <Col span={10}>
            <Calendar onShowResult={this.onShowResult} />
          </Col>
          <Col span={14}>
            <Result listCheckIn={this.state.listCheckIn} />
          </Col>
        </Row>
      </div>
    );
  }
}

LayoutDashboard.defaultProps = {};
LayoutDashboard.propTypes = {};

export default LayoutDashboard;
