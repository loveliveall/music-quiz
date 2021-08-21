import React from 'react';
import { useConfigContext } from '@/ConfigContext';

function Home() {
  const { config } = useConfigContext();
  return (
    <div>
      Home here
      {JSON.stringify(config)}
    </div>
  );
}

export default Home;
