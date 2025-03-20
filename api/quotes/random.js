const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/quotes/random') {
    try {
      // public ফোল্ডার থেকে JSON ফাইলগুলো ফেচ করুন
      const shahinResponse = await fetch('https://bangla-quotes.vercel.app/shahin.json');
      const bongResponse = await fetch('https://bangla-quotes.vercel.app/bongquotes.json');
      const baniResponse = await fetch('https://bangla-quotes.vercel.app/banibd.json');
      
      // JSON ডাটা পার্স করা
      const shahinQuotes = await shahinResponse.json();
      const bongQuotes = await bongResponse.json();
      const baniQuotes = await baniResponse.json();

      // সব Quotes একসাথে মিশিয়ে একটি অ্যারে বানানো
      const allQuotes = [
        ...shahinQuotes,
        ...bongQuotes.map(q => ({ quote: q.quote, writer: "Unknown", tags: [] })),
        ...baniQuotes.map(q => ({ quote: q.quote, writer: q.writer || "Unknown", tags: q.tags ? q.tags : [] }))
      ];

      // একটি Random Quote রিটার্ন করা
      const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
      return res.json(randomQuote);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: "ডাটা ফেচ করার সময় সমস্যা হয়েছে!" });
    }
  }

  // 404 Error for unsupported routes
  return res.status(404).json({ message: "Route not found" });
};
