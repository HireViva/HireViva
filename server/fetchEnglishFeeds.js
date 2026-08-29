import https from 'https';

const channels = [
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCHaHD45nwMpbiSeyXRnJpMg', // BBC Learning English
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCKgpamM4VEyU65GSO9z0eVg', // Learn English With TV Series
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCeTVoczn9NOZA9blls3YgUg', // EnglishClass101
  'https://www.youtube.com/feeds/videos.xml?channel_id=UC_Oskg2xVWrstAOZUQOnemg', // Learn English with EnglishClass101
  'https://www.youtube.com/feeds/videos.xml?channel_id=UC733F4KkL9uWqEw44U9pW9A', // Oxford Online English
];

function fetchFeed(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function parseFeed(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1];
    const idMatch = entryXml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = entryXml.match(/<title>(.*?)<\/title>/);
    const descMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/);
    if (idMatch && titleMatch) {
      entries.push({
        videoId: idMatch[1],
        title: titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        description: descMatch ? descMatch[1].slice(0, 160).replace(/\n/g, ' ') + '...' : ''
      });
    }
  }
  return entries;
}

async function checkThumbnail(id) {
  return new Promise((resolve) => {
    https.get(`https://img.youtube.com/vi/${id}/hqdefault.jpg`, (res) => {
      let size = 0;
      res.on('data', chunk => { size += chunk.length; });
      res.on('end', () => {
        resolve(res.statusCode === 200 && size > 3000);
      });
    }).on('error', () => resolve(false));
  });
}

async function main() {
  const allEntries = [];
  for (const c of channels) {
    const xml = await fetchFeed(c);
    allEntries.push(...parseFeed(xml));
  }

  const validEntries = [];
  for (const entry of allEntries) {
    const isValid = await checkThumbnail(entry.videoId);
    if (isValid && !entry.title.includes('#shorts') && !entry.title.includes('Shorts')) {
      validEntries.push(entry);
    }
  }

  console.log("VALID NON-SHORTS ENTRIES:", validEntries.length);
  console.log(JSON.stringify(validEntries.slice(0, 10), null, 2));
}

main();
