import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Heading,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import LabeledSwitch from '@/components/LabeledSwitch';

import { useConfigContext } from '@/ConfigContext';
import { RoutePath } from '@/routes';
import {
  LOVELIVE_SONGS,
  LOVELIVE_SUNSHINE_SONGS,
  LOVELIVE_NIJI_SONGS,
  LOVELIVE_SUPERSTAR_SONGS,
} from '@/songlist';

function Home() {
  const history = useHistory();
  const { config, setConfig } = useConfigContext();
  const [errMsg, setErrMsg] = React.useState('');
  const onStartClick = () => {
    if (!config.ll && !config.lls && !config.niji && !config.llss) {
      setErrMsg('최소 하나의 출제 범위는 선택되어야 합니다');
      return;
    }
    history.push(RoutePath.game);
  };

  return (
    <VStack spacing={4}>
      <Stack direction={{ base: 'column', md: 'row' }} alignItems="center">
        <Heading size="lg">러브라이브! 시리즈</Heading>
        <Heading size="lg">음악 퀴즈</Heading>
      </Stack>
      <VStack>
        <Text>주어진 문제 음원을 듣고 곡을 맞춰주세요!</Text>
        <Text>※ 주의: 브라우저를 종료하거나 새로고침하면 게임이 초기화 됩니다.</Text>
      </VStack>
      <Heading size="md">게임 설정</Heading>
      <Heading size="sm">게임 모드</Heading>
      <ButtonGroup isAttached variant="outline" colorScheme="green">
        <Tooltip hasArrow label="틀리는 순간 게임이 끝납니다">
          <Button
            isActive={config.life === 1}
            onClick={() => setConfig({ ...config, life: 1 })}
          >
            서든데스
          </Button>
        </Tooltip>
        <Tooltip hasArrow label="3번 틀리면 게임이 종료됩니다">
          <Button
            isActive={config.life === 3}
            onClick={() => setConfig({ ...config, life: 3 })}
          >
            일반게임
          </Button>
        </Tooltip>
        <Tooltip hasArrow label="아무리 틀려도 게임이 계속됩니다">
          <Button
            isActive={config.life === 'inf'}
            onClick={() => setConfig({ ...config, life: 'inf' })}
          >
            연습모드
          </Button>
        </Tooltip>
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
          id="easy-mode"
          label="아주 쉬움 모드로 플레이"
          isChecked={config.easyMode}
          onChange={() => {
            setConfig({
              ...config,
              easyMode: !config.easyMode,
            });
          }}
        />
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
        <LabeledSwitch
          id="exclude-same-song"
          label="같은 곡이면서 다른 아티스트인 곡 제거"
          isChecked={config.excludeSameSong}
          onChange={() => {
            setConfig({
              ...config,
              excludeSameSong: !config.excludeSameSong,
            });
          }}
        />
      </VStack>
      <Button onClick={onStartClick} colorScheme="green">시작!</Button>
      {errMsg !== '' && (
        <Text color="red">{errMsg}</Text>
      )}
    </VStack>
  );
}

export default Home;
