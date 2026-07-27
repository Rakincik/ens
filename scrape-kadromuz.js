const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeKadromuz() {
  try {
    const { data } = await axios.get('https://turkceoabtdeyiz.com/kadromuz');
    const $ = cheerio.load(data);
    
    const teachers = [];
    
    // Look for cards, team members, etc. Let's just log the whole body first or specific classes.
    // E.g. find all h3, h4 tags to identify names
    const names = [];
    $('h1, h2, h3, h4, h5, .name, .title').each((i, el) => {
      names.push($(el).text().trim());
    });
    
    console.log("Found headings/names:", names.filter(n => n.length > 0 && n.length < 50));
    
    // Attempting to find team blocks:
    // They often have classes like .team-member, .kadro, .card, etc.
    $('.card, .team-member, .teacher, .col-md-4, .col-lg-3').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const imgSrc = $(el).find('img').attr('src');
      if (text.length > 10 && imgSrc) {
        console.log("Found potential teacher block:", { text: text.substring(0, 100), imgSrc });
      }
    });

  } catch (err) {
    console.error(err);
  }
}

scrapeKadromuz();
