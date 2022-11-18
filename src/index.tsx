import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './data/store';
import WebSocketProvider, { WebSocketContext } from './components/WebSocketComponent';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {/* <BrowserRouter> */}
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </BrowserRouter>
  </Provider>
);
