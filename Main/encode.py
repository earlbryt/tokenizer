train_data = """
Stages of Large Language Model Development 🌍🤖

Developing a Large Language Model (LLM) like me, Grok, is a complex journey costing €millions and requiring teams of engineers, data scientists, and computational resources. From collecting vast datasets to deploying models that understand Привет (Cyrillic), हिन्दी (Devanagari), or مرحبا (Arabic), each stage is critical. Let's dive into the stages of LLM development—data collection, preprocessing, architecture design, training, evaluation, and deployment—exploring each concept with a sprinkle of emojis 😊 and special characters (π, £, é) to make this a tokenizer's delight!

1. Data Collection: Gathering the World's Words 📚🌐

The first stage is collecting data, the raw material for LLMs. Imagine a library with €billions of books, websites, and social media posts—LLMs need terabytes of text to learn language patterns. Sources include:

Web Scraping: Crawling sites for blogs, forums, and articles (e.g., hello@world.com posts).
Public Datasets: Wikipedia, Common Crawl, or multilingual corpora like हिन्दी news.
Books and Journals: From Shakespeare to math papers with π and ∑.

Challenges:

Diversity: Including non-Latin scripts (e.g., Привет!) ensures global coverage.
Quality: Filtering out noise (e.g., "¡spammy ads!") is tough.
Ethics: Respecting © copyrights and privacy costs £thousands in legal reviews.

For tokenizer training, this stage produces raw text with varied Unicode code points (e.g., space at U+0020, 😊 at U+1F60A), encoded as UTF-8 bytes (e.g., b'\xf0\x9f\x98\x8a'). A tokenizer must handle these diverse byte sequences.

2. Preprocessing: Cleaning and Tokenizing the Data 🧹📝

Next, we preprocess the data to make it model-ready. This involves cleaning and tokenizing text, turning words like "café" and emojis 😺 into numerical tokens.

Cleaning:

Remove junk (e.g., broken HTML: <br>).
Normalize text (e.g., "CafÉ" → "café" with é at U+00E9).
Handle multilingual text (e.g., مرحبا → standardized Arabic).


Pretokenization:

Split on spaces (U+0020, byte 0x20) and punctuation (e.g., ¡, ?).
Example: "Hello, world! 😊" → ["Hello", ",", "world", "!", "😊"].


Tokenization:

Use Byte Pair Encoding (BPE) for byte-level tokenization (your earlier question!).
Encode text to UTF-8 bytes (e.g., 😊 → b'\xf0\x9f\x98\x8a').
Merge frequent byte pairs (e.g., 0x48 0x6f for "Ho") into tokens.
Example: "café 😊" → tokens [99, 97, 102, 233, 240, 159, 152, 138] (hex bytes: 0x63, 0x61, 0x66, 0xe9, 0xf0, 0x9f, 0x98, 0x8a).


Why It Matters: Tokenization reduces text to numbers, enabling models to process ñandú or 🚀. For your tokenizer, this stage tests handling multi-byte sequences and frequent ASCII characters (e.g., a–z).

3. Model Architecture: Building the Brain 🧠🏗️

The architecture defines the LLM's structure, typically a transformer—a neural network with layers of interconnected nodes. Key components include:

Embedding Layer: Maps tokens to vectors (e.g., "hello" → [0.1, -0.3, ...]).
Attention Mechanism: Weighs word importance (e.g., "café" attends to "coffee").
Feed-Forward Layers: Process patterns (e.g., ∑n=1^∞ in math texts).
Output Layer: Predicts next tokens (e.g., after Hello comes ,).

Innovations:

Models like GPT use £millions in compute to scale layers (e.g., 175B parameters for GPT-3).
Multilingual support handles हिन्दी or Привет via shared embeddings.

Tokenizer Impact: The vocabulary size (e.g., 50,000 tokens) affects embedding size. Your tokenizer must balance ASCII (1-byte, e.g., 0x20 for space) and emojis (4-byte, e.g., 0xf0 0x9f 0x98 0x8a).

4. Training: Teaching the Model to Talk 🎓💻

Training is where the LLM learns by adjusting weights to predict text. It's like teaching a child to speak, but with €millions in GPUs!

Process:
Feed tokenized text (e.g., hello 😊 world).
Predict next token (e.g., after hello → 😊).
Minimize errors using loss functions (e.g., cross-entropy).


Scale: Training on datasets like Common Crawl takes weeks, costing $millions.
Multilingual: Models learn مرحبا and 日本語 alongside English.

Challenges:

Overfitting: Memorizing "café" instead of generalizing.
Bias: Avoiding stereotypes (e.g., engineer ≠ male).
Compute: GPUs crunch π-trillions of calculations.

Tokenizer Role: Efficient tokenization (e.g., BPE merging 0x48 0x6f for "Ho") reduces memory, speeding up training. Your tokenizer needs to handle diverse byte sequences.

5. Evaluation: Testing the Model's Smarts 📊🧪

Evaluation checks if the LLM understands language. Metrics include:

Perplexity: Measures prediction accuracy (lower is better).
BLEU: Compares outputs to human translations (e.g., Привет → "Hello").
Human Eval: Experts rate responses (e.g., "Is 😊 appropriate?").

Tests:

Multilingual: Can it translate हिन्दी to English?
Math: Solve π ≈ 3.14159.
Ethics: Avoid harmful outputs (e.g., no bias in ¡Hola! responses).

Tokenizer Impact: Evaluation texts include emojis (🌟) and special characters (£), testing your tokenizer's ability to handle UTF-8 bytes (e.g., 0xe2 0x82 0xac for €).

6. Deployment: Bringing the Model to Life 🚀🌍

Deployment makes the LLM accessible, like me on grok.com or X's iOS app 😎.

APIs: Serve models via endpoints (e.g., x.ai/api, costing €thousands).
Optimization: Quantize weights to run on £1000 GPUs.
Scaling: Handle millions of users typing مرحبا or 😺.

Challenges:

Latency: Respond in milliseconds to "café or tea?".
Safety: Filter toxic inputs (e.g., "¡hate!").
Multilingual: Support 日本語 and हिन्दी.

Tokenizer Role: Deployed models process user inputs as UTF-8 bytes, requiring your tokenizer to handle 0x20 (space), 0xf0 0x9f 0x98 0x8a (😊), and more.

Conclusion: The Future of LLMs 🌟📈

Building an LLM is a €multi-million endeavor, blending data, math (π, ∑), and engineering. From collecting Привет to deploying 😊-filled chats, each stage shapes a model that speaks globally. Your tokenizer, trained on texts like this, must master ASCII (a–z, 0x20) and Unicode (é, 🚀) to power the next Grok. Keep exploring, and maybe you'll mint the next LLM masterpiece! 🤖🚀

Word Count: ~1000 words, packed with €, π, 😊, and more for tokenizer training!
"""

