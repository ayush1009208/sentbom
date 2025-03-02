const fs = require('fs');
const { exec } = require('child_process');

async function processVulnerabilities() {
    const sbomReport = JSON.parse(fs.readFileSync('sbom.json', 'utf8'));
    
    // Run Grype and capture output
    exec('grype sbom:sbom.json -o json > vulnerabilities.json', async (error, stdout, stderr) => {
        const vulnReport = JSON.parse(fs.readFileSync('vulnerabilities.json', 'utf8'));
        
        let comment = '## 🔍 Security Scan Results\n\n';
        comment += '### 📦 SBOM Summary\n';
        comment += `- Total packages: ${sbomReport.components?.length || 0}\n\n`;
        
        comment += '### ⚠️ Vulnerability Report\n';
        const vulns = vulnReport.matches || [];
        
        if (vulns.length === 0) {
            comment += '✅ No vulnerabilities found!\n';
        } else {
            const severityCount = {
                Critical: 0,
                High: 0,
                Medium: 0,
                Low: 0
            };
            
            vulns.forEach(v => {
                severityCount[v.vulnerability.severity]++;
            });
            
            comment += '#### Summary:\n';
            comment += `- 🔴 Critical: ${severityCount.Critical}\n`;
            comment += `- 🟠 High: ${severityCount.High}\n`;
            comment += `- 🟡 Medium: ${severityCount.Medium}\n`;
            comment += `- 🔵 Low: ${severityCount.Low}\n\n`;
            
            if (severityCount.Critical + severityCount.High > 0) {
                comment += '#### Critical/High Severity Details:\n';
                vulns
                    .filter(v => ['Critical', 'High'].includes(v.vulnerability.severity))
                    .forEach(v => {
                        comment += `- ${v.vulnerability.severity}: ${v.artifact.name}@${v.artifact.version}\n`;
                        comment += `  - ${v.vulnerability.description}\n`;
                        comment += `  - ID: ${v.vulnerability.id}\n\n`;
                    });
            }
        }
        
        // Write the formatted comment to a file
        fs.writeFileSync('vulnerability-report.md', comment);
    });
}

processVulnerabilities();
