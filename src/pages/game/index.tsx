import React from 'react';
import {
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useConfigContext, Config } from '@/ConfigContext';
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

function getProblemDuration(qNo: number) {
  if (qNo <= 5) return 3;
  if (qNo <= 10) return 2;
  if (qNo <= 15) return 1.5;
  if (qNo <= 20) return 1;
  if (qNo <= 25) return 0.75;
  return 0.5;
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
  const { config } = useConfigContext();
  const [gameState, setGameState] = React.useState<GameState | null>(null);

  React.useEffect(() => {
    if (gameState === null) {
      // Initialize game
      const songlist = getSongList(config);
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
    qNo, answer, problemPos, judgeResult,
  } = gameState;

  return (
    <VStack spacing={4}>
      <Heading>{`문제 ${qNo}`}</Heading>
      <Text>{`문제 길이: ${getProblemDuration(qNo)}초`}</Text>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        src={`./${answer.id}-${problemPos}-${getProblemDuration(qNo)}.mp3`}
        controls
      >
        HTML audio tag is not supported
      </audio>
      {judgeResult === null && (
        <Text>Music selecter will be here</Text>
        // TODO: Button for submission & reset to home
      )}
      {judgeResult !== null && (
        <>
          <Text>
            {judgeResult ? '정답입니다 ٩(๑＞◡＜๑)۶' : '틀렸습니다 ｡°(´∩ω∩`)°｡'}
          </Text>
          {!judgeResult && (
            <Text>{`정답은 ${answer.jpName} 입니다 (*ﾟДﾟ)`}</Text>
          )}
          {/* TODO: Button for next problem / reset to home */}
        </>
      )}
    </VStack>
  );
}

export default Game;
