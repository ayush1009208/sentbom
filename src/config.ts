export const config = {
  // Bot behavior configuration
  bot: {
    openingComment: 'Thanks for opening this issue!',
    // Add more configuration as needed
  },
  
  // Events to listen to
  events: {
    issues: true,
    pullRequest: true
  }
};

export default config;
