import request from 'utils/requestV2';
const sendMessageToTopic = (topic, title, body, action = false) => {
  const data = {
    notification: {
      title,
      body,
      action,
    },
    to: `/topics/${topic}`,
  };
  return new Promise((resolve, reject) => {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAggvnA98:APA91bF9W9KwnXUQ1OjX7nDt7f-GPStM_uFlT5H21ja7Zzkbhc7znC0OvTUsd6Od1M8PsDnQe7VYBFA6AHnrVzjDMkQHzOVUxKQNMQDQ8WKl0Ef2AvM-2z-odVomc9Hk-LG4z5bGnjGO',
      },
    })
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
};
function addOneSubscribedToTopic(topic, token) {
  return new Promise((resolve, reject) => {
    fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAggvnA98:APA91bF9W9KwnXUQ1OjX7nDt7f-GPStM_uFlT5H21ja7Zzkbhc7znC0OvTUsd6Od1M8PsDnQe7VYBFA6AHnrVzjDMkQHzOVUxKQNMQDQ8WKl0Ef2AvM-2z-odVomc9Hk-LG4z5bGnjGO',
      },
    })
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
}
function removeOneSubscribedInTopic(nameTopic, registration_token) {
  const data = {
    to: `/topics/${nameTopic}`,
    registration_tokens: [registration_token],
  };
  return new Promise((resolve, reject) => {
    fetch(`https://iid.googleapis.com/iid/v1:batchRemove`, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAggvnA98:APA91bF9W9KwnXUQ1OjX7nDt7f-GPStM_uFlT5H21ja7Zzkbhc7znC0OvTUsd6Od1M8PsDnQe7VYBFA6AHnrVzjDMkQHzOVUxKQNMQDQ8WKl0Ef2AvM-2z-odVomc9Hk-LG4z5bGnjGO',
      },
    })
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
}
function getGrayImage(input) {
  const output = document.createElement('canvas');
  output.width = input.width;
  output.height = input.height;
  // Get the context for the loaded image
  const inputContext = input.getContext('2d');
  // get the image data;
  const imageData = inputContext.getImageData(0, 0, input.width, input.height);
  // Get the CanvasPixelArray
  const data = imageData.data;

  // Get length of all pixels in image each pixel made up of 4 elements for each pixel, one for Red, Green, Blue and Alpha
  const arraylength = input.width * input.height * 4;
  // Go through each pixel from bottom right to top left and alter to its gray equiv

  // Common formula for converting to grayscale.
  // gray = 0.3*R + 0.59*G + 0.11*B
  for (let i = arraylength - 1; i > 0; i -= 4) {
    // R= i-3, G = i-2 and B = i-1
    // Get our gray shade using the formula
    const gray = 0.3 * data[i - 3] + 0.59 * data[i - 2] + 0.11 * data[i - 1];
    // Set our 3 RGB channels to the computed gray.
    data[i - 3] = gray;
    data[i - 2] = gray;
    data[i - 1] = gray;
  }
  // get the output context
  const outputContext = output.getContext('2d');
  // Display the output image
  outputContext.putImageData(imageData, 0, 0);
  return output;
}
function saveImage(canvas = [], userIid) {
  const getDataUrlsTask = canvas.map(el => el.toDataURL());
  console.log({getDataUrlsTask})
  request(`/api/employee/save-data-training/${userIid}`, {
    method: 'POST',
    body: {
      dataUrls: JSON.stringify(getDataUrlsTask),
    },
  }).then(data => {
    console.log({ data });
  });
}
export default {
  removeOneSubscribedInTopic,
  addOneSubscribedToTopic,
  sendMessageToTopic,
  getGrayImage,
  saveImage
};
