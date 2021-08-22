import React from 'react';
import {
  Button,
  ButtonGroup,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import LabeledSwitch from '@/components/LabeledSwitch';

import { useConfigContext } from '@/ConfigContext';
import {
  LOVELIVE_SONGS,
  LOVELIVE_SUNSHINE_SONGS,
  LOVELIVE_NIJI_SONGS,
  LOVELIVE_SUPERSTAR_SONGS,
} from '@/songlist';

function Home() {
  const { config, setConfig } = useConfigContext();
  return (
    <VStack spacing={4}>
      <Stack direction={{ base: 'column', md: 'row' }} alignItems="center">
        <Heading size="lg">러브라이브! 시리즈</Heading>
        <Heading size="lg">음악 퀴즈</Heading>
      </Stack>
      <VStack>
        <Text>주어진 문제 음원을 듣고 곡을 맞춰주세요!</Text>
        <Text>※ 주의: 브라우저를 종료하면 게임은 초기화 됩니다.</Text>
      </VStack>
      <Heading size="md">게임 설정</Heading>
      <Heading size="sm">게임 모드</Heading>
      <ButtonGroup isAttached variant="outline">
        <Button
          isActive={config.life === 1}
          onClick={() => setConfig({ ...config, life: 1 })}
        >
          서든데스
        </Button>
        <Button
          isActive={config.life === 3}
          onClick={() => setConfig({ ...config, life: 3 })}
        >
          일반게임
        </Button>
        <Button
          isActive={config.life === 'inf'}
          onClick={() => setConfig({ ...config, life: 'inf' })}
        >
          연습모드
        </Button>
      </ButtonGroup>
      <Heading size="sm">출제 범위</Heading>
      <VStack>
        <LabeledSwitch
          id="lovelive"
          label={`러브라이브(${LOVELIVE_SONGS.length}곡)`}
          isChecked={config.ll}
          onChange={() => {
            setConfig({
              ...config,
              ll: !config.ll,
            });
          }}
        />
        <LabeledSwitch
          id="lovelive-sunshine"
          label={`러브라이브 선샤인(${LOVELIVE_SUNSHINE_SONGS.length}곡)`}
          isChecked={config.lls}
          onChange={() => {
            setConfig({
              ...config,
              lls: !config.lls,
            });
          }}
        />
        <LabeledSwitch
          id="lovelive-niji"
          label={`러브라이브 니지동(${LOVELIVE_NIJI_SONGS.length}곡)`}
          isChecked={config.niji}
          onChange={() => {
            setConfig({
              ...config,
              niji: !config.niji,
            });
          }}
        />
        <LabeledSwitch
          id="lovelive-superstar"
          label={`러브라이브 슈퍼스타(${LOVELIVE_SUPERSTAR_SONGS.length}곡)`}
          isChecked={config.llss}
          onChange={() => {
            setConfig({
              ...config,
              llss: !config.llss,
            });
          }}
        />
      </VStack>
      <Heading size="sm">기타 설정</Heading>
      <VStack>
        <LabeledSwitch
          id="hint"
          label="힌트 제공 여부"
          isChecked={config.hint}
          onChange={() => {
            setConfig({
              ...config,
              hint: !config.hint,
            });
          }}
        />
      </VStack>
      <Button>시작!</Button>
    </VStack>
  );
}

export default Home;
