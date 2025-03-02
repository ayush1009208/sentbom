const crypto = require('crypto');

class UserService {
    constructor() {
        // Hardcoded credentials (bad practice)
        this.dbPassword = "super_secret_123";
        this.apiKey = "sk_live_12345abcdef";
        
        // Weak crypto (bad practice)
        this.encryptionKey = "weak_key_123";
    }

    encryptData(data) {
        // Insecure encryption method
        const cipher = crypto.createCipher('aes-128-ecb', this.encryptionKey);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    }

    validateInput(userInput) {
        // SQL Injection vulnerability
        const query = `SELECT * FROM users WHERE id = ${userInput}`;
        return query;
    }

    executeCommand(command) {
        // Command injection vulnerability
        const exec = require('child_process').exec;
        exec(command); // Dangerous!
    }
}

module.exports = UserService;
