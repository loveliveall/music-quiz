import React from 'react';
import { useHistory } from 'react-router-dom';
import { sha256 } from 'js-sha256';
import {
  useColorModeValue,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import SearchableSelect from '@/components/SearchableSelect';

import { useConfigContext, Config } from '@/ConfigContext';
import { RoutePath } from '@/routes';
import { choice } from '@/utils';
import {
  LOVELIVE_SONGS,
  LOVELIVE_SUNSHINE_SONGS,
  LOVELIVE_NIJI_SONGS,
  LOVELIVE_SUPERSTAR_SONGS,
} from '@/songlist';
import { SongEntry } from '@/songlist/types';

function getSongList(config: Config) {
  return (config.ll ? LOVELIVE_SONGS : []).concat(
    config.lls ? LOVELIVE_SUNSHINE_SONGS : [],
  ).concat(
    config.niji ? LOVELIVE_NIJI_SONGS : [],
  ).concat(
    config.llss ? LOVELIVE_SUPERSTAR_SONGS : [],
  ).filter((e) => !config.excludeSameSong || !e.excludable);
}

type ProblemLevel = {
  lvl: number,
  duration: number,
};
function getProblemLevel(qNo: number, config: Config): ProblemLevel {
  if (config.easyMode) return { lvl: 0, duration: 10 };
  if (qNo <= 5) return { lvl: 1, duration: 3 };
  if (qNo <= 10) return { lvl: 2, duration: 2 };
  if (qNo <= 15) return { lvl: 3, duration: 1.5 };
  if (qNo <= 20) return { lvl: 4, duration: 1 };
  if (qNo <= 25) return { lvl: 5, duration: 0.75 };
  return { lvl: 6, duration: 0.5 };
}

function genAudioPath(qNo: number, answerId: string, problemPos: number, config: Config): string {
  const { lvl } = getProblemLevel(qNo, config);
  const pPos = config.easyMode ? 30 : problemPos; // Easy mode always start from 30 sec
  const filename = sha256(`${answerId}-${pPos}-${lvl}`);
  const lvlStr = `0${lvl}`.slice(-2);
  return `https://rinachan-box.s3-us-west-2.amazonaws.com/music-quiz/audio/level${lvlStr}/${filename}.mp3`;
}

function SubText({ children }: React.PropsWithChildren<{}>) {
  const subLabelColor = useColorModeValue('gray.500', 'gray.500');
  return (
    <Text fontSize="xs" textColor={subLabelColor}>{children}</Text>
  );
}

const PROBLEM_POS_DOMAIN = [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 104, 113, 122, 131, 140, 149, 158, 167, 176];
type GameState = {
  qNo: number,
  answer: SongEntry,
  problemPos: number,
  wrongCount: number,
  judgeResult: boolean | null, // Null means problem screen
};

function Game() {
  const history = useHistory();
  const { config } = useConfigContext();
  const songlist = getSongList(config);
  const [locale, setLocale] = React.useState<'jp' | 'kr'>('jp');
  const [selectedSongId, setSelectedSongId] = React.useState(songlist[0]!.id);
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [openHint, setOpenHint] = React.useState(false);

  React.useEffect(() => {
    if (gameState === null) {
      // Initialize game
      setGameState({
        qNo: 1,
        answer: choice(songlist)!, // At least one song exists in songlist
        problemPos: choice(PROBLEM_POS_DOMAIN)!,
        wrongCount: 0,
        judgeResult: null,
      });
    }
  }, [gameState]);

  if (gameState === null) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const {
    qNo, answer, problemPos, judgeResult, wrongCount,
  } = gameState;
  const { duration } = getProblemLevel(qNo, config);

  const onSubmission = () => {
    if (selectedSongId === answer.id) {
      // Correct
      setGameState({
        ...gameState,
        judgeResult: true,
      });
    } else {
      setGameState({
        ...gameState,
        wrongCount: gameState.wrongCount + 1,
        judgeResult: false,
      });
    }
  };

  const onNextClick = () => {
    if (judgeResult === null) return; // Cannot happen
    const newQNo = judgeResult ? qNo + 1 : qNo;
    // Set state for next game
    setGameState({
      qNo: newQNo,
      answer: choice(songlist)!,
      problemPos: choice(PROBLEM_POS_DOMAIN)!,
      wrongCount: gameState.wrongCount,
      judgeResult: null,
    });
    setOpenHint(false);
    setSelectedSongId(songlist[0]!.id);
  };

  return (
    <VStack spacing={4}>
      <Button onClick={() => history.push(RoutePath.home)} colorScheme="green">?????????</Button>
      <Heading>{`?????? ${qNo}`}</Heading>
      <VStack spacing={0}>
        {config.life === 'inf' && <SubText>?????? ??????: ????????????</SubText>}
        {config.life === 1 && <SubText>?????? ??????: ????????????</SubText>}
        {config.life === 3 && <SubText>{`?????? ??????: ???????????? (?????? ?????? ${wrongCount}/3)`}</SubText>}
        {config.easyMode && <SubText>?????????: ?????? ??????</SubText>}
        {config.hint ? <SubText>?????? ??????</SubText> : <SubText>?????? ??????</SubText>}
        {config.excludeSameSong && <SubText>?????? ????????? ?????? ??????????????? ??? ??????</SubText>}
        <SubText>{`?????? ?????? ??? ${songlist.length}???`}</SubText>
        {config.ll && <SubText>???????????????</SubText>}
        {config.lls && <SubText>??????????????? ?????????</SubText>}
        {config.niji && <SubText>??????????????? ?????????</SubText>}
        {config.llss && <SubText>??????????????? ????????????</SubText>}
      </VStack>
      <Text>{`?????? ??????: ${config.easyMode ? 10 : duration}???`}</Text>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        src={genAudioPath(qNo, answer.id, problemPos, config)}
        controls
      >
        HTML audio tag is not supported
      </audio>
      {judgeResult === null && (
        <>
          {config.hint && (
            <>
              {!openHint && <Button size="sm" onClick={() => setOpenHint(true)}>?????? ??????</Button>}
              {openHint && (
                <VStack spacing={0}>
                  <Text>{`??????: ${answer.year}??? ??????`}</Text>
                  <Text>{`????????????: ${answer.artist}`}</Text>
                </VStack>
              )}
            </>
          )}
          <SearchableSelect
            itemList={songlist.map((e) => ({
              key: e.id,
              label: e.name[locale],
              subLabel: `by ${e.artist}`,
              searchKeywords: [e.name.jp, e.name.kr, ...e.alias],
            }))}
            selectedItemKey={selectedSongId}
            setSelectedItemKey={setSelectedSongId}
          />
          <Button onClick={onSubmission} colorScheme="green">??????</Button>
        </>
      )}
      {judgeResult !== null && (
        <>
          <Text>
            {judgeResult ? '??????????????? ??(???????????????)??' : `??????????????? ?????(??????????\`)????? (?????? ??????: ${gameState.wrongCount})`}
          </Text>
          {!judgeResult && (
            <Text>{`????????? ${answer.name[locale]} ????????? (*????????)`}</Text>
          )}
          {config.life === 'inf' || gameState.wrongCount < config.life ? (
            <Button onClick={onNextClick}>?????? ??????</Button>
          ) : (
            <>
              <Text>????????? ?????????????????????</Text>
              <Text>{`?????? ??????: ${qNo - 1}???, ?????? ??????: ${wrongCount}???`}</Text>
            </>
          )}
        </>
      )}
      <VStack>
        <Heading size="sm">??? ?????? ?????? ??????</Heading>
        <ButtonGroup isAttached variant="outline">
          <Button isActive={locale === 'kr'} onClick={() => setLocale('kr')}>?????????</Button>
          <Button isActive={locale === 'jp'} onClick={() => setLocale('jp')}>?????????</Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  );
}

export default Game;
