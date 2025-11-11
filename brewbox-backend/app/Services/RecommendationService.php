<?php

namespace App\Services;

use App\Models\Product;
use Phpml\FeatureExtraction\TokenCountVectorizer;
use Phpml\Tokenization\WhitespaceTokenizer;
use Phpml\FeatureExtraction\TfIdfTransformer;

class RecommendationService
{
    /**
     * Get recommended products based on TF-IDF and sentiment analysis
     */
    public function getRecommended(int $limit = 4)
    {
        $products = Product::with('reviews')->where('num_reviews', '>', 0)->get();

        if ($products->isEmpty()) {
            return [];
        }

        // Prepare documents for TF-IDF
        $documents = [];
        foreach ($products as $product) {
            $documents[] = $product->product_name . ' ' . $product->description;
        }

        // Calculate TF-IDF scores
        $vectorizer = new TokenCountVectorizer(new WhitespaceTokenizer());
        $vectorizer->fit($documents);
        $vectorizer->transform($documents);

        $tfIdfTransformer = new TfIdfTransformer();
        // In php-ml, transform mutates the samples array by reference and does not return a value.
        // We need to call fit() first, then transform() to populate TF-IDF values into $documents.
        $tfIdfTransformer->fit($documents);
        $tfIdfTransformer->transform($documents);

        // Calculate combined scores
        $scoredProducts = [];

        foreach ($products as $index => $product) {
            // Average sentiment score
            $avgSentiment = $product->reviews->avg('sentiment_score') ?? 0;

            // Average rating
            $avgRating = $product->rating ?? 0;

            // TF-IDF score (sum of all features for this document)
            // After transform(), $documents now contains the TF-IDF vectors
            $tfidfScore = (isset($documents[$index]) && is_array($documents[$index]))
                ? array_sum($documents[$index])
                : 0;

            // Combined score: prioritize rating, then sentiment, then content richness
            $combinedScore = ($avgRating * 10000) + ($avgSentiment * 100) + $tfidfScore;

            $scoredProducts[] = [
                'product' => $product,
                'avgRating' => $avgRating,
                'avgSentiment' => $avgSentiment,
                'tfidfScore' => $tfidfScore,
                'combinedScore' => $combinedScore,
            ];
        }

        // Sort by combined score
        usort($scoredProducts, function ($a, $b) {
            return $b['combinedScore'] <=> $a['combinedScore'];
        });

        // Return top products with scores
        $recommended = array_slice($scoredProducts, 0, $limit);

        return array_map(function ($item) {
            $product = $item['product']->toArray();
            $product['avgRating'] = $item['avgRating'];
            $product['avgSentiment'] = $item['avgSentiment'];
            $product['tfidfScore'] = $item['tfidfScore'];
            $product['combinedScore'] = $item['combinedScore'];
            return $product;
        }, $recommended);
    }
}
