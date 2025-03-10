const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiAnalyzer {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyzeViolation(code, violation) {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyze this code snippet that violates a security rule:
        ${code}
        
        Violation: ${violation}
        
        Provide a brief explanation of the security concern and suggest how to fix it.
        PLEASE PLEASE PLEASE PROVIDE THE OUTPUT IN A GIT DIFF FORMAT.
        You must follow the following pattern for suggestions:
  
  Suggested change:
  diff --git a/path/to/file b/path/to/file
  index abc1234..def5678 100644
  --- a/path/to/file
  +++ b/path/to/file
  @@ -line,count +line,count @@
  actual diff content`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}

module.exports = GeminiAnalyzer;
