import pickle

def get_token_pair_frequency(tokens):
    """Calculate frequency of adjacent token pairs"""
    token_pair_frequency = {}
    for i in range(len(tokens) - 1):
        token_pair = (tokens[i], tokens[i + 1])
        if token_pair in token_pair_frequency:
            token_pair_frequency[token_pair] += 1
        else:
            token_pair_frequency[token_pair] = 1
    return token_pair_frequency

def merge_tokens(ids, pair, idx):
    """Merge token pairs into a single token"""
    new_ids = []
    i = 0
    while i < len(ids):
        if i < len(ids) - 1 and ids[i] == pair[0] and ids[i+1] == pair[1]:
            new_ids.append(idx)
            i += 2
        else:
            new_ids.append(ids[i])
            i += 1
    return new_ids

class BytePairTokenizer:
    """BPE Tokenizer implementation"""
    
    def __init__(self, vocab=None, merges=None):
        """Initialize with optional pre-trained vocab and merges"""
        if vocab is None:
            # Initialize with basic byte vocabulary
            self.vocab = {idx: bytes([idx]) for idx in range(256)}
        else:
            self.vocab = vocab
            
        self.merges = {} if merges is None else merges
    
    def train(self, text, vocab_size=1000, verbose=True):
        """Train tokenizer on a text corpus"""
        # Convert text to utf-8 bytes
        tokens = list(text.encode("utf-8"))
        
        # Initialize vocab with byte values
        self.vocab = {idx: bytes([idx]) for idx in range(256)}
        self.merges = {}
        
        # Calculate number of merges needed
        num_merges = vocab_size - 256
        if num_merges <= 0:
            return
            
        ids = list(tokens)
        
        for i in range(num_merges):
            token_pairs = get_token_pair_frequency(ids)
            if not token_pairs:
                break
                
            top_pair = max(token_pairs, key=token_pairs.get)
            idx = 256 + i
            
            if verbose:
                print(f"Merge {i+1}/{num_merges}: merging {top_pair} into token {idx}")
                
            ids = merge_tokens(ids, top_pair, idx)
            self.merges[top_pair] = idx
            self.vocab[idx] = self.vocab[top_pair[0]] + self.vocab[top_pair[1]]
    
    def encode(self, text):
        """Encode text into tokens"""
        tokens = list(text.encode("utf-8"))
        while len(tokens) > 1:
            token_frequency = get_token_pair_frequency(tokens)
            if not token_frequency:
                break
                
            pair = min(token_frequency, key=lambda p: self.merges.get(p, float('inf')))
            if pair not in self.merges:
                break
                
            idx = self.merges[pair]
            tokens = merge_tokens(tokens, pair, idx)
        return tokens
    
    def decode(self, ids):
        """Decode tokens back to text"""
        try:
            tokens = b"".join(self.vocab[idx] for idx in ids)
            text = tokens.decode("utf-8", errors='replace')
            return text
        except Exception as e:
            print(f"Error decoding: {e}")
            return ""
    
    def save(self, filepath):
        """Save tokenizer to file"""
        # Convert bytes to serializable format
        serializable_vocab = {}
        for idx, byte_val in self.vocab.items():
            serializable_vocab[idx] = list(byte_val)
        
        tokenizer_data = {
            'merges': self.merges,
            'vocab': serializable_vocab
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(tokenizer_data, f)
        return filepath
    
    @classmethod
    def load(cls, filepath):
        """Load tokenizer from file"""
        with open(filepath, 'rb') as f:
            tokenizer_data = pickle.load(f)
        
        # Convert serialized format back to bytes
        loaded_vocab = {}
        for idx, byte_list in tokenizer_data['vocab'].items():
            loaded_vocab[idx] = bytes(byte_list)
        
        loaded_merges = tokenizer_data['merges']
        return cls(vocab=loaded_vocab, merges=loaded_merges)

# Example usage
if __name__ == "__main__":
    # Example: Train a new tokenizer
    training_text = """
    This is a sample text for training a basic tokenizer.
    The Byte Pair Encoding algorithm will merge the most frequent pairs of bytes.
    This creates a vocabulary that efficiently represents the training text.
    """
    
    # Create and train tokenizer
    tokenizer = BytePairTokenizer()
    tokenizer.train(training_text, vocab_size=300)
    
    # Save the tokenizer
    tokenizer.save("sample_tokenizer.pkl")
    
    # Load the tokenizer
    loaded_tokenizer = BytePairTokenizer.load("sample_tokenizer.pkl")
    
    # Test encoding and decoding
    test_text = "Testing the tokenizer!"
    encoded = loaded_tokenizer.encode(test_text)
    decoded = loaded_tokenizer.decode(encoded)
    
    print(f"Original: {test_text}")
    print(f"Encoded: {encoded}")
    print(f"Decoded: {decoded}")
    print(f"Match: {test_text == decoded}") 