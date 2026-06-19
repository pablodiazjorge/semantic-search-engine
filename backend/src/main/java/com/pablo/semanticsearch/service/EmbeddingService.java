package com.pablo.semanticsearch.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmbeddingService {

    private static final int EMBEDDING_DIMENSION = 384;
    private final Random random = new Random();

    /**
     * Generates a simulated 384-dimensional embedding.
     * In a production engine this would be replaced by a call to a model such as
     * sentence-transformers/all-MiniLM-L6-v2. Here a normalized random vector is
     * generated to demonstrate the functionality without depending on external APIs.
     */
    public float[] generateEmbedding(String text) {
        float[] vector = new float[EMBEDDING_DIMENSION];

        for (int i = 0; i < EMBEDDING_DIMENSION; i++) {
            vector[i] = random.nextFloat() * 2 - 1;
        }

        normalize(vector);
        return vector;
    }

    private void normalize(float[] vector) {
        double sumOfSquares = 0.0;
        for (float value : vector) {
            sumOfSquares += value * value;
        }

        double magnitude = Math.sqrt(sumOfSquares);
        if (magnitude == 0.0) {
            return;
        }

        for (int i = 0; i < vector.length; i++) {
            vector[i] = (float) (vector[i] / magnitude);
        }
    }

    public String embeddingToPgVectorString(float[] embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            sb.append(embedding[i]);
            if (i < embedding.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
