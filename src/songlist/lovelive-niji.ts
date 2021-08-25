import { SongEntry } from './types';

export const LOVELIVE_NIJI_SONGS: SongEntry[] = [
  {
    id: 'N0001',
    name: { jp: 'TOKIMEKI Runners', kr: 'TOKIMEKI Runners' },
    artist: '니지가사키 학원 스쿨 아이돌 동호회',
    year: 2018,
    alias: ['토키메키 러너즈', '토키런', '토키란'],
  },
];

// LOVELIVE_NIJI_SONGS.forEach((song, idx) => {
//   if (LOVELIVE_NIJI_SONGS.slice(idx + 1).findIndex((e) => e.id === song.id) > -1) {
//     throw Error(`Duplicate ID: ${song.id}`);
//   }
// });
