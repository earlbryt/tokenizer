"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface TokenVisualizerProps {
  text: string
  tokens: number[]
  decoded: string
  tokenMappings?: Array<{ id: number; text: string }>
}

const TokenVisualizer: React.FC<TokenVisualizerProps> = ({ 
  text, 
  tokens, 
  decoded, 
  tokenMappings = [] 
}) => {
  if (!tokens || tokens.length === 0 || !text) {
    return null
  }

  // Generate color based on token ID for consistency
  const getColorForToken = (tokenId: number) => {
    // Generate colors from a palette of distinct colors
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
      '#33FFF5', '#FF5733', '#C733FF', '#33C7FF', '#FFC733',
      '#7FFF33', '#FF337F', '#337FFF', '#FF7F33', '#33FF7F',
      '#7F33FF', '#FF7F33', '#33FF7F', '#7F33FF', '#FFFF33'
    ]
    return colors[Math.abs(tokenId) % colors.length]
  }

  // Determine if a character is narrow (like i, l, I, etc.)
  const isNarrowChar = (char: string) => {
    const narrowChars = ['i', 'l', 'I', 'j', 'f', 't', '!', '.', ',', ':', ';', '\'', '"', '`', '|', '(', ')', '[', ']', '{', '}']
    return narrowChars.includes(char) || char.trim() === ''
  }

  // Create token spans with background colors
  const renderTokenizedText = () => {
    // Check if we have token mappings from the API
    if (tokenMappings && tokenMappings.length > 0) {
      // Use the mappings provided by the API
      return tokenMappings.map((mapping, index) => {
        const tokenText = mapping.text || ' '
        const isNarrow = tokenText.length === 1 && isNarrowChar(tokenText)
        
        return (
          <span
            key={index}
            className={`token ${isNarrow ? 'narrow-char' : ''}`}
            style={{ backgroundColor: getColorForToken(mapping.id) }}
            title={`Token ID: ${mapping.id}`}
          >
            {tokenText}
          </span>
        )
      })
    } else {
      // Fall back to the original method if no mappings are provided
      // Get byte representation of the decoded text
      const textBytes = new TextEncoder().encode(decoded)
      
      // Track the current position in the byte array
      let bytePosition = 0
      
      // Map each token to the corresponding text segment
      return tokens.map((tokenId, index) => {
        // Get the token's string representation from the decoded text
        // Determine how many bytes this token represents
        const tokenLength = getTokenLength(tokens, index, textBytes, bytePosition)
        
        // Extract the token's text from the decoded string
        const tokenText = decoded.substring(
          bytePosition, 
          Math.min(bytePosition + tokenLength, decoded.length)
        )
        
        // Check if this is a narrow character
        const isNarrow = tokenText.length === 1 && isNarrowChar(tokenText)
        
        // Move the byte position forward
        bytePosition += tokenLength
        
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
        )
      })
    }
  }

  // Helper function to estimate token length in the decoded text
  const getTokenLength = (tokens: number[], index: number, textBytes: Uint8Array, currentPosition: number) => {
    // If this is the last token, return the rest of the text
    if (index === tokens.length - 1) {
      return textBytes.length - currentPosition
    }
    
    // Otherwise we need to estimate based on the decoded text length and number of tokens
    const avgTokenLength = Math.ceil(textBytes.length / tokens.length)
    
    // Ensure we don't exceed text bounds
    return Math.min(avgTokenLength, textBytes.length - currentPosition)
  }

  return (
    <Card className="border-slate-200 shadow-md dark:border-slate-800 my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tokenized Text Visualization
        </CardTitle>
        <CardDescription>
          Each colored block represents a different token
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 overflow-auto font-mono text-sm">
          {renderTokenizedText()}
        </div>
        <div className="mt-3 text-sm text-muted-foreground text-center">
          <p><small>Hover over each segment to see the token ID.</small></p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TokenVisualizer 