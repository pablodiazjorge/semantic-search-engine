-- Alternative SQL script to populate the database without relying on the backend.
-- Vectors are pre-generated normalized random arrays of 384 dimensions.
-- To run: psql -U pablo -d semantic_search -f scripts/seed-db.sql

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_embedding_hnsw
ON documents USING hnsw (embedding vector_cosine_ops);

-- Helper function to generate a normalized random vector of the given dimension
CREATE OR REPLACE FUNCTION random_normalized_vector(dim INTEGER)
RETURNS vector AS $$
DECLARE
    arr float[];
    sum_squares float := 0.0;
    magnitude float;
    i int;
BEGIN
    FOR i IN 1..dim LOOP
        arr[i] := random() * 2 - 1;
        sum_squares := sum_squares + arr[i] * arr[i];
    END LOOP;

    magnitude := sqrt(sum_squares);
    IF magnitude > 0 THEN
        FOR i IN 1..dim LOOP
            arr[i] := arr[i] / magnitude;
        END LOOP;
    END IF;

    RETURN arr::vector;
END;
$$ LANGUAGE plpgsql;

-- Clear previous data to avoid duplicates on re-runs
TRUNCATE documents RESTART IDENTITY;

INSERT INTO documents (content, embedding) VALUES
('Transformers revolutionized natural language processing by introducing the self-attention mechanism.', random_normalized_vector(384)),
('Vector databases such as pgvector store embeddings and enable semantic similarity search.', random_normalized_vector(384)),
('Fine-tuning large language models requires curated data and optimization techniques like LoRA.', random_normalized_vector(384)),
('Embeddings are dense numerical representations that capture the semantic meaning of text.', random_normalized_vector(384)),
('The encoder-decoder architecture is fundamental for machine translation and text summarization.', random_normalized_vector(384)),
('Retrieval-augmented generation combines document retrieval with generative models.', random_normalized_vector(384)),
('Tokenization splits text into processable units for NLP models.', random_normalized_vector(384)),
('Semantic search evaluation uses metrics such as recall@k, precision@k and nDCG.', random_normalized_vector(384)),
('Sentence-transformers models generate embeddings optimized for cosine similarity.', random_normalized_vector(384)),
('Model quantization reduces size and inference latency in constrained environments.', random_normalized_vector(384)),
('Transfer learning adapts pre-trained models to specific domains with limited data.', random_normalized_vector(384)),
('HNSW and IVFFlat indexes accelerate nearest-neighbor searches over vectors.', random_normalized_vector(384)),
('Retrieval-augmented generation improves responses with relevant context.', random_normalized_vector(384)),
('Text preprocessing includes normalization, stop words, stemming and lemmatization.', random_normalized_vector(384)),
('PostgreSQL with pgvector runs similarity queries integrating relational and vector data.', random_normalized_vector(384));
