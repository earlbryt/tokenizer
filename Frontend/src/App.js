import React, { useState, useEffect } from 'react';
import './App.css';
import { tokenize, checkHealth } from './api';
import TokenVisualizer from './components/TokenVisualizer';

function App() {
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState([]);
  const [decodedText, setDecodedText] = useState('');
  const [tokenMappings, setTokenMappings] = useState([]);
  const [stats, setStats] = useState({
    originalSize: 0,
    tokenCount: 0,
    compressionRatio: 0,
    matches: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    // Check if the API is available when the component mounts
    const checkApiHealth = async () => {
      try {
        const health = await checkHealth();
        setApiAvailable(health.status === 'OK');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiAvailable(false);
        setErrorMessage('Cannot connect to API server. Make sure it is running.');
      }
    };

    checkApiHealth();
  }, []);

  const handleEncodeText = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter some text to encode');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const result = await tokenize(inputText);
      setTokens(result.tokens);
      setDecodedText(result.decoded);
      setStats(result.stats);
      setTokenMappings(result.tokenMappings || []);
    } catch (error) {
      console.error('Error encoding text:', error);
      setErrorMessage('Error processing your text. Check that the API server is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTokens([]);
    setDecodedText('');
    setTokenMappings([]);
    setStats({
      originalSize: 0,
      tokenCount: 0,
      compressionRatio: 0,
      matches: false
    });
    setErrorMessage('');
  };

  return (
    <div className="container">
      <h1>Byte Pair Encoding Tokenizer</h1>
      <div className="description">
        <p>This tokenizer implements Byte Pair Encoding (BPE) algorithm to compress text into tokens.</p>
      </div>

      <div className="input-area">
        <h2>Input Text</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to tokenize..."
        />
        <div className="buttons">
          <button
            className="encode-btn"
            onClick={handleEncodeText}
            disabled={isProcessing || !apiAvailable}
          >
            {isProcessing ? 'Processing...' : 'Encode'}
          </button>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {tokens.length > 0 && (
        <TokenVisualizer 
          text={inputText} 
          tokens={tokens} 
          decoded={decodedText}
          tokenMappings={tokenMappings}
        />
      )}

      <div className="result-area">
        <div className="result-box">
          <h2>Tokens</h2>
          <pre>{tokens.length > 0 ? JSON.stringify(tokens, null, 2) : ''}</pre>
          <div className="token-stats">
            <span>{tokens.length} tokens</span>
          </div>
        </div>
        <div className="result-box">
          <h2>Decoded Text</h2>
          <div className="decoded-text">{decodedText}</div>
          <div className="match-indicator">
            <span className={stats.matches ? 'match-true' : 'match-false'}>
              {stats.matches ? 'Perfect match ✓' : decodedText ? 'Decoding mismatch ✗' : '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-area">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <h3>Original Size</h3>
            <span>{stats.originalSize} bytes</span>
          </div>
          <div className="stat-box">
            <h3>Token Count</h3>
            <span>{stats.tokenCount} tokens</span>
          </div>
          <div className="stat-box">
            <h3>Compression Ratio</h3>
            <span>
              {stats.compressionRatio ? (
                `${stats.compressionRatio.toFixed(2)}x (${stats.compressionRatio > 1 ? 'compression' : 'expansion'})`
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 