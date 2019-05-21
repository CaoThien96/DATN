import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Input from 'antd/es/input-number';
import fscore from 'fscore';
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
  Label,
} from 'recharts';

import ShowConfusion from './components/ShowConfusion';
import ShowReport from './components/ShowReport';
import injectReducer from '../../../../utils/injectReducer';
import reducer from '../Checker/reducer';
import { onUpdateModel } from './actions';

class LayoutConfigurationModel extends Component {
  constructor(props) {
    super(props);
    this.matrixRef = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      statusTraining: false,
      status: 'un-train', // status: un-train, training, trained
      xTestFull: null,
      yTestFull: null,
      users: null,
      model: null,
      loop: 50,
      epoch: 0,
      stop: false,
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
    this.setState({ statusTraining: true, stop: false });
    if (this.state.status == 'trained') {
      this.setState({
        epoch: 0,
        dataAcc: [
          {
            epoch: 0,
            acc: 0,
          },
        ],
        dataLoss: [],
        model: null,
      });
    }
    this.setState({ status: 'training' });
    request('/api/ai/dataset').then(async data => {
      if (data.success) {
        let {
          xTrainFull,
          yTrainFull,
          xTestFull,
          yTestFull,
          xValidation,
          yValidation,
          numberClass,
          users,
        } = data;
        console.log({ length: users.length });
        xTrainFull = tf.tensor2d(xTrainFull);
        yTrainFull = tf.tensor2d(yTrainFull);

        xTestFull = tf.tensor2d(xTestFull);
        yTestFull = tf.tensor2d(yTestFull);

        xValidation = tf.tensor2d(xValidation);
        yValidation = tf.tensor2d(yValidation);

        this.setState({ xTestFull, yTestFull, users });
        xTrainFull.print(true);
        xTestFull.print(true);
        xValidation.print(true);
        yTestFull.print(true);
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
            activation: 'tanh',
            kernelInitializer: 'varianceScaling',
            useBias: true,
            units: 64,
          }),
        );
        model.add(tf.layers.dropout({ rate: 0.5 }));
        model.add(
          tf.layers.dense({
            activation: 'softmax',
            kernelInitializer: 'varianceScaling',
            useBias: false,
            units: numberClass,
          }),
        );
        model.compile({
          loss: 'categoricalCrossentropy',
          optimizer: tf.train.adam(0.02),
          metrics: ['accuracy'],
        });
        model.summary();
        // const callbacks = tfvis.show.fitCallbacks(container, metrics);
        const startTime = new Date();
        const history = await model.fit(xTrainFull, yTrainFull, {
          epochs: this.state.loop,
          validationData: [xValidation, yValidation],
          shuffle: true,
          callbacks: {
            onBatchEnd: (onBatch, logBatch) => {
              // console.log(onBatch)
              // console.log({ onBatch, logBatch });
            },
            onEpochEnd: async (epoch, logs) => {
              // console.log(logs);
              this.setState(prevState => ({
                ...prevState,
                dataAcc: [
                  ...prevState.dataAcc,
                  {
                    epoch,
                    acc: logs.acc,
                    val_acc: logs.val_acc,
                  },
                ],
                dataLoss: [
                  ...prevState.dataLoss,
                  {
                    epoch,
                    loss: logs.loss,
                    val_loss: logs.val_loss,
                  },
                ],
                epoch,
              }));
              this.setState({
                epoch,
                acc: logs.acc,
              });
              valAcc = logs.val_acc;
              if (this.state.stop) {
                const endTime1 = new Date();
                console.log(
                  'thoi gian dao tao: %d',
                  (endTime1 - startTime) / 1000,
                );
                model.stopTraining = true;
              } else {
                await tf.nextFrame();
              }
              // await tf.nextFrame();
            },
          },
          // callbacks,
        });
        const endTime2 = new Date();
        console.log('thoi gian dao tao: %d', (endTime2 - startTime) / 1000);
        this.setState({ model });
        // const yPredict = model.predict(xTestFull);
        // yPredict.print(true);
        // yPredict.argMax(1).print();
        // yTestFull.print(true);
        // console.log(history.history.loss[0]);
        // const testResult = model.evaluate(xTestFull, yTestFull);
        // const testAccPercent = testResult[1].dataSync()[0] * 100;
        // const finalValAccPercent = valAcc * 100;
        // console.log(
        //   `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; ` +
        //     `Final test accuracy: ${testAccPercent.toFixed(1)}%
        //         `,
        // );
        this.setState({ statusTraining: false });
        this.setState({ status: 'trained' });
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
    const testResult = model.evaluate(xTestFull, yTestFull);
    const testAccPercent = testResult[1].dataSync()[0] * 100;
    console.log(testResult)
    console.log(
      `Final test accuracy: ${testAccPercent.toFixed(1)}%
                `,
    );

    yPredict.argMax(1).print(true);
    const yPredictTmp = Object.values(yPredict.argMax(1).dataSync());
    const yTestFullTmp = Object.values(yTestFull.argMax(1).dataSync());
    console.log({
      yPredictTmp,
      yTestFullTmp,
    });
    request('/api/ai/fscore', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
        yTestFullTmp,
        yPredictTmp,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(data => {
      console.log({ data });
      this.setState({
        recall: data.payload.macro.RECALL,
        precision: data.payload.macro.PRECISION,
        f1Score: data.payload.macro,
        accuracy: testAccPercent.toFixed(1),
      });
    });
    // const { micro, matrix, accuracy, macro } = nodeml(
    //   yTestFullTmp,
    //   yPredictTmp,
    // );
    // console.log({ micro, matrix, accuracy, macro });
    const confusionMatrix = await tfvis.metrics.confusionMatrix(
      yTestFull.argMax(1),
      yPredict.argMax(1),
    );
    const classNames = this.state.users.map(el => el.email.slice(0, 8));
    tfvis.render.confusionMatrix(
      {
        name: 'Confusion Matrix',
        tab: 'Evaluation',
      },
      {
        values: confusionMatrix,
        tickLabels: classNames,
      },
      {
        width: 1200,
        height: 800,
      },
    );
    if (!tfvis.visor().isOpen()) {
      tfvis.visor().toggle();
    }
  };

  handleStopTraing = () => {
    this.setState({ stop: true });
  };

  showEvaluation = data => {};

  handleChangeEpoch = value => {
    this.setState({ loop: value });
  };

  render() {
    const {
      labels,
      trueLabels,
      predictedLabels,
      reportDataTest,
      model,
      status,
    } = this.state;
    console.log({ model });
    if (model == null) {
      console.log('dasd');
    }
    return (
      <div>
        <Button onClick={this.handleTrain} disabled={this.state.statusTraining}>
          {status == 'un-train'
            ? 'Bắt đầu huấn luyện'
            : status == 'training'
              ? 'Đang huấn luyện'
              : 'Huấn luyện lại'}
        </Button>
        <Button disabled={model == null} onClick={this.handleSaveAndUpdate}>
          {'Lưu và cập nhật mô hình'}
        </Button>
        <Button
          onClick={this.handleShowMatrixConfusionMatrix}
          disabled={this.state.statusTraining || model == null}
        >
          {'Hiển thị ma trận đánh giá'}
        </Button>
        <Button onClick={this.handleStopTraing}>Dừng đào tạo</Button>
        <Progress
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          percent={parseInt((this.state.epoch * 100) / 50)}
          status="active"
        />
        <Input
          type="number"
          onChange={this.handleChangeEpoch}
          style={{ width: '250px' }}
          placeholder="Nhập số lần lặp, mặc định 50 lần"
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
          <XAxis dataKey="epoch">
            <Label value="Epoch" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis
            label={{ value: 'Độ mất mát', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="loss" stroke="#82ca9d" />
          <Line type="monotone" dataKey="val_loss" stroke="#f2f23c" />
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
          <XAxis dataKey="epoch">
            <Label value="Epoch" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis
            label={{
              value: 'Độ chính xác',
              angle: -90,
              position: 'insideLeft',
            }}
            type="number"
            domain={[0, 1]}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="acc" stroke="#82ca9d" />
          <Line type="monotone" dataKey="val_acc" stroke="#f2f23c" />
        </LineChart>
        <Row>
          <Col>
            {this.state.recall ? (
              <div>
                {/*<ShowConfusion*/}
                  {/*labels={labels}*/}
                  {/*trueLabels={trueLabels}*/}
                  {/*predictedLabels={predictedLabels}*/}
                {/*/>*/}
                <ShowReport reportDataTest={this.state} />
              </div>
            ) : null}
          </Col>
        </Row>
        <Row />
        <div ref={this.matrixRef} />
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  onUpdateModel: () => dispatch(onUpdateModel()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(LayoutConfigurationModel));
