package com.pablo.semanticsearch.repository;

import com.pablo.semanticsearch.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    /**
     * Cosine similarity search using pgvector.
     * The <=> operator returns cosine distance (lower = more similar).
     */
    @Query(value = """
            SELECT id, content, embedding <=> CAST(:queryEmbedding AS vector(384)) AS score
            FROM documents
            ORDER BY score
            LIMIT :topK
            """, nativeQuery = true)
    List<Object[]> findSimilarDocuments(
            @Param("queryEmbedding") String queryEmbedding,
            @Param("topK") int topK
    );
}
