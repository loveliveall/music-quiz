import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  useColorMode,
  Center,
  Container,
} from '@chakra-ui/react';

import LabeledSwitch from '@/components/LabeledSwitch';

import { RoutePath } from '@/routes';
import Home from '@/pages/index';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW="container.lg" pt={4}>
      <Switch>
        <Route path={RoutePath.home} component={Home} />
      </Switch>
      <Center py={6}>
        <LabeledSwitch
          id="toggle-color-mode"
          label="다크 모드"
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
        />
      </Center>
    </Container>
  );
}

export default App;
