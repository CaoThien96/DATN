import * as lodash from 'lodash';
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  lodash.forEach(options.body, (value, key) => {
    if (key == 'files') {
      if(value){
        value.forEach(el => {
          formData.append('files[]', el.originFileObj);
        });
      }
    } else {
      formData.append(key, value);
    }
  });
  const newConfig = {
    ...options,
    body: formData,
    headers: new Headers({
      authorization: token,
      ...(options && options.headers),
    }),
  };
  return fetch(url, newConfig)
    .then(checkStatus)
    .then(parseJSON);
}
