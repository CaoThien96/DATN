/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';

export const LOAD_USER_LOGIN = 'boilerplate/App/LOAD_USER_LOGIN';
export const LOAD_USER_LOGIN_SUCCESS =
  'boilerplate/App/LOAD_USER_LOGIN_SUCCESS';
export const LOAD_USER_LOGIN_FAIL = 'boilerplate/App/LOAD_USER_LOGIN_FAIL';

export const REMOVE_USER = 'boilerplate/App/REMOVE_USER';

export const SHOW_LOADING = 'boilerplate/App/SHOW_LOADING';
export const HIDDEN_LOADING = 'boilerplate/App/HIDDEN_LOADING';

export const UPDATE_MODEL = 'boilerplate/App/Update_Model';
export const SHOULD_UPDATE_MODEL = 'boilerplate/App/Should_Update_Model';

