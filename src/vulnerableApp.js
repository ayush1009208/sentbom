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
