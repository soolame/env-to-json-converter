// Mode 1: .env to JSON
const envInput = document.getElementById('envInput');
const jsonOutput = document.getElementById('jsonOutput');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

// Mode 2: JSON to .env
const jsonInput = document.getElementById('jsonInput');
const envOutput = document.getElementById('envOutput');
const convertBtn2 = document.getElementById('convertBtn2');
const copyBtn2 = document.getElementById('copyBtn2');
const clearBtn2 = document.getElementById('clearBtn2');

const notification = document.getElementById('notification');

/**
 * Parse .env content to a JSON object
 * @param {string} envContent - Raw .env file content
 * @returns {object} Parsed environment variables
 */
function parseEnvToJson(envContent) {
    const lines = envContent.split('\n');
    const result = {};

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) {
            continue;
        }

        // Skip comments
        if (trimmedLine.startsWith('#')) {
            continue;
        }

        // Find the first = sign to split key and value
        const equalIndex = trimmedLine.indexOf('=');

        if (equalIndex === -1) {
            // No = sign found, skip this line
            continue;
        }

        // Extract key and value
        const key = trimmedLine.substring(0, equalIndex).trim();
        let value = trimmedLine.substring(equalIndex + 1).trim();

        // Skip if key is empty
        if (!key) {
            continue;
        }

        // Remove surrounding quotes from value
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        result[key] = value;
    }

    return result;
}

/**
 * Convert parsed JSON object to formatted JSON string
 * @param {object} obj - Object to stringify
 * @returns {string} Formatted JSON string with 4-space indentation
 */
function formatJson(obj) {
    return JSON.stringify(obj, null, 4);
}

/**
 * Parse JSON string to a .env format string
 * @param {string} jsonContent - JSON string content
 * @returns {string} .env formatted string
 */
function parseJsonToEnv(jsonContent) {
    let parsedJson;
    try {
        parsedJson = JSON.parse(jsonContent);
    } catch (error) {
        throw new Error('Invalid JSON: ' + error.message);
    }

    if (typeof parsedJson !== 'object' || parsedJson === null || Array.isArray(parsedJson)) {
        throw new Error('JSON must be an object, not an array or primitive');
    }

    const lines = [];
    for (const [key, value] of Object.entries(parsedJson)) {
        // Skip non-string values
        const stringValue = String(value);
        
        // Quote values that contain spaces or special characters
        const needsQuotes = /[\s=]/.test(stringValue) || stringValue.includes('"');
        const quotedValue = needsQuotes && !stringValue.includes('"') ? `"${stringValue}"` : stringValue;
        
        lines.push(`${key}=${quotedValue}`);
    }

    return lines.join('\n');
}

/**
 * Handle the convert button click
 */
function handleConvert() {
    try {
        const envContent = envInput.value;

        if (!envContent.trim()) {
            showNotification('Please enter .env content', 'error');
            jsonOutput.value = '';
            copyBtn.disabled = true;
            return;
        }

        const parsedJson = parseEnvToJson(envContent);
        const formattedJson = formatJson(parsedJson);

        jsonOutput.value = formattedJson;
        copyBtn.disabled = false;
        showNotification('✓ Conversion successful');
    } catch (error) {
        showNotification('Error during conversion', 'error');
        console.error('Conversion error:', error);
    }
}

/**
 * Handle the copy button click
 */
function handleCopy() {
    const jsonText = jsonOutput.value;

    if (!jsonText.trim()) {
        showNotification('Nothing to copy', 'error');
        return;
    }

    navigator.clipboard
        .writeText(jsonText)
        .then(() => {
            showNotification('✓ Copied to clipboard');
            copyBtn.blur();
        })
        .catch(() => {
            showNotification('Failed to copy', 'error');
        });
}

/**
 * Handle the clear button click
 */
function handleClear() {
    envInput.value = '';
    jsonOutput.value = '';
    copyBtn.disabled = true;
    envInput.focus();
}

/**
 * Handle the convert button click for JSON to .env
 */
function handleConvert2() {
    try {
        const jsonContent = jsonInput.value;

        if (!jsonContent.trim()) {
            showNotification('Please enter JSON content', 'error');
            envOutput.value = '';
            copyBtn2.disabled = true;
            return;
        }

        const envText = parseJsonToEnv(jsonContent);
        envOutput.value = envText;
        copyBtn2.disabled = false;
        showNotification('✓ Conversion successful');
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
        console.error('Conversion error:', error);
    }
}

/**
 * Handle the copy button click for JSON to .env
 */
function handleCopy2() {
    const envText = envOutput.value;

    if (!envText.trim()) {
        showNotification('Nothing to copy', 'error');
        return;
    }

    navigator.clipboard
        .writeText(envText)
        .then(() => {
            showNotification('✓ Copied to clipboard');
            copyBtn2.blur();
        })
        .catch(() => {
            showNotification('Failed to copy', 'error');
        });
}

/**
 * Handle the clear button click for JSON to .env
 */
function handleClear2() {
    jsonInput.value = '';
    envOutput.value = '';
    copyBtn2.disabled = true;
    jsonInput.focus();
}

