package com.pablo.semanticsearch.dto;

public class SearchResponse {

    private Integer id;
    private String content;
    private Double score;

    public SearchResponse() {
    }

    public SearchResponse(Integer id, String content, Double score) {
        this.id = id;
        this.content = content;
        this.score = score;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}
