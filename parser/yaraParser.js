import * as fs from 'fs';

export function parseYaraFile(filePath) {
    console.log(`Attempting to parse YARA file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const rules = [];
    const ruleBlocks = content.split(/rule\s+/).filter(block => block.trim());
    
    for (const block of ruleBlocks) {
        const rule = parseRuleBlock(block);
        if (rule) {
            rules.push(rule);
        }
    }
    
    return rules;
}

function parseRuleBlock(block) {
    try {
        const nameMatch = block.match(/^(\w+)\s*{/);
        if (!nameMatch) {
            console.error('Invalid rule format: missing name');
            return null;
        }

        const name = nameMatch[1];
        const strings = [];

        const metadataMatch = block.match(/meta:\s*((?:(?!strings:)(?!condition:)[\s\S])*)/);
        const stringsMatch = block.match(/strings:\s*((?:(?!condition:)[\s\S])*)/);
        const conditionMatch = block.match(/condition:\s*((?:(?!rule\s+)[\s\S])*?)(?=}|$)/);

        let metadata = {};
        if (metadataMatch) {
            metadata = parseMetadata(metadataMatch[1]);
        }

        if (stringsMatch) {
            strings.push(...parseStrings(stringsMatch[1]));
        }

        return {
            name,
            strings,
            condition: conditionMatch ? conditionMatch[1].trim() : 'true',
            metadata
        };
    } catch (error) {
        console.error(`Error parsing rule block: ${error}`);
        return null;
    }
}

function parseMetadata(metadataBlock) {
    const metadata = {};
    const lines = metadataBlock.trim().split('\n');
    
    for (const line of lines) {
        const match = line.match(/\s*(\w+)\s*=\s*["']([^"']+)["']/);
        if (match) {
            metadata[match[1]] = match[2];
        }
    }
    
    return metadata;
}

function parseStrings(stringsBlock) {
    const strings = [];
    const lines = stringsBlock.trim().split('\n');
    
    for (const line of lines) {
        const match = line.match(/\s*\$(\w+)\s*=\s*(?:{([^}]+)}|\/([^\/]+)\/|"([^"]+)")/);
        if (match) {
            const [, identifier, hexString, regexString, textString] = match;
            const value = hexString || regexString || textString;
            if (value) {
                strings.push({
                    identifier,
                    value,
                    type: hexString ? 'hex' : (regexString ? 'regex' : 'text')
                });
            }
        }
    }
    
    return strings;
}
