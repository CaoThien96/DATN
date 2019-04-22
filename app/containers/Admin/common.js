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
export default {
  removeOneSubscribedInTopic,
  addOneSubscribedToTopic,
  sendMessageToTopic,
};
