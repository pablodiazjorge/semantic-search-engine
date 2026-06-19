#!/usr/bin/env bash

# Script to populate the semantic search engine with sample documents.
# Requires the backend to be running and reachable at http://localhost:8080

set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
HEALTH_ENDPOINT="${BACKEND_URL}/api/health"
INGEST_ENDPOINT="${BACKEND_URL}/api/ingest"

echo "Waiting for the backend to be healthy at ${HEALTH_ENDPOINT}..."

until curl -s -f "${HEALTH_ENDPOINT}" > /dev/null 2>&1; do
  echo "Backend not available yet, retrying in 2 seconds..."
  sleep 2
done

echo "Backend is available. Ingesting sample documents..."

# Array of sample documents about AI, NLP, transformers and vector databases
declare -a DOCUMENTS=(
  "Transformers revolutionized natural language processing by introducing the self-attention mechanism, enabling models like BERT and GPT to capture long-range context."
  "Vector databases such as pgvector, Pinecone and Weaviate store high-dimensional embeddings and perform efficient semantic similarity search."
  "Fine-tuning large language models requires curated datasets, optimization techniques like LoRA and scalable compute infrastructure."
  "Embeddings are dense numerical representations of text, images or audio that capture semantic meaning and enable information retrieval tasks."
  "The encoder-decoder architecture is fundamental for machine translation, text summarization and conditional answer generation."
  "Retrieval-augmented generation combines the retrieval of relevant documents with generative models to produce grounded responses and reduce hallucinations."
  "Tokenization is the first step in any NLP pipeline and determines how the model splits text into processable units."
  "Semantic search systems are evaluated using metrics such as recall@k, precision@k and nDCG to measure the relevance of retrieved results."
  "Sentence-transformers models generate sentence embeddings optimized for cosine similarity comparisons in vector spaces."
  "Model quantization reduces size and inference latency, making it easier to deploy LLMs in resource-constrained environments."
  "Transfer learning leverages knowledge from models pre-trained on large corpora and adapts them to specific domains with limited data."
  "HNSW and IVFFlat indexes accelerate nearest-neighbor searches in large vector collections, balancing speed and accuracy."
  "Retrieval-augmented generation improves response quality by providing relevant context extracted from a knowledge base."
  "Text preprocessing includes normalization, stop-word removal, stemming and lemmatization according to the pipeline requirements."
  "PostgreSQL with the pgvector extension enables similarity queries directly in SQL, integrating vector search with relational data."
)

for doc in "${DOCUMENTS[@]}"; do
  echo "Ingesting: ${doc:0:60}..."
  curl -s -X POST "${INGEST_ENDPOINT}" \
    -H "Content-Type: application/json" \
    -d "{\"content\": \"${doc}\"}" > /dev/null
done

echo "Successfully ingested ${#DOCUMENTS[@]} sample documents."
