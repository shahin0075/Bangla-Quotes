const fs = require("fs");

// সব Quotes একসাথে মিশিয়ে একটি অ্যারে বানানো
const shahinQuotes = JSON.parse(fs.readFileSync("shahin.json"));
const bongQuotes = JSON.parse(fs.readFileSync("bongquotes.json"));
const baniQuotes = JSON.parse(fs.readFileSync("banibd.json"));

const allQuotes = [
  ...shahinQuotes,
  ...bongQuotes.map(q => ({ quote: q.quote, writer: "Unknown", tags: [] })), 
  ...baniQuotes.map(q => ({ quote: q.quote, writer: q.writer || "Unknown", tags: q.tags ? q.tags : [] }))
];

// API function export করা
module.exports = (req, res) => {
  // ১. সব Quotes দেখানোর API
  if (req.method === 'GET' && req.url === '/api/quotes') {
    return res.json(allQuotes);
  }

  // ২. একটি Random Quote দেখানোর API
  if (req.method === 'GET' && req.url === '/api/quotes/random') {
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    return res.json(randomQuote);
  }

  // ৩. নির্দিষ্ট লেখকের Quotes দেখানোর API
  if (req.method === 'GET' && req.url.startsWith('/api/quotes/author/')) {
    const author = req.url.split('/')[4].toLowerCase();
    const authorQuotes = allQuotes.filter(q => q.writer.toLowerCase().includes(author));
    return res.json(authorQuotes.length ? authorQuotes : { message: "কোনো কোট পাওয়া যায়নি!" });
  }

  // ৪. নির্দিষ্ট ট্যাগ অনুযায়ী Quotes দেখানোর API
  if (req.method === 'GET' && req.url.startsWith('/api/quotes/tag/')) {
    const tag = req.url.split('/')[4].toLowerCase();
    const tagQuotes = allQuotes.filter(q => q.tags && q.tags.some(t => t.toLowerCase().includes(tag)));
    return res.json(tagQuotes.length ? tagQuotes : { message: "এই ট্যাগের কোনো কোট পাওয়া যায়নি!" });
  }

  // ৫. নতুন Quote যোগ করার API
  if (req.method === 'POST' && req.url === '/api/quotes') {
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
    return res.json({ message: "নতুন Quote যোগ করা হয়েছে!", quote: newQuote });
  }

  // 404 Error for unsupported routes
  return res.status(404).json({ message: "Route not found" });
};
