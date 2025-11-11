<?php

namespace App\Services;

class SentimentAnalyzer
{
    private $afinnScores = [];

    public function __construct()
    {
        $this->loadAfinnScores();
    }

    /**
     * Analyze sentiment using AFINN lexicon
     */
    public function analyze(string $text): float
    {
        if (empty($text)) {
            return 0;
        }

        $text = strtolower($text);
        $words = $this->tokenize($text);

        $totalScore = 0;
        $wordCount = 0;

        foreach ($words as $word) {
            if (isset($this->afinnScores[$word])) {
                $totalScore += $this->afinnScores[$word];
                $wordCount++;
            }
        }

        if ($wordCount === 0) {
            return 0;
        }

        // Normalize to -1 to 1 range
        $avgScore = $totalScore / $wordCount;
        $normalizedScore = $avgScore / 5; // AFINN scores range from -5 to 5

        return round($normalizedScore, 2);
    }

    /**
     * Tokenize text
     */
    private function tokenize(string $text): array
    {
        $text = preg_replace('/[^\w\s]/', ' ', $text);
        $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        return array_map('trim', $words);
    }

    /**
     * Load AFINN sentiment scores
     * Simplified version - you can expand this
     */
    private function loadAfinnScores(): void
    {
        $this->afinnScores = [
            // Very positive (5)
            'outstanding' => 5, 'superb' => 5, 'excellent' => 5,

            // Positive (3-4)
            'amazing' => 4, 'wonderful' => 4, 'fantastic' => 4, 'awesome' => 4,
            'love' => 3, 'loved' => 3, 'great' => 3, 'good' => 3, 'best' => 3,
            'perfect' => 3, 'beautiful' => 3, 'delicious' => 3, 'tasty' => 3,
            'fresh' => 2, 'quality' => 2, 'recommend' => 2, 'happy' => 3,
            'like' => 2, 'nice' => 3, 'enjoy' => 2, 'enjoyed' => 2,

            // Neutral to slightly positive (1-2)
            'satisfied' => 2, 'pleasant' => 2, 'decent' => 1, 'ok' => 1,
            'okay' => 1, 'fine' => 1, 'acceptable' => 1,

            // Neutral to slightly negative (-1 to -2)
            'mediocre' => -1, 'average' => -1, 'meh' => -1, 'bland' => -2,
            'boring' => -2, 'disappointing' => -2, 'disappointed' => -2,

            // Negative (-3 to -4)
            'bad' => -3, 'poor' => -3, 'terrible' => -4, 'awful' => -4,
            'horrible' => -4, 'worst' => -4, 'hate' => -3, 'hated' => -3,
            'dislike' => -2, 'unpleasant' => -3, 'nasty' => -3,
            'disgusting' => -4, 'waste' => -3, 'avoid' => -2,

            // Very negative (-5)
            'appalling' => -5, 'atrocious' => -5, 'abysmal' => -5,

            // Coffee-specific words
            'aromatic' => 3, 'rich' => 2, 'smooth' => 2, 'bold' => 2,
            'flavorful' => 3, 'balanced' => 2, 'complex' => 2,
            'bitter' => -2, 'burnt' => -3, 'stale' => -3, 'weak' => -2,
            'sour' => -2, 'acidic' => -1, 'harsh' => -2,
        ];
    }

    /**
     * Get sentiment label
     */
    public function getLabel(float $score): string
    {
        if ($score > 0.05) return 'positive';
        if ($score < -0.05) return 'negative';
        return 'neutral';
    }
}
