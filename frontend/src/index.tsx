import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import './index.css';
import store from '@state/index';
import {Home, Admin, Auth} from '@components';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Auth>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Home />} />
            <Route path="/price" element={<Home />} />
            <Route path="/ticket" element={<Home />} />
            <Route path="/about" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Auth>
      </Router>
    </Provider>
  // </React.StrictMode>
);
