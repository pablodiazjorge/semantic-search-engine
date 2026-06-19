package com.pablo.semanticsearch.controller;

import com.pablo.semanticsearch.dto.DocumentRequest;
import com.pablo.semanticsearch.dto.SearchRequest;
import com.pablo.semanticsearch.dto.SearchResponse;
import com.pablo.semanticsearch.model.Document;
import com.pablo.semanticsearch.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<Document> ingest(@Valid @RequestBody DocumentRequest request) {
        Document saved = searchService.ingestDocument(request.getContent());
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/search")
    public ResponseEntity<List<SearchResponse>> search(@Valid @RequestBody SearchRequest request) {
        List<SearchResponse> results = searchService.search(request.getQuery(), request.getTopK());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "semantic-search");
        return ResponseEntity.ok(status);
    }
}
