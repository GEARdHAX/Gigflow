// backend/utils/atsService.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const porterStemmer = natural.PorterStemmer;

exports.calculateATSScore = (jobDescription, bidMessage) => {
  // 1. Safety Checks
  if (!jobDescription || !bidMessage) return 0;

  // 2. Tokenize (Split text into words)
  const jobTokens = tokenizer.tokenize(jobDescription.toLowerCase());
  const bidTokens = tokenizer.tokenize(bidMessage.toLowerCase());

  // 3. Filter Stop Words (e.g., "the", "and", "is")
  const stopWords = ['the', 'and', 'is', 'in', 'to', 'for', 'of', 'with', 'a', 'an', 'i', 'am'];
  const filterTokens = (tokens) => tokens.filter(t => !stopWords.includes(t) && t.length > 2);

  const filteredJob = filterTokens(jobTokens);
  const filteredBid = filterTokens(bidTokens);

  // 4. Stemming (Normalize words: "coding" -> "code")
  const stem = (tokens) => tokens.map(t => porterStemmer.stem(t));
  const jobStems = stem(filteredJob);
  const bidStems = stem(filteredBid);

  // 5. Calculate Match
  // We only care about matching the JOB's keywords
  const uniqueJobKeywords = [...new Set(jobStems)];
  
  if (uniqueJobKeywords.length === 0) return 0;

  let matchCount = 0;
  uniqueJobKeywords.forEach(keyword => {
    if (bidStems.includes(keyword)) {
      matchCount++;
    }
  });

  // 6. Formula: (Matches / Total Job Keywords) * 100
  let score = (matchCount / uniqueJobKeywords.length) * 100;

  // Bonus points for detailed proposals (effort)
  if (filteredBid.length > 20) score += 5;
  if (filteredBid.length > 50) score += 5;

  // Round and Cap at 100
  return Math.min(Math.round(score), 100);
};