import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import "react-datepicker/dist/react-datepicker.css"
import {Provider} from 'react-redux';
import {createStore,compose,combineReducers,applyMiddleware} from 'redux';
import {BrowserRouter} from 'react-router-dom';

import complaintsReducer from './store/reducers/adtlComplaintsReducer';
import thunk from 'redux-thunk';

//const composeEnhancers = process.env.NODE_ENV === 'development'? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__:null|| compose;
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  users:complaintsReducer,
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));


ReactDOM.render(
  <Provider store={store}>
   
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </Provider>
  ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();