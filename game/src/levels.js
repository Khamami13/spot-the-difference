// Level data for Warung Senja — Cari Bedanya.
// Each difference is one point in the 560 x 400 scene space: the spot the
// player must click, on either panel. `label` is the friendly name the game
// announces when that difference is found. Coordinates must match the
// element the scene painters draw in scenes-warung.js, scenes-pasar.js and
// scenes-pantai.js: panel B hides or recolors exactly that element.

export const SCENE_WIDTH = 560;
export const SCENE_HEIGHT = 400;

export const LEVELS = [
  {
    id: 'warung',
    name: 'Warung Kopi Senja',
    short: 'Warung',
    timeLimit: 180,
    hints: 3,
    blurb: 'Senja di warung kopi langganan: lampu gantung, kucing, dan sepeda.',
    diffs: [
      { id: 'sun', x: 472, y: 66, r: 30, label: 'Matahari senja' },
      { id: 'awning', x: 152, y: 168, r: 17, label: 'Warna garis tenda' },
      { id: 'lantern', x: 300, y: 208, r: 15, label: 'Lampion tengah' },
      { id: 'cat', x: 40, y: 345, r: 24, label: 'Kucing oranye' },
      { id: 'cup', x: 452, y: 296, r: 16, label: 'Cangkir di meja' },
      { id: 'basket', x: 508, y: 299, r: 16, label: 'Keranjang sepeda' },
      { id: 'flower', x: 336, y: 292, r: 15, label: 'Warna bunga pot' },
    ],
  },
  {
    id: 'pasar',
    name: 'Pasar Malam',
    short: 'Pasar',
    timeLimit: 150,
    hints: 3,
    blurb: 'Lampu warna-warni, balon, dan layang-layang di atas lapak malam.',
    diffs: [
      { id: 'moon', x: 88, y: 58, r: 26, label: 'Bulan purnama' },
      { id: 'balloon', x: 282, y: 108, r: 19, label: 'Warna balon' },
      { id: 'kite', x: 352, y: 78, r: 20, label: 'Layang-layang' },
      { id: 'hat', x: 230, y: 252, r: 17, label: 'Topi penjual' },
      { id: 'wheel', x: 424, y: 362, r: 16, label: 'Roda gerobak' },
      { id: 'star', x: 148, y: 182, r: 15, label: 'Bintang di papan' },
      { id: 'bulb', x: 472, y: 118, r: 13, label: 'Lampu gantung' },
      { id: 'roofcat', x: 402, y: 188, r: 18, label: 'Kucing di atap lapak' },
    ],
  },
  {
    id: 'pantai',
    name: 'Pantai Tropis',
    short: 'Pantai',
    timeLimit: 120,
    hints: 3,
    blurb: 'Pantai paling ramai: sepuluh perbedaan kecil bersembunyi di pasir.',
    diffs: [
      { id: 'cloud', x: 118, y: 58, r: 24, label: 'Awan kecil' },
      { id: 'sun', x: 472, y: 66, r: 26, label: 'Warna matahari' },
      { id: 'coconut', x: 128, y: 219, r: 14, label: 'Kelapa di palem' },
      { id: 'sail', x: 396, y: 207, r: 18, label: 'Garis layar perahu' },
      { id: 'umbrella', x: 240, y: 220, r: 18, label: 'Warna payung' },
      { id: 'flag', x: 339, y: 274, r: 14, label: 'Bendera istana pasir' },
      { id: 'crab', x: 118, y: 352, r: 16, label: 'Kepiting merah' },
      { id: 'starfish', x: 452, y: 362, r: 14, label: 'Bintang laut' },
      { id: 'ball', x: 202, y: 332, r: 16, label: 'Bola pantai' },
      { id: 'surfboard', x: 516, y: 302, r: 15, label: 'Papan selancar' },
    ],
  },
];

export function levelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}
