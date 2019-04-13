import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import message from 'antd/es/message';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Progress from 'antd/es/progress/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import ShowConfusion from './components/ShowConfusion';
import ShowReport from './components/ShowReport';
import injectReducer from '../../../../utils/injectReducer';
import reducer from '../Checker/reducer';
import { onUpdateModel } from './actions';

class LayoutConfigurationModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusTraining: false,
      xTestFull: null,
      yTestFull: null,
      model: null,
      epoch: 0,
      dataAcc: [
        {
          epoch: 0,
          acc: 0,
        },
      ],
      dataLoss: [],
    };
  }

  handleTrain = async () => {
    this.setState({ statusTraining: true });
    request('/api/ai/dataset').then(async data => {
      if (data.success) {
        let {
          xTrainFull,
          yTrainFull,
          xTestFull,
          yTestFull,
          numberClass,
        } = data;
        xTrainFull = tf.tensor2d(xTrainFull);
        yTrainFull = tf.tensor2d(yTrainFull);

        xTestFull = tf.tensor2d(xTestFull);
        yTestFull = tf.tensor2d(yTestFull);
        this.setState({ xTestFull, yTestFull });
        console.log(`
          Thông tin dataset:
          - Số lượng mẫu ${xTrainFull.shape}
          - Số lượng test ${xTestFull.shape}
        `);
        let valAcc;
        const model = tf.sequential();
        model.add(
          tf.layers.dense({
            inputShape: [128],
            activation: 'sigmoid',
            units: 128,
          }),
        );

        model.add(tf.layers.dropout({ rate: 0.5 }));
        model.add(
          tf.layers.dense({
            activation: 'softmax',
            units: numberClass,
          }),
        );
        model.compile({
          loss: 'categoricalCrossentropy',
          optimizer: tf.train.adam(0.01),
          metrics: ['accuracy'],
        });
        // const callbacks = tfvis.show.fitCallbacks(container, metrics);
        const history = await model.fit(xTrainFull, yTrainFull, {
          epochs: 100,
          shuffle: true,
          callbacks: {
            onBatchEnd: (onBatch, logBatch) => {
              // console.log(onBatch)
              console.log({ onBatch, logBatch });
            },
            onEpochEnd: async (epoch, logs) => {
              console.log(logs);
              this.setState(prevState => ({
                ...prevState,
                dataAcc: [
                  ...prevState.dataAcc,
                  {
                    epoch,
                    acc: logs.acc,
                  },
                ],
                dataLoss: [
                  ...prevState.dataLoss,
                  {
                    epoch,
                    loss: logs.loss,
                  },
                ],
                epoch,
              }));
              this.setState({
                epoch,
                acc: logs.acc,
              });
              valAcc = logs.val_acc;
              if (logs.acc * 100 > 99) {
                model.stopTraining = true;
              } else {
                await tf.nextFrame();
              }
              // await tf.nextFrame();
            },
          },
          // callbacks,
        });
        this.setState({ model });
        const yPredict = model.predict(xTestFull);
        yPredict.print(true);
        yPredict.argMax(1).print();
        yTestFull.print(true);
        console.log(history.history.loss[0]);
        const testResult = model.evaluate(xTestFull, yTestFull);
        const testAccPercent = testResult[1].dataSync()[0] * 100;
        const finalValAccPercent = valAcc * 100;
        console.log(
          `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; ` +
            `Final test accuracy: ${testAccPercent.toFixed(1)}%
                `,
        );
        this.setState({ statusTraining: false });
      }
    });
  };

  handleSaveAndUpdate = async () => {
    try {
      await this.state.model.save('http://localhost:3000/api/ai/save');
      message.success('Mô hình đã lưu và cập nhật');
    } catch (e) {
      message.error('Có lỗi khi lưu model');
    }
  };

  handleShowMatrixConfusionMatrix = async () => {
    const { xTestFull, yTestFull, model } = this.state;
    if (xTestFull === null || yTestFull === null || model === null) {
      return;
    }
    const yPredict = model.predict(xTestFull);
    yPredict.print(true);
    yPredict.argMax(1).print();
    yTestFull.print(true);
    const testResult = model.evaluate(xTestFull, yTestFull);
    const testAccPercent = testResult[1].dataSync()[0] * 100;
    console.log(
      `Final test accuracy: ${testAccPercent.toFixed(1)}%
                `,
    );
    const confusionMatrix = await tfvis.metrics.confusionMatrix(
      yTestFull.argMax(1),
      yPredict.argMax(1),
    );

    tfvis.render.confusionMatrix(
      {
        name: 'Confusion Matrix',
        tab: 'Evaluation',
      },
      {
        values: confusionMatrix,
        // tickLabels: classNames
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
      model,
    } = this.state;
    console.log({ model });
    if (model == null) {
      console.log('dasd');
    }
    return (
      <div>
        <Button onClick={this.handleTrain} disabled={this.state.statusTraining}>
          Start train
        </Button>
        <Button disabled={model == null} onClick={this.handleSaveAndUpdate}>
          Save model
        </Button>
        <Button
          onClick={this.handleShowMatrixConfusionMatrix}
          disabled={this.state.statusTraining}
        >
          ShowMatrixConfusionMatrix
        </Button>
        <Progress
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          percent={this.state.epoch}
          status="active"
        />
        <p>Loss</p>
        <LineChart
          width={500}
          height={300}
          data={this.state.dataLoss}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="loss" stroke="#82ca9d" />
        </LineChart>
        <p>Accurance</p>
        <LineChart
          width={500}
          height={300}
          data={this.state.dataAcc}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis type="number" domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="acc" stroke="#82ca9d" />
        </LineChart>
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
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  onUpdateModel: () => dispatch(onUpdateModel()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(LayoutConfigurationModel));
