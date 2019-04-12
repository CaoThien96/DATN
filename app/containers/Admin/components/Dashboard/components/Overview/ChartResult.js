import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import * as lodash from'lodash'
import Skeleton from 'antd/es/skeleton';
const data = [
  {
    name: '05/04/2019',
    on_time: 7,
    late: 2,
    miss: 1,
  },
  {
    name: '06/04/2019',
    on_time: 8,
    late: 2,
    miss: 0,
  },
];
function getOnLateMiss(checkInDetails) {
  let on_time = 0;
  let late = 0;
  for (const ck of checkInDetails) {
    if (ck.status == 1) {
      on_time++;
    }
    if (ck.status == 2) {
      late++;
    }
  }
  const miss = checkInDetails.length - on_time - late;
  return {
    on_time,
    late,
    miss,
  };
}
function getAnalysisData(listCheckIn) {
  return listCheckIn.map(el => {
    const { on_time, late, miss } = getOnLateMiss(el.check_in);
    return {
      name: new Date(el.created_at).toDateString(),
      on_time,
      late,
      miss,
    };
  });
}
export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/94sebfL8/';

  constructor(props) {
    super(props);
    this.state = {
      data:[]
    }
  }

  componentWillMount() {
    console.log({listCheckIn:this.props.listCheckIn})
    this.setState({
      data:getAnalysisData(this.props.listCheckIn)
    })
  }
  componentWillReceiveProps(nextProps){
    console.log({listCheckIn:this.props.listCheckIn})
    console.log(nextProps.listCheckIn)

    if(!lodash.isEqual(nextProps.listCheckIn,this.props.listCheckIn)){
      console.log('cap nhat')
      this.setState({
        data:getAnalysisData(nextProps.listCheckIn)
      })
      console.log(this.state)
    }
  }

  render() {
    return (
      <ComposedChart
        width={1000}
        height={400}
        data={this.state.data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="on_time" barSize={20} fill="#1890FF" />
        <Bar dataKey="late" barSize={20} fill="#FFFFB8" />
        <Bar dataKey="miss" barSize={20} fill="#FF4D4F" />
      </ComposedChart>
    );
  }
}
