import React from 'react';
import { useHistory } from 'react-router-dom';
import { sha256 } from 'js-sha256';
import {
  useColorModeValue,
  Button,
  ButtonGroup,
  Heading,
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
  );
}

type ProblemLevel = {
  lvl: number,
  duration: number,
};
function getProblemLevel(qNo: number): ProblemLevel {
  if (qNo <= 5) return { lvl: 1, duration: 3 };
  if (qNo <= 10) return { lvl: 2, duration: 2 };
  if (qNo <= 15) return { lvl: 3, duration: 1.5 };
  if (qNo <= 20) return { lvl: 4, duration: 1 };
  if (qNo <= 25) return { lvl: 5, duration: 0.75 };
  return { lvl: 6, duration: 0.5 };
}

function genAudioPath(qNo: number, answerId: string, problemPos: number): string {
  const { lvl } = getProblemLevel(qNo);
  const filename = sha256(`${answerId}-${problemPos}-${lvl}`);
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
    return <Text>Loading...</Text>;
  }

  const {
    qNo, answer, problemPos, judgeResult, wrongCount,
  } = gameState;
  const { duration } = getProblemLevel(qNo);

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
      <Button onClick={() => history.push(RoutePath.home)} colorScheme="green">홈으로</Button>
      <Heading>{`문제 ${qNo}`}</Heading>
      <VStack spacing={0}>
        {config.life === 'inf' && <SubText>게임 모드: 연습모드</SubText>}
        {config.life === 1 && <SubText>게임 모드: 서든데스</SubText>}
        {config.life === 3 && <SubText>{`게임 모드: 일반게임 (틀린 횟수 ${wrongCount}/3)`}</SubText>}
        {config.hint ? <SubText>힌트 있음</SubText> : <SubText>힌트 없음</SubText>}
        <SubText>{`출제 범위 총 ${songlist.length}곡`}</SubText>
        {config.ll && <SubText>러브라이브</SubText>}
        {config.lls && <SubText>러브라이브 선샤인</SubText>}
        {config.niji && <SubText>러브라이브 니지동</SubText>}
        {config.llss && <SubText>러브라이브 슈퍼스타</SubText>}
      </VStack>
      <Text>{`문제 길이: ${duration}초`}</Text>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        src={genAudioPath(qNo, answer.id, problemPos)}
        controls
      >
        HTML audio tag is not supported
      </audio>
      {judgeResult === null && (
        <>
          {config.hint && (
            <>
              {!openHint && <Button size="sm" onClick={() => setOpenHint(true)}>힌트 보기</Button>}
              {openHint && <Text>{`힌트: ${answer.year}년 발매`}</Text>}
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
          <Button onClick={onSubmission} colorScheme="green">제출</Button>
        </>
      )}
      {judgeResult !== null && (
        <>
          <Text>
            {judgeResult ? '정답입니다 ٩(๑＞◡＜๑)۶' : `틀렸습니다 ｡°(´∩ω∩\`)°｡ (틀린 횟수: ${gameState.wrongCount})`}
          </Text>
          {!judgeResult && (
            <Text>{`정답은 ${answer.name[locale]} 입니다 (*ﾟДﾟ)`}</Text>
          )}
          {config.life === 'inf' || gameState.wrongCount < config.life ? (
            <Button onClick={onNextClick}>다음 문제</Button>
          ) : (
            <>
              <Text>게임이 종료되었습니다</Text>
              <Text>{`맞힌 문제: ${qNo - 1}개, 틀린 문제: ${wrongCount}개`}</Text>
            </>
          )}
        </>
      )}
      <VStack>
        <Heading size="sm">곡 제목 표기 언어</Heading>
        <ButtonGroup isAttached variant="outline">
          <Button isActive={locale === 'kr'} onClick={() => setLocale('kr')}>한국어</Button>
          <Button isActive={locale === 'jp'} onClick={() => setLocale('jp')}>일본어</Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  );
}

export default Game;
