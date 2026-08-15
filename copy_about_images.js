const fs = require('fs');
const path = require('path');

const srcHero = 'C:\\Users\\Volkan\\.gemini\\antigravity-ide\\brain\\d1f35987-93da-4f1a-90da-4f218aaa6c47\\about_hero_bg_1785552077942.png';
const destHero = 'C:\\projeler\\ens-main\\ens-main\\public\\about_hero.png';

const srcLibrary = 'C:\\Users\\Volkan\\.gemini\\antigravity-ide\\brain\\d1f35987-93da-4f1a-90da-4f218aaa6c47\\about_library_1785552092968.png';
const destLibrary = 'C:\\projeler\\ens-main\\ens-main\\public\\about_library.png';

try {
  fs.copyFileSync(srcHero, destHero);
  fs.copyFileSync(srcLibrary, destLibrary);
  console.log('Images copied successfully.');
} catch(e) {
  console.error(e);
}
