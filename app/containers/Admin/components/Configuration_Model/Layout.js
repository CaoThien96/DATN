import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';

import ShowConfusion from './components/ShowConfusion';

class LayoutConfigurationModel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startTraining = () => {
    request('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      ({labels, trueLabels, predictedLabels, reportTraining, reportDataTest }) => {
        this.setState({
          labels,
          trueLabels,
          predictedLabels,
          reportTraining,
          reportDataTest,
        });
      },
    );
  };

  showEvaluation = data => {};

  render() {
    const {
      labels,
      trueLabels,
      predictedLabels,
      reportTraining,
      reportDataTest,
    } = this.state;
    return (
      <div>
        <Button onClick={this.startTraining}>Chạy đạo tạo mô hình ngay!</Button>
        <Row>
          <Col>
            {trueLabels ? (
              <ShowConfusion
                labels={labels}
                trueLabels={trueLabels}
                predictedLabels={predictedLabels}
              />
            ) : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default LayoutConfigurationModel;
