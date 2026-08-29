import https from 'https';

const candidateVideos = [
  {
    url: "https://www.youtube.com/watch?v=6Jh6nn0OS74",
    title: "How to Answer 'Tell Me About Yourself' in an Interview",
    description: "Structure professional self-introductions, articulate past accomplishments, and communicate clearly in job interviews.",
    category: "Job Interviews",
    duration: "12:35",
    level: "Career"
  },
  {
    url: "https://www.youtube.com/watch?v=cX2dMKYYZI4",
    title: "5 Essential Tips to Improve Your English Pronunciation",
    description: "Clear breakdown of word stress, prominence, weak forms, intonation patterns, and articulation mechanics.",
    category: "Pronunciation",
    duration: "15:50",
    level: "Intermediate"
  },
  {
    url: "https://www.youtube.com/watch?v=juKd26qkNAw",
    title: "5 Steps to Improve Your English Speaking & Fluency",
    description: "Practical strategies to overcome hesitation, stop translating in your head, and sound confident in conversations.",
    category: "Fluency",
    duration: "16:45",
    level: "All Levels"
  },
  {
    url: "https://www.youtube.com/watch?v=incVw-AAbYQ",
    title: "How to Talk About Your Daily Routine & Life in English",
    description: "Master everyday conversational English, routine actions, and practical conversational expressions with ease.",
    category: "Daily Speech",
    duration: "18:20",
    level: "Beginner"
  },
  {
    url: "https://www.youtube.com/watch?v=CsmuPk8ZaxU",
    title: "Speak Natural English & Master American Pronunciation",
    description: "Learn pronunciation, rhythm, and real conversational American English from native dialogue breakdowns.",
    category: "Pronunciation",
    duration: "21:40",
    level: "Intermediate"
  },
  {
    url: "https://www.youtube.com/watch?v=ASsT90H2fVE",
    title: "Master English Tenses for Confident Daily Speaking",
    description: "Clear and straightforward comparison of tenses to help you speak accurately without second-guessing your grammar.",
    category: "Grammar & Flow",
    duration: "24:15",
    level: "Beginner to Intermediate"
  },
  {
    url: "https://www.youtube.com/watch?v=vbtNcGlGOlQ",
    title: "Essential English Phrases for Daily Conversations",
    description: "High-frequency sentence patterns, practical responses, and vocabulary to hold smooth conversations with anyone.",
    category: "Vocabulary",
    duration: "26:30",
    level: "All Levels"
  },
  {
    url: "https://www.youtube.com/watch?v=3dD_9f9TWMQ",
    title: "How to Build Long-Term English Speaking Habits",
    description: "Proven cognitive memory techniques and active recall exercises to retain words and speak effortlessly.",
    category: "Speaking Habits",
    duration: "15:10",
    level: "Practice"
  }
];

function extractId(url) {
  return url.split('v=')[1];
}

async function checkThumbnail(item) {
  const id = extractId(item.url);
  return new Promise((resolve) => {
    https.get(`https://img.youtube.com/vi/${id}/hqdefault.jpg`, (res) => {
      let size = 0;
      res.on('data', chunk => { size += chunk.length; });
      res.on('end', () => {
        resolve({
          title: item.title,
          id,
          size,
          ok: res.statusCode === 200 && size > 3000
        });
      });
    }).on('error', () => resolve({ title: item.title, id, size: 0, ok: false }));
  });
}

async function main() {
  const results = await Promise.all(candidateVideos.map(checkThumbnail));
  console.log(JSON.stringify(results, null, 2));
  const allGood = results.every(r => r.ok);
  console.log("ALL 8 VIDEOS VERIFIED 100% WORKING:", allGood);
}

main();
