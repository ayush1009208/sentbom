const crypto = require('crypto');
const exec = require('child_process');

// Insecure: Weak cryptographic algorithm
function weakEncryption(data) {
    const cipher = crypto.createCipher('des', 'weak-key');
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

// Insecure: Command injection vulnerability
function runCommand(userInput) {
    return exec.execSync(userInput);
}

// Insecure: Hardcoded credentials
const dbConfig = {
    username: 'admin',
    password: 'admin123',
    server: 'localhost'
};

module.exports = { weakEncryption, runCommand, dbConfig };
