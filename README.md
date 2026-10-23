# Semantic Search Engine (January 2024 - June 2024)

> **Snapshot (2024).** Published in 2026, keeping the stack of the time; not maintained. Limitations: a vector search skeleton with simulated embeddings (`EmbeddingService.java:19-28`), and Postgres on `0.0.0.0:5432` with the default password, for local development only. See [Limitations](#limitations).

Corporate semantic search engine with vector storage in PostgreSQL.
This project demonstrates how to build an embedding-based information retrieval system using Spring Boot, Angular, PostgreSQL and the pgvector extension.

## Technology stack

### Backend
- **Java**: 21.0.2 LTS
- **Spring Boot**: 3.2.6
- **Maven**: 3.9.6
- **Hibernate**: 6.4.8.Final
- **PostgreSQL**: 16.2
- **pgvector**: 0.6.2

### Frontend
- **Angular**: 17.3.12
- **Angular CLI**: 17.3.12
- **TypeScript**: 5.3.3
- **RxJS**: 7.8.1
- **Node.js**: 20.12.2 LTS

### Infrastructure
- **Docker Compose**: v2.26
- **Backend Docker image**: `eclipse-temurin:21-jre-alpine`
- **Frontend Docker image**: `node:20.12-bookworm-slim` (build), `nginx:stable-alpine` (serve)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2.26 or higher.
- (Optional) Node.js 20.12.2 if you want to run the frontend in local development mode.
- (Optional) Maven 3.9.6 and Java 21.0.2 if you want to compile the backend locally.
- **Windows users**: For ingestion scripts, use `curl.exe` or Git Bash. PowerShell `Invoke-RestMethod` may cause encoding issues (see troubleshooting).

## Project structure

```
semantic-search-engine/
├── backend/                 # Spring Boot application
│   ├── src/main/java/...    # Java source code
│   ├── src/main/resources/  # application.yml and schema.sql
│   ├── pom.xml              # Maven with Spring Boot 3.2.6
│   └── Dockerfile           # eclipse-temurin:21-jre-alpine
├── frontend/                # Angular 17 application
│   ├── src/app/             # Components, services and models
│   ├── package.json         # Angular 17.3.12 dependencies
│   ├── Dockerfile           # Node builder + Nginx
│   └── nginx.conf           # Proxy to the backend
├── scripts/                 # Utility scripts
│   ├── generate-sample-data.sh  # Inserts documents via API (bash)
│   └── seed-db.sql             # Inserts documents via SQL
├── docker-compose.yml       # Orchestrates PostgreSQL + backend + frontend
├── .env.example             # Example environment variables
└── README.md                # This guide
```

## Installation and usage

### 1. Clone and configure

```bash
cd semantic-search-engine
cp .env.example .env
```

The `.env` file contains default credentials suitable for local development.

### 2. Build and run with Docker Compose

```bash
docker compose up --build -d
```

This builds and starts three services:

- `postgres`: PostgreSQL 16 with pgvector on port `5432`.
- `backend`: Spring Boot REST API on port `8080`.
- `frontend`: Angular application served by Nginx on port `80`.

The backend waits for PostgreSQL to be healthy before starting, and the frontend waits for the backend.

### 3. Verify backend health

```bash
curl http://localhost:8080/api/health
```

Expected response:

```json
{"status":"UP","service":"semantic-search"}
```

### 4. Load sample data

#### Option A: bash script (Linux/macOS/Git Bash on Windows)

```bash
./scripts/generate-sample-data.sh
```

The script waits for the backend and then ingests 15 sample documents about AI, NLP, transformers and vector databases.

#### Option B: direct SQL (any platform)

```bash
docker exec -i semantic-search-postgres psql -U pablo -d semantic_search < scripts/seed-db.sql
```

This alternative does not require the backend to be running.

#### Option C: from PowerShell on Windows (recommended to avoid encoding issues)

```powershell
# Clear the table if it already has data
docker exec -i semantic-search-postgres psql -U pablo -d semantic_search -c "TRUNCATE documents RESTART IDENTITY;"

# List of sample documents (correct UTF-8)
$documents = @(
    "Transformers revolutionized natural language processing by introducing the self-attention mechanism.",
    "The attention mechanism lets models weigh the importance of different parts of a sequence.",
    "BERT is a bidirectional transformer-based pre-trained language model.",
    "GPT uses autoregressive decoders to generate coherent text.",
    "Vector databases store embeddings for efficient semantic search.",
    "pgvector is a PostgreSQL extension that stores and queries embedding vectors.",
    "Cosine similarity measures closeness between embedding vectors.",
    "Embeddings are dense numerical representations that capture the semantic meaning of text.",
    "Deep learning enables machines to understand and generate natural language.",
    "Diffusion models generate high-quality images from text descriptions.",
    "RAG (Retrieval-Augmented Generation) combines document retrieval with text generation.",
    "Cognitive agents use reasoning, planning and external tools to solve complex tasks.",
    "HNSW is an approximate nearest-neighbor search algorithm in vector spaces.",
    "Tokenization splits text into smaller units such as words or subwords.",
    "Fine-tuning adapts pre-trained language models to specific tasks and domains."
)

foreach ($doc in $documents) {
    $json = "{`"content`":`"$doc`"}"
    Write-Host "Ingesting: $doc"
    curl.exe -X POST http://localhost:8080/api/ingest -H "Content-Type: application/json; charset=utf-8" -d $json
}
```

## How to test search

### From the web interface

Open [http://localhost](http://localhost) in your browser. Type a query such as:

> "transformers and natural language processing"

and press **Search**. Results are ordered by cosine similarity.

### From the command line

On Linux/macOS/Git Bash:

```bash
curl -X POST http://localhost:8080/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "embeddings and vector databases", "topK": 5}'
```

On PowerShell (Windows):

```powershell
curl.exe -X POST http://localhost:8080/api/search -H "Content-Type: application/json" -d '{"query":"embeddings and vector databases","topK":5}'
```

### Ingest a new document

On Linux/macOS/Git Bash:

```bash
curl -X POST http://localhost:8080/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"content": "Your document text here"}'
```

On PowerShell (Windows):

```powershell
curl.exe -X POST http://localhost:8080/api/ingest -H "Content-Type: application/json; charset=utf-8" -d '{"content":"Your document text here"}'
```

## Technical notes

- The embedding service generates normalized random 384-dimensional vectors to demonstrate functionality without depending on external APIs.
- In production it is recommended to replace `EmbeddingService` with a call to a model such as `sentence-transformers/all-MiniLM-L6-v2`.
- The native pgvector query uses the `<=>` operator for cosine distance on the `embedding vector(384)` column.
- An HNSW index (`vector_cosine_ops`) was created to accelerate similarity searches.
- Document insertion uses `JdbcTemplate` with a native query that casts the embedding to the `vector(384)` type via `CAST(? AS vector(384))`. This prevents the JDBC driver from interpreting the array as `character varying`.

## Troubleshooting

### 500 error when ingesting a document

**Symptom**: `ERROR: column "embedding" is of type vector but expression is of type character varying`.

**Cause**: The PostgreSQL JDBC driver sends the double array as `character varying` and pgvector does not perform implicit conversion.

**Solution**: Insertion is performed through `JdbcTemplate` with the query:
```sql
INSERT INTO documents (content, embedding) VALUES (?, CAST(? AS vector(384)))
RETURNING id, content, embedding, created_at
```
The explicit `CAST` guarantees conversion to the native pgvector type. Make sure the backend has the `spring-boot-starter-jdbc` dependency in `pom.xml`.

### 400 error on Windows when using Invoke-RestMethod

**Symptom**: `HttpMessageNotReadableException: JSON parse error: Invalid UTF-8...`.

**Cause**: PowerShell `Invoke-RestMethod` sends JSON with a non-UTF-8 encoding, breaking accents and tildes.

**Solution**: Use `curl.exe` or Git Bash instead. See **Option C** in the sample data section.

### `npm ci` error when building the frontend with Docker

**Symptom**: `The npm ci command can only install with an existing package-lock.json`.

**Cause**: `package-lock.json` was not included in the build context.

**Solution**: Run `npm install` in the `frontend` folder before `docker compose up --build`. This generates the `package-lock.json` file that `npm ci` requires.

## Local development (optional)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The application will be available at [http://localhost:4200](http://localhost:4200).

## Limitations

- **The embeddings are simulated.** `EmbeddingService.generateEmbedding` (`backend/src/main/java/com/pablo/semanticsearch/service/EmbeddingService.java:19-28`) ignores the text and returns a normalized random 384-dimensional vector, a new one on every call. Storage, the HNSW index and the cosine query are real, but the ranking is random, not semantic. Plugging in a real embedding model is the missing piece.
- **The database setup is for local development only.** `docker-compose.yml` publishes Postgres as `5432:5432`, which listens on every interface (`0.0.0.0:5432`), and the stack falls back to the default user and password from `.env.example` (also the fallback in `application.yml`). Change both before running it anywhere but your own machine.
- **There are no tests.** Neither the backend nor the frontend has any.

## License

This project's code is licensed under the [MIT License](LICENSE).

## A note on the commit history

This repository was published in 2026 as a curated reference of work originally designed and prototyped between January 2024 - June 2024. The technology stack reflects the versions available during that development window and has been intentionally preserved for historical accuracy.
