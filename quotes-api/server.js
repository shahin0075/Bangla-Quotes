require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// 📌 সব JSON ফাইল থেকে ডাটা লোড করা
const shahinQuotes = JSON.parse(fs.readFileSync("shahin.json"));
const bongQuotes = JSON.parse(fs.readFileSync("bongquotes.json"));
const baniQuotes = JSON.parse(fs.readFileSync("banibd.json"));

// 🎯 সব Quotes একসাথে মিশিয়ে একটি অ্যারে বানানো
const allQuotes = [
  ...shahinQuotes,
  ...bongQuotes.map(q => ({ quote: q.quote, writer: "Unknown", tags: [] })), // writer & tags না থাকলে ডিফল্ট সেট করা
  ...baniQuotes.map(q => ({ quote: q.quote, writer: q.writer || "Unknown", tags: q.tags ? q.tags : [] }))
];

// ✅ ১. সব Quotes দেখানোর API
app.get("/api/quotes", (req, res) => {
  res.json(allQuotes);
});

// ✅ ২. একটি Random Quote দেখানোর API
app.get("/api/quotes/random", (req, res) => {
  const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  res.json(randomQuote);
});

// ✅ ৩. নির্দিষ্ট লেখকের Quotes দেখানোর API
app.get("/api/quotes/author/:name", (req, res) => {
  const author = req.params.name.toLowerCase();
  const authorQuotes = allQuotes.filter(q => q.writer.toLowerCase().includes(author));
  res.json(authorQuotes.length ? authorQuotes : { message: "কোনো কোট পাওয়া যায়নি!" });
});

// ✅ ৪. নির্দিষ্ট ট্যাগ অনুযায়ী Quotes দেখানোর API
app.get("/api/quotes/tag/:tag", (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const tagQuotes = allQuotes.filter(q => q.tags && q.tags.some(t => t.toLowerCase().includes(tag)));
  res.json(tagQuotes.length ? tagQuotes : { message: "এই ট্যাগের কোনো কোট পাওয়া যায়নি!" });
});

// ✅ ৫. নতুন Quote যোগ করার API
app.post("/api/quotes", (req, res) => {
  const { quote, writer, tags } = req.body;
  if (!quote) {
    return res.status(400).json({ message: "Quote দিতে হবে!" });
  }

  const newQuote = {
    quote,
    writer: writer || "Unknown",
    tags: tags || []
  };

  allQuotes.push(newQuote);
  res.json({ message: "নতুন Quote যোগ করা হয়েছে!", quote: newQuote });
});

// ✅ সার্ভার চালু করা
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
