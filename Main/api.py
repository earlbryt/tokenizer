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
    
    # Calculate compression
    original_bytes = len(text.encode('utf-8'))
    compression_ratio = original_bytes / len(tokens) if tokens else 0
    
    return jsonify({
        'tokens': tokens,
        'decoded': decoded,
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
    # Run the Flask app on port 5000
    app.run(debug=True, host='0.0.0.0', port=5000) 