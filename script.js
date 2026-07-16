const envInput = document.getElementById('envInput');
const jsonOutput = document.getElementById('jsonOutput');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
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

// Event listeners
convertBtn.addEventListener('click', handleConvert);
copyBtn.addEventListener('click', handleCopy);
clearBtn.addEventListener('click', handleClear);
envInput.addEventListener('keydown', handleInputKeydown);

// Initialize
copyBtn.disabled = true;

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
    event.target.classList.add('active');

    const codeMap = {
        'html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>.env to JSON Converter</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>.env to JSON Converter</h1>
            <p>Convert your environment variables to JSON format instantly</p>
            
            <div class="security-info">
                <div class="security-badge">
                    <span class="lock-icon">🔒</span>
                    <strong>100% Safe & Private</strong>
                    <p>This is a static site. Your environment variables are processed locally in your browser and never sent to any server.</p>
                </div>
                <div class="info-links">
                    <a href="https://github.com/soolame/env-to-json-converter" target="_blank" rel="noopener noreferrer">
                        View on GitHub
                    </a>
                    <a href="#" class="view-code-link" onclick="showCode(event)">
                        View Code
                    </a>
                </div>
            </div>
        </header>

        <div class="converter-wrapper">
            <div class="input-section">
                <div class="section-header">
                    <h2>Input</h2>
                    <span class="hint">.env file</span>
                </div>
                <textarea
                    id="envInput"
                    placeholder="# Paste your .env file here&#10;PORT=3000&#10;DATABASE_URL=postgres://...&#10;API_KEY=secret_key"
                    spellcheck="false"
                ></textarea>
            </div>

            <div class="output-section">
                <div class="section-header">
                    <h2>Output</h2>
                    <span class="hint">JSON object</span>
                </div>
                <textarea
                    id="jsonOutput"
                    placeholder="Click Convert to see the JSON output"
                    readonly
                    spellcheck="false"
                ></textarea>
            </div>
        </div>

        <div class="button-group">
            <button id="convertBtn" class="btn btn-primary">
                <span>Convert</span>
            </button>
            <button id="copyBtn" class="btn btn-secondary" disabled>
                <span>Copy to Clipboard</span>
            </button>
            <button id="clearBtn" class="btn btn-tertiary">
                <span>Clear</span>
            </button>
        </div>

        <div id="notification" class="notification"></div>
    </div>

    <script src="script.js"><\/script>
</body>
</html>`,
        'css': `(View the full CSS in the style.css file on GitHub)`,
        'js': `(View the full JavaScript in the script.js file on GitHub)`
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
