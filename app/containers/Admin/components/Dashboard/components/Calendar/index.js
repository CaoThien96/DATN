import React, { Component } from 'react';
import Calendar from 'antd/es/calendar';
import request from 'utils/request';

class CalendarIndex extends Component {
  state = {
    date: new Date(),
  };

  componentWillMount() {
    const time = new Date();
    const tmp = JSON.stringify({
      time,
    });
    request(`/api/check-in/list-check-in-by-date?date=${tmp}`).then(data => {
      console.log(data);
      this.props.onShowResult(data.payload);
    });
  }

  onSelect = time => {
    const tmp = JSON.stringify({
      time,
    });
    request(`/api/check-in/list-check-in-by-date?date=${tmp}`).then(data => {
      console.log(data);
      this.props.onShowResult(data.payload);
    });
  };
  dateCellRender = (time)=>{

  }
  render() {
    return (
      <div>
        <Calendar
          // dateCellRender={dateCellRender}
          // monthCellRender={monthCellRender}
          onSelect={this.onSelect}
          mode="month"
          disabledDate={date => {
            if (date > new Date()) {
              return true;
            }
          }}
        />
      </div>
    );
  }
}

export default CalendarIndex;
