import React from 'react';
import HeatMap from 'react-heatmap-grid';
import ConfusionMatrix from 'ml-confusion-matrix';

const ShowConfusion = ({ labels, trueLabels, predictedLabels }) => {
  const CM = ConfusionMatrix.fromLabels(trueLabels, predictedLabels);
  const sum = data => {
    console.log(data);
    return data.reduce((partial_sum, a) => partial_sum + a);
  };
  const normal = CM.matrix.map(el =>
    el.map(item => (item / sum(el)).toFixed(3)),
  );
  return (
    <div style={{ fontSize: '12px' }}>
      <HeatMap
        xLabels={labels}
        yLabels={labels}
        xLabelsLocation="bottom"
        height={60}
        squares
        xLabelWidth={80}
        yLabelTextAlign="center"
        data={normal}
        squares
        onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
          fontSize: '11.5px',
          color: '#000',
        })}
        cellRender={value => value && `${value}`}
      />
    </div>
  );
};
export default ShowConfusion;
