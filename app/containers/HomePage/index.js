/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  constructor(props) {
    super(props);
    this.imageTag = React.createRef();
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.state = {
      options: undefined,
      ctx: undefined,
      interval: undefined,
      faces: undefined,
    };
  }

  async componentDidMount() {
    console.log(this.videoTag)
    this.setState({
      ctx: this.canvasTag.getContext('2d'),
    });
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
    const minConfidence = 0.5;
    // tiny_face_detector options
    const inputSize = 512;
    const scoreThreshold = 0.5;
    const options = await new faceapi.TinyFaceDetectorOptions({
      inputSize,
      scoreThreshold,
    });
    this.setState({ options });
  }
  grabFrame = ()=>{
    faceapi
      .detectAllFaces(this.videoTag.current, this.state.options)
      .then(data => {
        this.setState({ faces: data });
      })
      .catch(err => console.log(err));
  }
  detected = () => {
    console.log(this.state.options);
    faceapi
      .detectAllFaces(this.imageTag.current, this.state.options)
      .then(data => {
        this.setState({ faces: data });
        // this.drawCanasRect(data);
      })
      .catch(err => console.log(err));
  };

  play=()=>{
    // console.log(this.state.options)
    console.log(this.videoTag)
    if (this.videoTag.current.paused) {
      if (this.state.interval) {
        clearInterval(this.state.interval);
      }
      this.videoTag.current.play();
      this.setState({
        interval: setInterval(this.grabFrame, 1000 / 24),
      });
    } else {
      clearInterval(this.state.interval);
      this.setState({
        interval: undefined,
      });
      this.videoTag.current.pause();
    }
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };
    const { faces } = this.state;
    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <div>
          <canvas
            ref={canvas => (this.canvasTag = canvas)}
            width="400"
            height="220"
          />
          <div>
            <button onClick={this.play}>Detected</button>
          </div>
          <div style={{ position: 'relative' }}>
            <video
              style={{ position: 'absolute' }}
              ref={this.videoTag}
              src="/media/bbt.mp4"
              muted
              loop
            />
            {/*<img*/}
              {/*style={{ position: 'absolute' }}*/}
              {/*ref={this.imageTag}*/}
              {/*src="/images/bbt2.jpg"*/}
              {/*alt="no image"*/}
            {/*/>*/}
            <div style={{ position: 'absolute' }}>
              <Stage width={1366} height={768}>
                <Layer>
                  <Text text="Try click on rect" />
                  {faces &&
                    faces.map(face => {
                      const { x, y, width, height } = face.box;
                      return (
                        <Rect
                          key={face}
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          stroke="green"
                        />
                      );
                    })}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
