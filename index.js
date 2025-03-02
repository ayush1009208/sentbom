require('dotenv').config();
const { loadYaraRules, scanCode } = require('./src/yaraScanner');
const GeminiAnalyzer = require('./src/geminiAnalyzer');

/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.log.info("Sentbom GitHub bot is starting...");
  const geminiAnalyzer = new GeminiAnalyzer(process.env.GEMINI_API_KEY);
  let yaraRules;

  // Initialize YARA rules
  loadYaraRules().then(rules => {
    yaraRules = rules;
  });

  // Handle new issue creation
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: `Thanks for opening this issue @${context.payload.sender.login}! I'll help you track this.`,
    });
    await context.octokit.issues.addLabels(context.issue({
      labels: ['needs-triage']
    }));
    return context.octokit.issues.createComment(issueComment);
  });

  // Handle new pull requests
  app.on("pull_request.opened", async (context) => {
    const prComment = context.issue({
      body: `Thanks for the pull request @${context.payload.sender.login}! I'll review it soon.`,
    });
    await context.octokit.issues.addLabels(context.issue({
      labels: ['needs-review']
    }));
    return context.octokit.issues.createComment(prComment);
  });

  // Handle pull request changes
  app.on(['pull_request.opened', 'pull_request.synchronize'], async (context) => {
    const pr = context.payload.pull_request;
    const files = await context.octokit.pulls.listFiles(context.pullRequest());

    for (const file of files.data) {
      if (file.status === 'modified' || file.status === 'added') {
        const matches = await scanCode(file.patch, yaraRules);
        
        for (const match of matches) {
          const analysis = await geminiAnalyzer.analyzeViolation(file.patch, match.rule);
          
          await context.octokit.pulls.createReviewComment(context.issue({
            body: analysis,
            commit_id: pr.head.sha,
            path: file.filename,
            line: match.line
          }));
        }
      }
    }
  });

  // Handle issue comments
  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment;
    if (comment.body.includes('/label')) {
      const labels = comment.body
        .split('/label')[1]
        .trim()
        .split(',')
        .map(label => label.trim());
      
      await context.octokit.issues.addLabels(context.issue({
        labels: labels
      }));
    }
  });

  // React to pull request reviews
  app.on("pull_request_review.submitted", async (context) => {
    const review = context.payload.review;
    if (review.state === 'approved') {
      await context.octokit.issues.addLabels(context.issue({
        labels: ['approved']
      }));
    }
  });

  // Configure port
  process.env.PORT = process.env.PORT || 3003;
};
