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

## Deployment

### Backend Deployment

You can deploy the Flask backend on any platform that supports Python applications:

#### Option 1: Deploying on a VPS or Dedicated Server

1. Upload the Main directory to your server
2. Install requirements: `pip install -r requirements.txt`
3. Use Gunicorn to run the application:
   ```bash
   gunicorn --bind 0.0.0.0:5000 wsgi:app
   ```
4. Set up Nginx or Apache as a reverse proxy (recommended)

#### Option 2: Deploying on PythonAnywhere, Heroku, etc.

Follow the platform-specific instructions for deploying a Flask application.

### Frontend Deployment on Vercel

1. Create a Vercel account if you don't have one
2. Install Vercel CLI: `npm i -g vercel`
3. Navigate to the Frontend directory
4. Run `vercel` to deploy (or connect your GitHub repository to Vercel)
5. Set the environment variable in Vercel project settings:
   - `REACT_APP_API_URL`: URL of your deployed API

Alternatively, you can deploy directly from GitHub:

1. Push your code to GitHub
2. Create a new project on Vercel and import your repository
3. Configure the project:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables: Set `REACT_APP_API_URL` to your API URL

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
