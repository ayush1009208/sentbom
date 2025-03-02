<<<<<<< HEAD
=======
// ...existing code...

// Insecure: Weak random number generation
function generateToken() {
    return Math.random().toString(36).substr(2);
}

// Insecure: NoSQL injection vulnerability
function findUser(userData) {
    return db.users.find({ $where: "return " + userData.query });
}

// Insecure: Unsafe regex
function validateInput(input) {
    const pattern = new RegExp(input);
    return pattern.test("sample");
}

// Insecure: Weak password hashing
function hashPassword(password) {
    return require('crypto').createHash('md5').update(password).digest('hex');
}

module.exports = {
    // ...existing code...
    generateToken,
    findUser,
    validateInput,
    hashPassword
};
>>>>>>> 18d7b6b5939b70c3cb6446a69cd3ad108398bd6a
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
