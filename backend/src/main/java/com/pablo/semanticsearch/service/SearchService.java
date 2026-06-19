package com.pablo.semanticsearch.service;

import com.pablo.semanticsearch.dto.SearchResponse;
import com.pablo.semanticsearch.model.Document;
import com.pablo.semanticsearch.repository.DocumentRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    private final DocumentRepository documentRepository;
    private final EmbeddingService embeddingService;
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Document> documentRowMapper = new RowMapper<>() {
        @Override
        public Document mapRow(ResultSet rs, int rowNum) throws SQLException {
            Document doc = new Document();
            doc.setId(rs.getInt("id"));
            doc.setContent(rs.getString("content"));
            doc.setEmbedding(rs.getString("embedding"));
            doc.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return doc;
        }
    };

    public SearchService(DocumentRepository documentRepository,
                         EmbeddingService embeddingService,
                         JdbcTemplate jdbcTemplate) {
        this.documentRepository = documentRepository;
        this.embeddingService = embeddingService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public Document ingestDocument(String content) {
        float[] embedding = embeddingService.generateEmbedding(content);
        String embeddingVector = embeddingService.embeddingToPgVectorString(embedding);

        // CAST to vector(384) is required because pgvector does not automatically
        // convert JDBC text parameters to its vector type.
        String sql = "INSERT INTO documents (content, embedding) VALUES (?, CAST(? AS vector(384))) RETURNING id, content, embedding, created_at";

        return jdbcTemplate.queryForObject(sql, documentRowMapper, content, embeddingVector);
    }

    @Transactional(readOnly = true)
    public List<SearchResponse> search(String query, int topK) {
        float[] queryEmbedding = embeddingService.generateEmbedding(query);
        String queryVectorString = embeddingService.embeddingToPgVectorString(queryEmbedding);

        List<Object[]> results = documentRepository.findSimilarDocuments(queryVectorString, topK);

        List<SearchResponse> response = new ArrayList<>();
        for (Object[] row : results) {
            Integer id = (Integer) row[0];
            String content = (String) row[1];
            Double score = ((Number) row[2]).doubleValue();
            response.add(new SearchResponse(id, content, score));
        }

        return response;
    }
}
