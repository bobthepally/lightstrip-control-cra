import React from 'react';
import ReactDOM from 'react-dom';
import LightstripMain from './LightstripMain';
import * as serviceWorker from './serviceWorker';
import './index.css';

// Used mostly to set the background color. feels like a terrible hack,
// there must be a better way of doing this.
import { Helmet } from 'react-helmet';

ReactDOM.render(
  <React.StrictMode>
    <div className="application">
      <Helmet>
        <style>{'body {background-color: #131D44 };'}</style>
      </Helmet>
      <LightstripMain />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
