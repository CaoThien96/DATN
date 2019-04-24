import React, { Component } from 'react';
import Calendar from 'antd/es/calendar';
import request from 'utils/request';
import Badge from 'antd/es/badge';
import moment from 'moment';
import lodashCommon from 'containers/commons/lodash_commons';
import {
  getStartMonth,
  getEndMonth,
  getStartYear,
  getEndYear,
} from 'utils/commonDateTime';
function getDataByTime(y, m, d, data) {
  for (let i = 0; i < data.length; i++) {
    const time = new Date(data[i].check_in_detail.updatedAt);
    const match = {
      y: time.getFullYear(),
      m: time.getMonth(),
      d: time.getDate(),
    };
    if (JSON.stringify(match) == JSON.stringify({ y, m, d })) {
      return data[i];
    }
  }
  return -1;
}
function toTimeByDate(date = new Date()) {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
function getPreviewData(data) {
  let success = []; // Đúng giờ

  let warning = []; // Đi muộn

  let license = []; // Xin nghỉ

  let error = []; // Nghỉ làm

  let m = null;
  let y = null;
  for (let i = 0; i < data.length; i++) {
    const time = new Date(data[i].check_in_detail.created_at);
    const d = time.getDate();
    m = time.getMonth();
    y = time.getFullYear();
    switch (data[i].check_in_detail.status) {
      case 0:
        error = [...error, { y, m, d }];
        break;
      case 1:
        success = [...success, { y, m, d }];
        break;
      case 2:
        warning = [...warning, { y, m, d }];
        break;
      case 3:
        license = [...license, { y, m, d }];
        break;
    }
  }
  return {
    success,
    warning,
    license,
    error,
    m,
    y,
  };
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewDataModeYear: [],
      success: [],
      warning: [],
      license: [],
      error: [],
      data: [],
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    };
  }

  async componentWillMount() {
    const currentY = new Date().getFullYear();
    const currentM = new Date().getMonth();
    const startTime = getStartMonth(currentY, currentM).getTime();
    const endTime = getEndMonth(currentY, currentM).getTime();
    const {
      success,
      warning,
      error,
      license,
      month,
      year,
      data,
    } = await this.getCheckInWithUserByRange(startTime, endTime);
    console.log({
      success,
      warning,
      error,
      license,
      month,
      year,
      data,
    });
    this.setState({
      success,
      warning,
      error,
      license,
      month,
      year,
      data,
    });
  }
  getCheckInWithUserByRange = (startTime, endTime)=> {
    console.log(this.props)
    return new Promise(resolve => {
      request(
        `/api/check-in/list-check-in-by-range-with-employee/${startTime}/${endTime}/${this.props.currentUser.iid}`,
      ).then(data => {
        const { success, warning, error, license, m, y } = getPreviewData(
          data.payload,
        );
        console.log(m, y);
        resolve({
          success,
          warning,
          error,
          license,
          month: m,
          year: y,
          data: data.payload,
        });
      });
    });
  }
  dateRenderCell = value => {
    const { success, warning, error, license, month, data } = this.state;

    const d = new Date(value).getDate();
    const m = new Date(value).getMonth();
    const y = new Date(value).getFullYear();

    const match = { y, m, d };
    let check = -1;
    let time = false;
    if (lodashCommon.lodashFind(success, match) !== undefined) {
      check = 1;
      time = toTimeByDate(
        new Date(getDataByTime(y, m, d, data).check_in_detail.updatedAt),
      );
    }
    if (lodashCommon.lodashFind(warning, match) !== undefined) {
      check = 2;
      time = toTimeByDate(
        new Date(getDataByTime(y, m, d, data).check_in_detail.updatedAt),
      );
    }
    if (lodashCommon.lodashFind(error, match) !== undefined) {
      check = 0;
    }
    if (lodashCommon.lodashFind(license, match) !== undefined) {
      check = 3;
    }
    /**
     * neu hai month khac nhau thi la cua thang khac nen ko hien thi gi ca
     */
    if (month !== m) {
      check = 4;
    }
    switch (check) {
      case 1:
        return (
          <div>
            <Badge status="success" text="Đúng giờ" />
            <br />
            <Badge status="warning" text={time} />
          </div>
        );
      case 2:
        return (
          <div>
            <Badge status="warning" text="Muộn giờ" />
            <br />
            <Badge status="warning" text={time} />
          </div>
        );
      case 3:
        return (
          <div>
            <Badge status="warning" text="Xin nghỉ có phép" />
          </div>
        );
      case 0:
        return <Badge status="error" text="Nghỉ làm" />;
      default:
        return null;
    }
  };

  getMonthData = value => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  monthCellRender = (value = moment()) => {
    const month = value.month();
    const year = value.year();
    const { previewDataModeYear } = this.state;

    const dataCurrentMonth = previewDataModeYear.find(el => {
      if (el.month === month && el.year === year) {
        return true;
      }
      return false;
    });
    console.log({previewDataModeYear,month,year,dataCurrentMonth})
    if (dataCurrentMonth) {
      return (
        <div>
          <Badge
            status="warning"
            text={`Đúng giờ: ${dataCurrentMonth.success.length}`}
          />
          <br />
          <Badge
            status="warning"
            text={`Muộn giờ: ${dataCurrentMonth.warning.length}`}
          />
          <br />
          <Badge
            status="warning"
            text={`Nghỉ có phép: ${dataCurrentMonth.license.length}`}
          />
          <br />
          <Badge
            status="warning"
            text={`Nghỉ không phép: ${dataCurrentMonth.error.length}`}
          />
        </div>
      );
    }
    return (<div>Không có dữ liệu</div>);
  };

  getPreviewByYear = async y => {
    const previewDataModeYear = [];
    for (let i = 0; i < 12; i++) {
      const startMonth = getStartMonth(y, i).getTime();
      const endMonth = getEndMonth(y, i).getTime();
      const {
        success,
        warning,
        error,
        license,
        month,
        year,
        data,
      } = await this.getCheckInWithUserByRange(startMonth, endMonth);
      previewDataModeYear.push({
        success,
        warning,
        error,
        license,
        month,
        year,
        data,
      });
    }
    return previewDataModeYear;
  };

  handlePanelChange = async (date = moment(), mode) => {
    const y = date.year();
    const m = date.month();
    let startTime = getStartMonth(y, m).getTime();
    let endTime = getEndMonth(y, m).getTime();
    if (mode == 'year') {
      startTime = getStartYear(y).getTime();
      endTime = getEndYear(y).getTime();
      const previewDataModeYear = await this.getPreviewByYear(y);
      this.setState({ previewDataModeYear });
    } else {
      const {
        success,
        warning,
        error,
        license,
        month,
        year,
        data,
      } = await this.getCheckInWithUserByRange(startTime, endTime);
      console.log({
        success,
        warning,
        error,
        license,
        month,
        year,
        data,
      });
      this.setState({
        success,
        warning,
        error,
        license,
        month,
        year,
        data,
      });
    }
  };

  render() {
    return (
      <div>
        <Calendar
          dateCellRender={this.dateRenderCell}
          monthCellRender={this.monthCellRender}
          // onSelect={this.onSelect}
          // mode="month"
          disabledDate={date => {
            if (date > new Date()) {
              return true;
            }
          }}
          onPanelChange={this.handlePanelChange}
        />
      </div>
    );
  }
}

export default Index;
