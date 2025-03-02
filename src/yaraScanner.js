const yara = require('yara');
const fs = require('fs').promises;
const path = require('path');

async function loadYaraRules() {
    const rulesDir = path.join(__dirname, '../rules');
    const files = await fs.readdir(rulesDir);
    const rules = [];
    
    for (const file of files) {
        if (file.endsWith('.yar')) {
            const rulePath = path.join(rulesDir, file);
            rules.push(await yara.compile(rulePath));
        }
    }
    return rules;
}

async function scanCode(code, rules) {
    const matches = [];
    for (const rule of rules) {
        const result = await rule.scan(code);
        if (result.length > 0) {
            matches.push(...result);
        }
    }
    return matches;
}

module.exports = { loadYaraRules, scanCode };
