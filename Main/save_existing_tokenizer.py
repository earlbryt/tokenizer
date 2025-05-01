from tokenizer import BytePairTokenizer
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the necessary variables from encode.py
from encode import vocab, merges

# Create a tokenizer instance with the existing vocabulary and merges
tokenizer = BytePairTokenizer(vocab=vocab, merges=merges)

# Save the tokenizer
output_path = "trained_tokenizer.pkl"
tokenizer.save(output_path)
print(f"Saved existing tokenizer to {output_path}")

# Test the tokenizer
test_text = "While tokenization itself preserves meaning perfectly, how LLMs process and interpret those tokens afterward is where compression of meaning and potential loss can occur."
encoded = tokenizer.encode(test_text)
decoded = tokenizer.decode(encoded)

print(f"\nTesting tokenizer:")
print(f"Original: {test_text}")
print(f"Encoded length: {len(encoded)} tokens")
print(f"Decoded matches original: {test_text == decoded}") 