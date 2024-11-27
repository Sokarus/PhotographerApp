import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import store from '@state/index';
import {Home, Admin, Auth, Portfolio, Photosession} from '@components';
import './index.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-photo-album/rows.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <Router>
      <Auth>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/price" element={<Home />} />
          <Route path="/ticket" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/portfolio/photosession" element={<Photosession />} />
          <Route path="/client/photosession" element={<Photosession />} />
        </Routes>
      </Auth>
    </Router>
    <ToastContainer />
  </Provider>
);
