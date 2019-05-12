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
import * as lodash from 'lodash';
import Skeleton from 'antd/es/skeleton';
import { Badge } from 'antd';
import Spin from 'antd/es/spin';
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
  let license = 0;
  for (const ck of checkInDetails) {
    if (ck.status == 1) {
      on_time++;
    }
    if (ck.status == 2) {
      late++;
    }
    if (ck.status == 3) {
      license++;
    }
  }
  const miss = checkInDetails.length - on_time - late - license;
  return {
    on_time,
    late,
    miss,
    license,
  };
}
function getAnalysisData(listCheckIn) {
  return listCheckIn.map(el => {
    const { on_time, late, miss, license } = getOnLateMiss(el.check_in);
    let time = new Date(el.created_at);
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    time = `${time.getMonth() + 1}/${time.getDate()}`;
    return {
      name: time,
      on_time,
      late,
      miss,
      license,
      year,
      month,
      date,
    };
  });
}
const getIntroOfPage = label => {
  if (label === 'Page A') {
    return "Page A is about men's clothing";
  }
  if (label === 'Page B') {
    return "Page B is about women's dress";
  }
  if (label === 'Page C') {
    return "Page C is about women's bag";
  }
  if (label === 'Page D') {
    return 'Page D is about household goods';
  }
  if (label === 'Page E') {
    return 'Page E is about food';
  }
  if (label === 'Page F') {
    return 'Page F is about baby food';
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#FFF',
          padding: '10px 5px',
          border: 'solid 1px #b2b2b2',
        }}
      >
        <p className="text-center">{label}</p>
        <Badge status="success" text={`Đúng giờ: ${payload[0].value} người`} />
        <br />
        <Badge status="warning" text={`Muộn giờ: ${payload[1].value} người`} />
        <br />
        <Badge
          color="#b5b5b5"
          text={`Nghỉ có phép: ${payload[2].value} người`}
        />
        <br />
        <Badge
          status="error"
          text={`Nghỉ không phép: ${payload[3].value} người`}
        />
      </div>
    );
  }

  return null;
};
const renderLegend = props => {
  return (
    <div className="text-center">
      <Badge status="success" text="Đúng giờ" />
      <Badge className="m-l-15" status="warning" text="Muộn giờ" />
      <Badge className="m-l-15" color="#b5b5b5" text="Nghỉ có phép" />
      <Badge className="m-l-15" status="error" text="Nghỉ không phép" />
    </div>
  );
};
export default class Example extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    console.log({ listCheckIn: this.props.listCheckIn });
    this.setState({
      data: getAnalysisData(this.props.listCheckIn),
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log({ listCheckIn: this.props.listCheckIn });
    console.log(nextProps.listCheckIn);

    if (!lodash.isEqual(nextProps.listCheckIn, this.props.listCheckIn)) {
      console.log('cap nhat');
      this.setState({
        data: getAnalysisData(nextProps.listCheckIn),
      });
      console.log(this.state);
    }
  }

  render() {
    const { data } = this.state;
    console.log({data})
    if (data.length) {
      return (
        <ComposedChart
          width={1200}
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
          <YAxis domain={[0, 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Bar dataKey="on_time" stackId="a" fill="#52C41A" />
          <Bar dataKey="late" stackId="a" fill="#FAAD14" />
          <Bar dataKey="license" stackId="a" fill="#b5b5b5" />
          <Bar dataKey="miss" stackId="a" fill="#F5222D" />
        </ComposedChart>
      );
    }
    return <Spin size="large" />;
  }
}
