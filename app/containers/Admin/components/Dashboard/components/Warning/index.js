import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'antd/es/date-picker';
import request from 'utils/request';
import {
  getStartMonth,
  getEndMonth,
  getStartEndWeek,
  getStartDay,
  getEndDay,
} from 'utils/commonDateTime';
import Result from './Result';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const filterData = (data = []) => {
  let on_time = [];
  let later = [];
  let miss_request = [];
  let miss = [];
  console.log(data)
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    if (el.status == 0) {
      miss = [...miss, el];
    } else if (el.status == 1) {
      on_time = [...on_time, el];
    } else if (el.status == 2) {
      later = [...later, el];
    } else {
      miss_request = [...miss_request, el];
    }
  }

  return {
    on_time,
    later,
    miss,
    miss_request,
  };
};
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  componentWillMount() {
    const time = new Date();

    const startMonth = getStartMonth(
      time.getFullYear(),
      time.getMonth(),
    ).getTime();
    const endMonth = getEndMonth(time.getFullYear(), time.getMonth()).getTime();
    this.handleGetDataPreview(startMonth, endMonth);
  }

  handleGetDataPreview = (start, end) => {
    request(`/api/dashboard/get-warning/${start}/${end}`).then(data => {
      if (data.success) {
        const result = data.payload.map(el => {
          const { on_time, later, miss, miss_request } = filterData(
            el.created_at,
          );

          return {
            ...el,
            created_at: {
              on_time,
              later,
              miss,
              miss_request,
            },
          };
        });
        console.log({ result});
        this.setState({ result });
      }
    });
  };

  handleChangeMonth = (date = moment(), stringDate) => {
    const startMonth = getStartMonth(date.year(), date.month()).getTime();
    const endMonth = getEndMonth(date.year(), date.month()).getTime();
    this.handleGetDataPreview(startMonth, endMonth);
  };

  render() {

    return (
      <div>
        <MonthPicker
          placeholder="Select Month"
          onChange={this.handleChangeMonth}
          defaultValue={moment()}
        />
        <Result result={this.state.result} />
      </div>
    );
  }
}

export default Index;
