const fs = require('fs');

async function run() {
  const res = await fetch("https://turkceoabtdeyiz.com/urun/2027-erken-kayit-canli-turkce-oabt-video-ags");
  const html = await res.text();
  fs.writeFileSync("temp-html.txt", html);
}
run();
