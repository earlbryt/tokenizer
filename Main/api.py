from flask import Flask, request, jsonify
from flask_cors import CORS
from tokenizer import BytePairTokenizer
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the tokenizer
tokenizer_path = os.path.join(os.path.dirname(__file__), "trained_tokenizer.pkl")

try:
    tokenizer = BytePairTokenizer.load(tokenizer_path)
    print(f"Successfully loaded tokenizer from {tokenizer_path}")
except FileNotFoundError:
    print(f"Tokenizer file not found: {tokenizer_path}")
    print("Using a default tokenizer instead")
    # Create a simple default tokenizer
    tokenizer = BytePairTokenizer()
    # You might want to train it on some sample text
    tokenizer.train("This is a sample text for default tokenizer.", vocab_size=300)

@app.route('/api/tokenize', methods=['POST'])
def tokenize():
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({
            'error': 'No text provided'
        }), 400
    
    text = data['text']
    
    # Encode the text to tokens
    tokens = tokenizer.encode(text)
    
    # Decode back to text
    decoded = tokenizer.decode(tokens)
    
    # Get token-to-text mappings for visualization
    token_mappings = []
    
    # Create a mapping from tokens to their text representation
    if tokens:
        try:
            # Convert text to bytes
            decoded_bytes = decoded.encode('utf-8')
            
            # Use a smarter approach to map tokens to text
            # Instead of just dividing evenly, we'll try to break at character boundaries
            
            total_tokens = len(tokens)
            total_chars = len(decoded)
            
            # If we have a perfect match, we can try a character-aware approach
            if text == decoded:
                # First make a rough estimate
                bytes_per_token = len(decoded_bytes) / total_tokens
                
                # Start tokenizing
                start_byte = 0
                for idx, token_id in enumerate(tokens):
                    # For the last token, just take the rest
                    if idx == total_tokens - 1:
                        end_byte = len(decoded_bytes)
                    else:
                        # Calculate approximate end position
                        approx_end = int(start_byte + bytes_per_token)
                        
                        # Ensure it doesn't exceed the buffer
                        end_byte = min(approx_end, len(decoded_bytes))
                    
                    # Extract the text and get its length
                    try:
                        token_bytes = decoded_bytes[start_byte:end_byte]
                        token_text = token_bytes.decode('utf-8', errors='replace')
                    except:
                        token_text = ""  # Unicode replacement character
                    
                    # Add mapping
                    token_mappings.append({
                        'id': token_id,
                        'text': token_text
                    })
                    
                    # Move to next position
                    start_byte = end_byte
            else:
                # Fallback to evenly dividing the text
                chars_per_token = max(1, total_chars / total_tokens)
                
                start_char = 0
                for token_id in tokens:
                    # Calculate end position
                    end_char = min(int(start_char + chars_per_token), total_chars)
                    
                    # Get token text
                    token_text = decoded[start_char:end_char]
                    
                    # Add mapping
                    token_mappings.append({
                        'id': token_id,
                        'text': token_text
                    })
                    
                    # Move to next position
                    start_char = end_char
                
        except Exception as e:
            print(f"Error creating token mappings: {e}")
    
    # Calculate compression
    original_bytes = len(text.encode('utf-8'))
    compression_ratio = original_bytes / len(tokens) if tokens else 0
    
    return jsonify({
        'tokens': tokens,
        'decoded': decoded,
        'tokenMappings': token_mappings,
        'stats': {
            'originalSize': original_bytes,
            'tokenCount': len(tokens),
            'compressionRatio': compression_ratio,
            'matches': text == decoded
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'tokenizer_loaded': tokenizer is not None
    })

if __name__ == '__main__':
    # Use PORT environment variable if available, otherwise default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 