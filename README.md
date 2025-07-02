# Byte Pair Encoding Tokenizer

This project implements a Byte Pair Encoding (BPE) tokenizer with a React-based UI for demonstration.

## Project Structure

- **Main/**: Backend code for the tokenizer

  - `tokenizer.py`: Core tokenizer implementation
  - `encode.py`: Original tokenizer training code
  - `save_existing_tokenizer.py`: Script to save the tokenizer
  - `api.py`: Flask API to serve the tokenizer
  - `wsgi.py`: WSGI entry point for production deployment

- **Frontend/**: React web UI for the tokenizer
  - React application with modern UI

## Local Development Setup

### 1. Install Backend Dependencies

```bash
cd Main
pip install -r requirements.txt
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

### 4. Install Frontend Dependencies and Run

```bash
cd Frontend
npm install
npm start
```

The React app will run on http://localhost:3000

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
