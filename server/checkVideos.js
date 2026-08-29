import https from 'https';

const candidateIds = [
  '6Jh6nn0OS74', // Oxford - Interview
  'cX2dMKYYZI4', // Oxford - Pronunciation
  'juKd26qkNAw', // Oxford - Fluency
  'V7p31V47Y9o', // Oxford - Linking
  'jW7_H6Wb2Qc', // Oxford - Weak forms
  'D-Xl9L7aG_o', // Oxford - IPA
  'B7b3jWJ6S3k', // Oxford - Tongue twisters
  'k4S51V1T6G0', // Oxford - Confidence
  '0t3T5lQxW6A', // Oxford - 5 steps
  'd6wRkuWx5A8',
  '12345678901',
  '8o_q0Q61sD0',
  'Y2A8x_z8X3c',
  'o7A_mH_306U',
  '2i5z60-sQ2A',
  'kJQP7kiw5Fk', // Despacito
  'fJ9rUzIMcZQ', // Queen
  'L_LUpnjgPso', // English speaking
  'b1K7kF0pZ5Y',
  'g50s1t9L2dE',
  'l2Rz39-E-90',
  '9q8y36-F1Q0',
  'Q69d8j32d90',
  'zTElvvOfl_U',
  'w_M7f9yKqB0',
  'g8T9Y9wYk4E',
  'L1p6_xG3zY8',
  'R2d0_fG1-0s',
  'Fk97n_9m1sQ',
  'e-ORhEE9VVg', // Taylor Swift Blank Space
  'hLQl3WQQoQ0', // Adele Someone Like You
  'YQHsXMglC9A', // Hello Adele
  'RgKAFK5djSk', // See you again
  'JGwWNGJdvx8', // Ed Sheeran Shape of You
  'OPf0YbXqDm0', // Mark Ronson Uptown Funk
  'fRh_vgS2dFE', // Justin Bieber Sorry
  '3tmd-ClpJxA', // Taylor Swift Shake It Off
];

async function checkId(id) {
  return new Promise((resolve) => {
    https.get(`https://img.youtube.com/vi/${id}/hqdefault.jpg`, (res) => {
      let size = 0;
      res.on('data', chunk => { size += chunk.length; });
      res.on('end', () => {
        // YouTube placeholder is usually ~1097 bytes, real thumbnails are > 5000 bytes
        resolve({ id, status: res.statusCode, size, valid: res.statusCode === 200 && size > 3000 });
      });
    }).on('error', () => resolve({ id, status: 500, size: 0, valid: false }));
  });
}

async function main() {
  const results = await Promise.all(candidateIds.map(checkId));
  const valid = results.filter(r => r.valid);
  console.log("VALID IDS COUNT:", valid.length);
  console.log(valid.map(v => v.id));
}

main();
