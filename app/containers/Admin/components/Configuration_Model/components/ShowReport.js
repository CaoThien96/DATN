import React from 'react';

const ShowReport = props => {
  const {
    reportDataTest: { accuracy, fscore, precision, recall },
  } = props;
  return (
    <div>
      <h2>Report</h2>
      <ul>
        <li>
          <span>Accuracy: {accuracy} </span>
        </li>
        <li>
          <span>Fscore: {fscore}</span>
        </li>
        <li>
          <span>Recall: {precision}</span>
        </li>
        <li>
          <span>Precision: {recall}</span>
        </li>
      </ul>
    </div>
  );
};
export default ShowReport;
