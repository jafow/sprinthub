// @flow
type actionType = {
  +type: string
}

// login.js
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// user.js
export const LOAD_BOARDS_SUCCESS = 'LOAD_BOARDS_SUCCESS';
export const ADD_TRELLO_LIST_SUCCESS = 'ADD_TRELLO_LIST_SUCCESS';
export const REMOVE_TRELLO_LIST_SUCCESS = 'REMOVE_TRELLO_LIST_SUCCESS';

// list.js
export const MAP_CARDS_SUCCESS = 'MAP_CARDS_SUCCESS';