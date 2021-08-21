import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import { ConfigProvider } from '@/ConfigContext';

function Root() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  );
}

ReactDOM.render(
  <Root />,
  document.getElementById('app'),
);
