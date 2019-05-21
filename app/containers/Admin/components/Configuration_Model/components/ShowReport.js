import React from 'react';

const ShowReport = props => {
  const { reportDataTest } = props;
  return (
    <div>
      <h2>Report</h2>
      {reportDataTest.accuracy ? (
        <ul>
          <li>
            <span>Accuracy: {reportDataTest.accuracy} </span>
          </li>
          <li>
            <span>
              F1-score:{' '}
              {(2 * reportDataTest.recall * reportDataTest.precision) /
                (reportDataTest.recall + reportDataTest.precision)}
            </span>
          </li>
          <li>
            <span>Recall: {reportDataTest.precision}</span>
          </li>
          <li>
            <span>Precision: {reportDataTest.recall}</span>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
export default ShowReport;
