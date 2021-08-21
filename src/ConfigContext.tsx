import React from 'react';

type Config = {
  ll: boolean,
  lls: boolean,
  niji: boolean,
  llss: boolean,
  life: 'inf' | number,
  hint: boolean,
};

const initialConfig: Config = {
  ll: true,
  lls: true,
  niji: true,
  llss: true,
  life: 1,
  hint: false,
};

type ConfigCtx = {
  config: Config,
  setConfig: (newV: Config) => void,
};

const ConfigContext = React.createContext<ConfigCtx>({
  config: initialConfig,
  setConfig: () => {},
});

export const useConfigContext = () => React.useContext(ConfigContext);

export function ConfigProvider({ children }: React.PropsWithChildren<{}>) {
  const [config, setConfig] = React.useState<Config>(initialConfig);
  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
