const fs = require('fs');

// 📌 JSON ফাইল থেকে ডাটা লোড করা
const shahinQuotes = JSON.parse(fs.readFileSync('shahin.json'));
const bongQuotes = JSON.parse(fs.readFileSync('bongquotes.json'));
const baniQuotes = JSON.parse(fs.readFileSync('banibd.json'));

// 🎯 সব Quotes একসাথে মিশিয়ে একটি অ্যারে বানানো
const allQuotes = [
  ...shahinQuotes,
  ...bongQuotes.map(q => ({ quote: q.quote, writer: "Unknown", tags: [] })), // writer & tags না থাকলে ডিফল্ট সেট করা
  ...baniQuotes.map(q => ({ quote: q.quote, writer: q.writer || "Unknown", tags: q.tags ? q.tags : [] }))
];

// ২. একটি Random Quote দেখানোর API
module.exports = (req, res) => {
  const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  return res.json(randomQuote);
};
