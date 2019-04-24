import React, { Component } from 'react';
import moment from 'moment';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';

import {
  getStartMonth,
  getEndMonth,
  getStartEndWeek,
  getStartDay,getEndDay
} from 'utils/commonDateTime';
import ChartResult from './ChartResult';
import request from '../../../../../../utils/request';
const typeReport = ['month', 'week'];
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Option = Select.Option;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeReport: 'month',
      listCheckIn:[]
    };
  }
  componentWillMount(){
    const startDate = getStartDay().getTime();
    const endDay = getEndDay().getTime();
    console.log({startDate,endDay})
    this.handleOnchange(moment())
  }
  handleTypeReportChange = value => {
    this.setState({
      typeReport: value,
    });
  };

  handleOnchange = (date = moment(), stringDate) => {
    console.log({ date, stringDate });
    if (this.state.typeReport == 'month') {
      const y = date.year();
      const m = date.month();
      const d = 1;
      console.log({ y, m, d });
      console.log(getStartMonth(y, m));
      console.log(getEndMonth(y, m));
      request(
        `/api/check-in//list-check-in-by-range-with-admin/${getStartMonth(
          y,
          m,
        ).getTime()}/${getEndMonth(y, m).getTime()}`,
      ).then(data => {
        if(data.success){
          this.setState({listCheckIn:data.payload})
        }
      });
    } else {
      const stringArray = stringDate.split('-');
      const y = stringArray[0];
      const w = stringArray[1].replace('th', '');
      console.log({ y, w });
      console.log(getStartEndWeek(y, w));
      const { startWeek, endWeek } = getStartEndWeek(y,w);
      request(
        `/api/check-in//list-check-in-by-range-with-admin/${startWeek.getTime()}/${endWeek.getTime()}`,
      ).then(data => {
        if(data.success){
          this.setState({listCheckIn:data.payload})
        }
      });
    }
  };

  render() {
    console.log(this.state.typeReport);
    return (
      <div>
        <div>
          <Select
            defaultValue={typeReport[0]}
            style={{ width: 120 }}
            onChange={this.handleTypeReportChange}
          >
            {typeReport.map(type => (
              <Option key={type}>{type}</Option>
            ))}
          </Select>
          {this.state.typeReport == 'month' ? (
            <MonthPicker
              placeholder="Select Month"
              onChange={this.handleOnchange}
              defaultValue={moment()}
            />
          ) : (
            <WeekPicker
              placeholder="Select Week"
              onChange={this.handleOnchange}
            />
          )}
        </div>
        <div>
          {
            this.state.listCheckIn.length>0?(
              <ChartResult listCheckIn={this.state.listCheckIn}/>
            ):(<p className='text-center'>Không có dữ liệu</p>)
          }
        </div>
      </div>
    );
  }
}

export default Index;
