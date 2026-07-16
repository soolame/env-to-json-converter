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
