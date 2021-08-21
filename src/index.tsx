import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import App from '@/App';
import { ConfigProvider } from '@/ConfigContext';

function Root() {
  return (
    <ChakraProvider>
      <ConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ChakraProvider>
  );
}

ReactDOM.render(
  <Root />,
  document.getElementById('app'),
);
