// avada-instagram.js

import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './src/App';

const createReactContainer = () => {
  let container = document.getElementById('react-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'react-container';
    document.querySelector('.avada-instagram-section').appendChild(container);
  }
  return container;
};

const container = createReactContainer();
const root = createRoot(container);
root.render(<App />);
