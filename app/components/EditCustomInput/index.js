import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/es/input/Input';
import Row from 'antd/es/grid/row';
import Styled from 'styled-components';
import Button from 'antd/es/button/button';
import Col from 'antd/es/grid/col';
import moment from 'moment';
import Edit from './Edit';
import request from '../../utils/request';
import CustomInput from './CustomInput';
import CustomResult from './CustomResult';
const Span = Styled.span`
     font-size: 20px;
  color:red
`;
class Index extends Component {
  constructor(props) {
    super(props);
    this.resultTag = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      edit: false,
      value: null,
    };
  }

  componentWillMount() {
    let { name, defaultValue, typeInput } = this.props;
    if (typeInput == 'time') {
      defaultValue = moment().unix();
    }
    this.setState({ value: defaultValue });
    request(`/api/configuration/${name}`)
      .then(res => {
        this.setState({
          value: res.payload.value,
        });
      })
      .catch(err => {});
  }

  onEdit = () => {
    this.setState(prevState => {
      if (prevState.edit) {
        return { ...prevState, edit: 0 };
      }
      return { ...prevState, edit: 1 };
    });
  };

  onSave = () => {
    const { name, typeInput } = this.props;
    request('/api/configuration', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
        name,
        value:
          typeInput == 'time'
            ? this.inputRef.current.state.value.unix()
            : this.inputRef.current.state.value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        this.setState({
          value:
            typeInput == 'time'
              ? this.inputRef.current.state.value.unix()
              : this.inputRef.current.state.value,
        });
        this.onEdit();
      })
      .catch(err => {});
  };

  render() {
    const { label, name, typeInput, defaultValue } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Row>
          <Col span={8}>
            <span>{label} :</span>
          </Col>
          <Col span={12}>
            {this.state.edit ? (
              <CustomInput
                inputRef={this.inputRef}
                value={this.state.value}
                resultTag={this.resultTag}
                type={typeInput}
              />
            ) : (
              <CustomResult value={value} type={typeInput} />
            )}
          </Col>
          <Col span={4}>
            {this.state.edit ? (
              <div className="m-l-15" style={{ display: 'inline-block' }}>
                <Button onClick={this.onSave}>Save</Button>
                <Button onClick={this.onEdit}>Cancel</Button>
              </div>
            ) : (
              <div className="m-l-15" style={{ display: 'inline-block' }}>
                <Button onClick={this.onEdit}>Edit</Button>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

Index.defaultProps = {};
Index.propTypes = {
  name: PropTypes.string.isRequired,
  typeInput: PropTypes.string.isRequired,
};

export default Index;
