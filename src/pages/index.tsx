import React from 'react';
import {
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import LabeledSwitch from '@/components/LabeledSwitch';

import { useConfigContext } from '@/ConfigContext';
import { LOVELIVE_SONGS } from '@/songlist';

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
      <Heading size="sm">출제 범위</Heading>
      <LabeledSwitch
        id="lovelive"
        label={`러브라이브 (${LOVELIVE_SONGS.length}곡)`}
        isChecked={config.ll}
        onChange={() => {
          setConfig({
            ...config,
            ll: !config.ll,
          });
        }}
      />
    </VStack>
  );
}

export default Home;
