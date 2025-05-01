document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tokensDisplay = document.getElementById('tokens');
    const tokenCount = document.getElementById('tokenCount');
    const decodedText = document.getElementById('decodedText');
    const matchStatus = document.getElementById('matchStatus');
    const originalSize = document.getElementById('originalSize');
    const tokenSize = document.getElementById('tokenSize');
    const compressionRatio = document.getElementById('compressionRatio');

    // API endpoint
    const API_URL = 'http://localhost:5000/api/tokenize';

    // Check if API is available
    fetch('http://localhost:5000/api/health')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                console.log('API is available');
                encodeBtn.disabled = false;
            } else {
                showError('API server is not responding correctly');
            }
        })
        .catch(error => {
            console.error('Error connecting to API:', error);
            showError('Cannot connect to API server. Make sure it is running.');
        });

    // Event listeners
    encodeBtn.addEventListener('click', encodeText);
    clearBtn.addEventListener('click', clearAll);

    // Function to encode text
    function encodeText() {
        const text = inputText.value.trim();
        
        if (!text) {
            showError('Please enter some text to encode');
            return;
        }

        encodeBtn.disabled = true;
        encodeBtn.textContent = 'Processing...';

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API request failed');
            }
            return response.json();
        })
        .then(data => {
            displayResults(data);
            encodeBtn.textContent = 'Encode';
            encodeBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error encoding text:', error);
            showError('Error processing your text. Check that the API server is running.');
            encodeBtn.textContent = 'Encode';
            encodeBtn.disabled = false;
        });
    }

    // Function to display results
    function displayResults(data) {
        // Display tokens
        tokensDisplay.textContent = JSON.stringify(data.tokens, null, 2);
        tokenCount.textContent = `${data.tokens.length} tokens`;

        // Display decoded text
        decodedText.textContent = data.decoded;

        // Show match status
        if (data.stats.matches) {
            matchStatus.textContent = 'Perfect match ✓';
            matchStatus.className = 'match-true';
        } else {
            matchStatus.textContent = 'Decoding mismatch ✗';
            matchStatus.className = 'match-false';
        }

        // Show statistics
        originalSize.textContent = `${data.stats.originalSize} bytes`;
        tokenSize.textContent = `${data.stats.tokenCount} tokens`;
        
        const ratio = data.stats.compressionRatio.toFixed(2);
        compressionRatio.textContent = `${ratio}x (${ratio > 1 ? 'compression' : 'expansion'})`;
    }

    // Function to clear all fields
    function clearAll() {
        inputText.value = '';
        tokensDisplay.textContent = '';
        tokenCount.textContent = '0 tokens';
        decodedText.textContent = '';
        matchStatus.textContent = '-';
        matchStatus.className = '';
        originalSize.textContent = '0 bytes';
        tokenSize.textContent = '0 tokens';
        compressionRatio.textContent = '-';
    }

    // Function to show error message
    function showError(message) {
        tokensDisplay.textContent = `Error: ${message}`;
        tokensDisplay.style.color = 'red';
        setTimeout(() => {
            tokensDisplay.style.color = '';
        }, 3000);
    }
}); 