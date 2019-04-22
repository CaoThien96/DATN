import React, { Component } from 'react';
import Calendar from 'antd/es/calendar';
import request from 'utils/request';
import Badge from 'antd/es/badge';
function getPreviewData(data) {
  let success = [];

  let warning = [];

  let error = [];
  let m = null;
  for (let i = 0; i < data.length; i++) {
    const time = new Date(data[i].created_at);
    const d = time.getDate();
    m = time.getMonth();
    switch (data[i].status) {
      case 0:
        error = [...error, new Date(data[i].created_at).getDate()];
        break;
      case 1:
        success = [...success, new Date(data[i].created_at).getDate()];
        break;
      case 2:
        warning = [...warning, d];
        break;
    }
  }
  return {
    success,
    warning,
    error,
    m,
  };
}
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: [],
      warning: [],
      error: [],
      data: [],
    };
  }

  componentWillMount() {
    console.log(this.props);
    request('/api/check-in/list-check-in-by-month-with-user').then(data => {
      const { success, warning, error, m } = getPreviewData(data.payload);
      console.log({ success, warning, error });
      this.setState({ success, warning, error, m, data: data.payload });
    });
  }

  dateRenderCell = value => {
    const { success, warning, error, m, data } = this.state;
    const d = new Date(value).getDate();
    const month = new Date(value).getMonth();
    let check = -1;
    let time = false;
    if (success.indexOf(d) !== -1) {
      check = 1;
      time = new Date(data[success.indexOf(d)].updatedAt).toLocaleString();
    }
    if (warning.indexOf(d) !== -1) {
      check = 2;
      time = new Date(data[warning.indexOf(d)].updatedAt).toLocaleString();
    }
    if (error.indexOf(d) !== -1) {
      check = 0;
    }
    /**
     * neu hai month khac nhau thi la cua thang khac nen ko hien thi gi ca
     */
    if (m !== month) {
      check = 3;
    }
    switch (check) {
      case 1:
        return (
          <div>
            <Badge status="success" text="Đúng giờ" />
            <br/>
            <Badge status="warning" text={time} />
          </div>
        )
      case 2:
        // const updateAt =

        return (
          <div>
            <Badge status="warning" text="Muộn giờ" />
            <br/>
            <Badge status="warning" text={time} />
          </div>
        );
      case 0:
        return <Badge status="error" text="Nghỉ làm" />;
      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        <Calendar
          dateCellRender={this.dateRenderCell}
          // monthCellRender={monthCellRender}
          // onSelect={this.onSelect}
          mode="month"
          disabledDate={date => {
            if (date > new Date()) {
              return true;
            }
          }}
          onPanelChange={(date, mode) => {
            console.log({ date, mode });
          }}
        />
      </div>
    );
  }
}

export default Index;
