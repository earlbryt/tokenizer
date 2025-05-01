# Byte Pair Encoding Tokenizer

This project implements a Byte Pair Encoding (BPE) tokenizer with a web-based UI for demonstration.

## Project Structure

- **Main/**: Backend code for the tokenizer

  - `tokenizer.py`: Core tokenizer implementation
  - `encode.py`: Original tokenizer training code
  - `save_existing_tokenizer.py`: Script to save the tokenizer
  - `use_tokenizer.py`: CLI interface for the tokenizer
  - `api.py`: Flask API to serve the tokenizer

- **Frontend/**: Web UI for the tokenizer
  - `index.html`: Main HTML page
  - `styles.css`: CSS styling
  - `script.js`: JavaScript for UI interaction

## Setup Instructions

### 1. Install Dependencies

```bash
pip install flask flask-cors
```

### 2. Save the Tokenizer

First, you need to save the tokenizer model:

```bash
cd Main
python save_existing_tokenizer.py
```

This will create a `trained_tokenizer.pkl` file.

### 3. Start the API Server

```bash
cd Main
python api.py
```

The API will run on http://localhost:5000

### 4. Open the Web UI

Open the `Frontend/index.html` file in your web browser. You can do this by:

- Double-clicking the file in your file explorer
- Or if you have Python installed, run a simple HTTP server:

```bash
cd Frontend
python -m http.server 8000
```

Then navigate to http://localhost:8000 in your browser.

## Using the Tokenizer UI

1. Enter text in the input area
2. Click the "Encode" button
3. View the generated tokens and statistics
4. The decoded text will be shown to verify the tokenization is lossless

## API Endpoints

- `POST /api/tokenize`: Tokenize text

  - Request body: `{ "text": "your text here" }`
  - Response: Tokens, decoded text, and statistics

- `GET /api/health`: Check if the API is running

## Advanced Usage

For programmatic use, you can import the tokenizer in your Python code:

```python
from tokenizer import BytePairTokenizer

# Load the tokenizer
tokenizer = BytePairTokenizer.load("trained_tokenizer.pkl")

# Encode text to tokens
tokens = tokenizer.encode("Your text here")

# Decode tokens back to text
text = tokenizer.decode(tokens)
```