tokens = train_data.encode("utf-8")
tokens = list(map(int, tokens))
# print(tokens)



def get_token_pair_frequency(tokens):
    token_pair_frequency = {}
    for i in range(len(tokens) - 1):
        token_pair = (tokens[i], tokens[i + 1])
        if token_pair in token_pair_frequency:
            token_pair_frequency[token_pair] += 1
        else:
            token_pair_frequency[token_pair] = 1
    return token_pair_frequency
            
token_pairs = get_token_pair_frequency(tokens)
# print(token_pairs)
# print(sorted(((v,k) for k,v in token_pairs.items()), reverse=True))
# print(chr(115))
# print(chr(32))

top_pair = max(token_pairs, key=token_pairs.get)
# print(top_pair)


def merge_tokens(ids,pair,idx):
  new_ids = []
  i = 0
  while i < len(ids):
    if i < len(ids) - 1 and ids[i] == pair[0] and ids[i+1] == pair[1]:
      new_ids.append(idx)
      i+= 2
    else:
      new_ids.append(ids[i])
      i+= 1
  return new_ids

# Trial merge
# print(merge_tokens([3,5,5,6,7], (5,6), 99))
  
tokens2 = merge_tokens(tokens,top_pair, 256)
# print(tokens2)
print("Length of tokens2:", len(tokens2))

vocab_size = 290
num_merges = vocab_size - 256
ids = list(tokens)

merges = {}

for i in range(num_merges):
  token_pairs = get_token_pair_frequency(ids)
  top_pair = max(token_pairs, key=token_pairs.get)
  idx = 256 + i
  print(f"merging {top_pair} into a new token {idx}")
  ids = merge_tokens(ids, top_pair, idx)
  merges[top_pair] = idx

# print(ids)

compression_ration = len(tokens) / len(ids)

# print("Length of original text:", len(train_data))
# print("Length of tokens:", len(tokens))
# print("Length of ids:", len(ids))
# print(f"Compression ratio: {compression_ration:.2f}x")

# DECODING
def decode(ids):
  







            
