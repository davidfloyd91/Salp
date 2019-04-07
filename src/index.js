import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const defaultState = {
  chartType: '',
  color: '#0080FF',
  colors: [],
  columns: 2,
  grid: [],
  horizontal: false,
  input: '',
  label: '',
  max: 10,
  min: -10,
  new: false,
  rows: 10,
  showSetup: true,
  showTable: false,
  ticks: 0,
  title: '',
  warn: ''
};

const initialState = {
  chart: null,
  chartId: 0,
  charts: [],
  chartType: '',
  userId: 1,
  ...defaultState
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DEFAULT':
      return {...state, ...defaultState}
    case 'SET_CHART':
      return {...state, chart: action.payload}
    case 'SET_CHART_ID':
      return {...state, chartId: action.payload }
    case 'SET_CHARTS':
      return {...state, charts: action.payload }
    case 'SET_CHART_TYPE':
      return { ...state, chartType: action.payload }
    case 'SET_COLOR':
      return { ...state, color: action.payload }
    case 'SET_COLUMNS':
      return {...state, columns: action.payload }
    case 'SET_GRID':
      return {...state, grid: action.payload }
    case 'TOGGLE_HORIZONTAL':
      return { ...state, horizontal: !state.horizontal }
    case 'SET_INPUT':
      return { ...state, input: action.payload }
    case 'SET_MAX':
      return { ...state, max: action.payload }
    case 'SET_MIN':
      return { ...state, min: action.payload }
    case 'TOGGLE_NEW':
      return { ...state, new: !state.new }
    case 'SET_ROWS':
      return {...state, rows: action.payload }
    case 'SET_SHOW_SETUP':
      return {...state, showSetup: action.payload }
    case 'SET_SHOW_TABLE':
      return {...state, showTable: action.payload }
    case 'SET_TICKS':
      return { ...state, ticks: action.payload }
    case 'WARN':
      return { ...state, warn: action.payload }
    case 'SET_NAME_TO_VALUE':
      return { ...state, [action.payload.key]: action.payload.value }
    default:
      return state;
  };
};

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