/**
 * Show a temporary notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type ('success' or 'error')
 */
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show`;

    if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#10b981';
    }

    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Handle Enter key in input textarea for quick conversion
 */
function handleInputKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleConvert();
    }
}

/**
 * Handle Enter key in JSON input textarea for quick conversion
 */
function handleInputKeydown2(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleConvert2();
    }
}

/**
 * Switch between conversion modes
 * @param {string} mode - 'env-to-json' or 'json-to-env'
 */
function switchMode(mode) {
    const envToJsonMode = document.getElementById('envToJsonMode');
    const jsonToEnvMode = document.getElementById('jsonToEnvMode');
    const tabs = document.querySelectorAll('.mode-tab');

    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (mode === 'env-to-json') {
        envToJsonMode.classList.add('active');
        jsonToEnvMode.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        envToJsonMode.classList.remove('active');
        jsonToEnvMode.classList.add('active');
        tabs[1].classList.add('active');
    }
}

// Event listeners for Mode 1 (.env to JSON)
convertBtn.addEventListener('click', handleConvert);
copyBtn.addEventListener('click', handleCopy);
clearBtn.addEventListener('click', handleClear);
envInput.addEventListener('keydown', handleInputKeydown);

// Event listeners for Mode 2 (JSON to .env)
convertBtn2.addEventListener('click', handleConvert2);
copyBtn2.addEventListener('click', handleCopy2);
clearBtn2.addEventListener('click', handleClear2);
jsonInput.addEventListener('keydown', handleInputKeydown2);

// Initialize
copyBtn.disabled = true;
copyBtn2.disabled = true;

/**
 * Show the code modal with source code
 */
function showCode(event) {
    event.preventDefault();
    const modal = document.getElementById('codeModal');
    modal.classList.add('show');
    switchTab('html');
}

/**
 * Close the code modal
 */
function closeCode() {
    const modal = document.getElementById('codeModal');
    modal.classList.remove('show');
}

/**
 * Switch between code tabs
 */
function switchTab(tab) {
    const tabs = document.querySelectorAll('.code-tab');
    const codeDisplay = document.getElementById('codeDisplay');
    
    tabs.forEach(t => t.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        tabs[0].classList.add('active');
    }

    const cssCode = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --secondary: #6b7280;
    --secondary-dark: #4b5563;
    --background: #0f172a;
    --surface: #1e293b;
    --surface-light: #334155;
    --border: #475569;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --success: #10b981;
    --success-light: #ecfdf5;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, var(--background) 0%, #1a2f4d 100%);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 20px;
}

/* Additional styles for header, buttons, modals, etc. */
/* Full CSS available in style.css file on GitHub */`;

    const jsCode = `// Parse .env content to JSON object
function parseEnvToJson(envContent) {
    const lines = envContent.split('\\n');
    const result = {};

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex === -1) continue;

        const key = trimmedLine.substring(0, equalIndex).trim();
        let value = trimmedLine.substring(equalIndex + 1).trim();

        if (!key) continue;

        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        result[key] = value;
    }
    return result;
}

// Parse JSON to .env format
function parseJsonToEnv(jsonContent) {
    const parsedJson = JSON.parse(jsonContent);
    const lines = [];
    
    for (const [key, value] of Object.entries(parsedJson)) {
        const stringValue = String(value);
        const needsQuotes = /[\\s=]/.test(stringValue);
        const quotedValue = needsQuotes ? \`"\${stringValue}"\` : stringValue;
        lines.push(\`\${key}=\${quotedValue}\`);
    }
    return lines.join('\\n');
}

// Handle conversions
function handleConvert() {
    const envContent = envInput.value;
    const parsedJson = parseEnvToJson(envContent);
    const formattedJson = JSON.stringify(parsedJson, null, 4);
    jsonOutput.value = formattedJson;
}

// Full JavaScript code available in script.js file on GitHub`;

    const codeMap = {
        'html': `<!-- HTML structure for the Env Converter -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Env Converter</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Env Converter</h1>
            <p>Seamlessly convert between .env and JSON formats</p>
            
            <div class="mode-tabs">
                <button class="mode-tab active" onclick="switchMode('env-to-json')">
                    .env → JSON
                </button>
                <button class="mode-tab" onclick="switchMode('json-to-env')">
                    JSON → .env
                </button>
            </div>
            
            <div class="security-info">
                <div class="security-badge">
                    <span class="lock-icon">🔒</span>
                    <strong>100% Safe & Private</strong>
                    <p>Static site with local processing - your data never leaves your browser</p>
                </div>
                <div class="info-links">
                    <a href="https://github.com/soolame/env-to-json-converter" target="_blank">View on GitHub</a>
                    <a href="#" onclick="showCode(event)">View Code</a>
                </div>
            </div>
        </header>

        <!-- Conversion modes with textarea inputs and buttons -->
        <div id="envToJsonMode" class="converter-mode active">
            <!-- .env to JSON converter UI -->
        </div>

        <div id="jsonToEnvMode" class="converter-mode">
            <!-- JSON to .env converter UI -->
        </div>
    </div>
    
    <script src="script.js"><\/script>
</body>
</html>`,
        'css': cssCode,
        'js': jsCode
    };

    codeDisplay.textContent = codeMap[tab];
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('codeModal');
    if (event.target === modal) {
        closeCode();
    }
});
