import React from 'react';
import './TokenVisualizer.css';

const TokenVisualizer = ({ text, tokens, decoded, tokenMappings = [] }) => {
  if (!tokens || tokens.length === 0 || !text) {
    return null;
  }

  // Generate color based on token ID for consistency
  const getColorForToken = (tokenId) => {
    // Generate colors from a palette of 20 distinct colors to avoid too similar colors
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
      '#33FFF5', '#FF5733', '#C733FF', '#33C7FF', '#FFC733',
      '#7FFF33', '#FF337F', '#337FFF', '#FF7F33', '#33FF7F',
      '#7F33FF', '#FF7F33', '#33FF7F', '#7F33FF', '#FFFF33'
    ];
    return colors[Math.abs(tokenId) % colors.length];
  };

  // Determine if a character is narrow (like i, l, I, etc.)
  const isNarrowChar = (char) => {
    const narrowChars = ['i', 'l', 'I', 'j', 'f', 't', '!', '.', ',', ':', ';', '\'', '"', '`', '|', '(', ')', '[', ']', '{', '}'];
    return narrowChars.includes(char) || char.trim() === '';
  };

  // Create token spans with background colors
  const renderTokenizedText = () => {
    // Check if we have token mappings from the API
    if (tokenMappings && tokenMappings.length > 0) {
      // Use the mappings provided by the API
      return tokenMappings.map((mapping, index) => {
        const text = mapping.text || ' ';
        const isNarrow = text.length === 1 && isNarrowChar(text);
        
        return (
          <span
            key={index}
            className={`token ${isNarrow ? 'narrow-char' : ''}`}
            style={{ backgroundColor: getColorForToken(mapping.id) }}
            title={`Token ID: ${mapping.id}`}
          >
            {text}
          </span>
        );
      });
    } else {
      // Fall back to the original method if no mappings are provided
      // Get byte representation of the decoded text
      const textBytes = new TextEncoder().encode(decoded);
      
      // Track the current position in the byte array
      let bytePosition = 0;
      
      // Map each token to the corresponding text segment
      return tokens.map((tokenId, index) => {
        // Get the token's string representation from the decoded text
        // We need to determine how many bytes this token represents
        const tokenLength = getTokenLength(tokens, index, textBytes, bytePosition);
        
        // Extract the token's text from the decoded string
        const tokenText = decoded.substring(
          bytePosition, 
          Math.min(bytePosition + tokenLength, decoded.length)
        );
        
        // Check if this is a narrow character
        const isNarrow = tokenText.length === 1 && isNarrowChar(tokenText);
        
        // Move the byte position forward
        bytePosition += tokenLength;
        
        // Return a styled span for this token
        return (
          <span
            key={index}
            className={`token ${isNarrow ? 'narrow-char' : ''}`}
            style={{ backgroundColor: getColorForToken(tokenId) }}
            title={`Token ID: ${tokenId}`}
          >
            {tokenText || ' '}
          </span>
        );
      });
    }
  };

  // Helper function to estimate token length in the decoded text
  const getTokenLength = (tokens, index, textBytes, currentPosition) => {
    // If this is the last token, return the rest of the text
    if (index === tokens.length - 1) {
      return textBytes.length - currentPosition;
    }
    
    // Otherwise we need to estimate based on the decoded text length and number of tokens
    const avgTokenLength = Math.ceil(textBytes.length / tokens.length);
    
    // Ensure we don't exceed text bounds
    return Math.min(avgTokenLength, textBytes.length - currentPosition);
  };

  return (
    <div className="token-visualizer">
      <h3>Tokenized Text Visualization</h3>
      <div className="token-text-container">
        {renderTokenizedText()}
      </div>
      <div className="token-legend">
        <p><small>Each color represents a different token. Hover over a segment to see its token ID.</small></p>
      </div>
    </div>
  );
};

export default TokenVisualizer; 