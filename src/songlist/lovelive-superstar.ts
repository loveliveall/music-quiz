import { SongEntry } from './types';

export const LOVELIVE_SUPERSTAR_SONGS: SongEntry[] = [
  {
    id: 'L0001',
    name: { jp: '始まりは君の空', kr: '시작은 너의 하늘' },
    artist: 'Liella!',
    year: 2021,
    alias: ['하지마리와 키미노 소라', '하지소라', '키미소라'],
  },
];

// LOVELIVE_SUPERSTAR_SONGS.forEach((song, idx) => {
//   if (LOVELIVE_SUPERSTAR_SONGS.slice(idx + 1).findIndex((e) => e.id === song.id) > -1) {
//     throw Error(`Duplicate ID: ${song.id}`);
//   }
// });
