const yara = require('yara');
const fs = require('fs').promises;
const path = require('path');

async function loadYaraRules() {
    const rulesDir = path.join(__dirname, '../rules');
    console.log(`📁 Loading YARA rules from: ${rulesDir}`);
    
    const files = await fs.readdir(rulesDir);
    console.log(`📝 Found rule files: ${files.join(', ')}`);
    
    const rules = [];
    
    for (const file of files) {
        if (file.endsWith('.yar')) {
            const rulePath = path.join(rulesDir, file);
            console.log(`⚙️ Compiling rule: ${file}`);
            rules.push(await yara.compile(rulePath));
        }
    }
    
    console.log(`✅ Loaded ${rules.length} YARA rules successfully`);
    return rules;
}

async function scanCode(code, rules) {
    console.log(`🔍 Starting code scan on ${code.length} characters`);
    const matches = [];
    
    for (const rule of rules) {
        console.log(`🔎 Applying rule: ${rule.name || 'unnamed rule'}`);
        const result = await rule.scan(code);
        
        if (result.length > 0) {
            console.log(`⚠️ Found ${result.length} matches for rule`);
            matches.push(...result);
        }
    }
    
    console.log(`📊 Scan complete. Total matches: ${matches.length}`);
    return matches;
}

module.exports = { loadYaraRules, scanCode };
