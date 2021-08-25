import { SongEntry } from './types';

// Aliases from: https://xn--hckp3ac2l023wu2ve.com/live-music-ryakushou-matome.html
export const LOVELIVE_SUNSHINE_SONGS: SongEntry[] = [
  {
    id: 'A0001',
    name: { jp: '君のこころは輝いてるかい？', kr: '너의 마음은 빛나고 있니?' },
    artist: 'Aqours',
    year: 2015,
    alias: ['키미코코'],
  },
];

// LOVELIVE_SUNSHINE_SONGS.forEach((song, idx) => {
//   if (LOVELIVE_SUNSHINE_SONGS.slice(idx + 1).findIndex((e) => e.id === song.id) > -1) {
//     throw Error(`Duplicate ID: ${song.id}`);
//   }
// });
