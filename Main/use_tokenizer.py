from tokenizer import BytePairTokenizer

def main():
    # Load the tokenizer
    tokenizer_path = "trained_tokenizer.pkl"
    try:
        tokenizer = BytePairTokenizer.load(tokenizer_path)
        print(f"Successfully loaded tokenizer from {tokenizer_path}")
    except FileNotFoundError:
        print(f"Tokenizer file not found: {tokenizer_path}")
        print("Please run save_existing_tokenizer.py first")
        return
    
    # Process example text
    while True:
        user_input = input("\nEnter text to tokenize (or 'q' to quit): ")
        if user_input.lower() == 'q':
            break
            
        # Encode the text to tokens
        tokens = tokenizer.encode(user_input)
        
        # Decode back to text
        decoded = tokenizer.decode(tokens)
        
        # Display results
        print(f"Original text: {user_input}")
        print(f"Encoded tokens ({len(tokens)} tokens): {tokens}")
        print(f"Decoded text: {decoded}")
        print(f"Matches original: {user_input == decoded}")
        
        # Calculate compression ratio
        original_bytes = len(user_input.encode('utf-8'))
        print(f"Compression ratio: {original_bytes}/{len(tokens)} = {original_bytes/len(tokens):.2f}x")

if __name__ == "__main__":
    main() 