import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';

import ShowConfusion from './components/ShowConfusion';
import ShowReport from './components/ShowReport';

class LayoutConfigurationModel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.startTraining();
  }

  startTraining = () => {
    request('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      ({
        labels,
        trueLabels,
        predictedLabels,
        reportTraining,
        reportDataTest,
      }) => {
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

  onSaveModel = () => {
    request('/api/ai/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(data => {
      if (data.success) {
        alert(data.message);
      } else {
        alert('co loi');
      }
    });
  };

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
        <Button onClick={this.onSaveModel}>Save model!</Button>
        <Row>
          <Col>
            {trueLabels ? (
              <div>
                <ShowConfusion
                  labels={labels}
                  trueLabels={trueLabels}
                  predictedLabels={predictedLabels}
                />
                <ShowReport reportDataTest={reportDataTest} />
              </div>
            ) : null}
          </Col>
        </Row>
        <Row />
      </div>
    );
  }
}

export default LayoutConfigurationModel;
