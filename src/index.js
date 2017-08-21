import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MiPFinder from './libs/mip/finder';
import MiPRobot from './libs/mip/robot';

export {MiPFinder as mipFinder, MiPRobot as mipRobot};

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
