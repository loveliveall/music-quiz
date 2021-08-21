import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  useColorMode,
  Box,
  Center,
  Container,
  FormControl,
  FormLabel,
  Switch as CUISwitch,
} from '@chakra-ui/react';

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
        <Box>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="toggle-color-mode" mb={0}>다크 모드</FormLabel>
            <CUISwitch
              id="toggle-color-mode"
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </FormControl>
        </Box>
      </Center>
    </Container>
  );
}

export default App;
