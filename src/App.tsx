import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { RoutePath } from '@/routes';
import Home from '@/pages/index';

function App() {
  return (
    <Switch>
      <Route path={RoutePath.home} component={Home} />
    </Switch>
  );
}

export default App;
