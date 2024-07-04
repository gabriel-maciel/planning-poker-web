const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, 'src', 'assets', 'env.js');

let envFileContent = fs.readFileSync(envFilePath, 'utf8');

const apiUrl = process.env.API_URL;
envFileContent = envFileContent.replace('${API_URL}', apiUrl);

fs.writeFileSync(envFilePath, envFileContent, 'utf8');

console.log(`Replaced API_URL with ${apiUrl} in env.js`);
