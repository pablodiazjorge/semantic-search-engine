-- pgvector extension for PostgreSQL 16 (pgvector 0.6.2)
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table with 384-dimensional embeddings
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384),
    created_at TIMESTAMP DEFAULT NOW()
);

-- HNSW index for cosine similarity search (available in pgvector 0.6.2)
CREATE INDEX IF NOT EXISTS idx_documents_embedding_hnsw
ON documents USING hnsw (embedding vector_cosine_ops);
