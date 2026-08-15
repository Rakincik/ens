const fs = require('fs');

const path = './yerel_yedek_yeni.sql';
let content = fs.readFileSync(path, 'utf8');

// Replace turkceoabtdeyiz.com
content = content.replace(/https:\/\/turkceoabtdeyiz\.com\//g, 'https://toa.muro.click/');

// Replace "/uploads/ and '/uploads/ with https://toa.muro.click/uploads/
content = content.replace(/"\/uploads\//g, '"https://toa.muro.click/uploads/');
content = content.replace(/'\/uploads\//g, '\'https://toa.muro.click/uploads/');

// Replace "/slider/ and '/slider/ with https://toa.muro.click/slider/
content = content.replace(/"\/slider\//g, '"https://toa.muro.click/slider/');
content = content.replace(/'\/slider\//g, '\'https://toa.muro.click/slider/');

fs.writeFileSync('./yerel_yedek_yeni_fixed.sql', content, 'utf8');
console.log('Replacements completed successfully.');
