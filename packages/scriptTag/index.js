import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './src/App';

const createReactContainer = () => {
  let container = document.getElementById('ig_container');
  return container;
};

const container = createReactContainer();
const root = createRoot(container);
root.render(<App />);
